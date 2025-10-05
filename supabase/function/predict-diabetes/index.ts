import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.json();
    console.log("Diabetes prediction request:", formData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Analyze this diabetes risk data and provide a medical risk assessment:
    
Patient Data:
- Pregnancies: ${formData.pregnancies}
- Glucose Level: ${formData.glucose} mg/dL
- Blood Pressure: ${formData.bloodPressure} mm Hg
- Skin Thickness: ${formData.skinThickness} mm
- Insulin: ${formData.insulin} μU/mL
- BMI: ${formData.bmi}
- Diabetes Pedigree Function: ${formData.diabetesPedigree}
- Age: ${formData.age}

Based on clinical guidelines:
- Normal glucose: 70-100 mg/dL (fasting)
- Pre-diabetes: 100-125 mg/dL
- Diabetes: ≥126 mg/dL
- Normal BMI: 18.5-24.9
- Overweight: 25-29.9
- Obese: ≥30

Provide a diabetes risk assessment with confidence level.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are a medical AI assistant specialized in diabetes risk assessment. Analyze patient data and provide accurate risk predictions." 
          },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "diabetes_risk_assessment",
              description: "Provide diabetes risk assessment based on patient data",
              parameters: {
                type: "object",
                properties: {
                  prediction: {
                    type: "string",
                    enum: ["High Risk", "Low Risk"],
                    description: "The risk level assessment"
                  },
                  probability: {
                    type: "number",
                    description: "Confidence level between 0-100"
                  }
                },
                required: ["prediction", "probability"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "diabetes_risk_assessment" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));
    
    const toolCall = data.choices[0].message.tool_calls?.[0];
    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in predict-diabetes function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
