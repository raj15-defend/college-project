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
    console.log("Heart disease prediction request:", formData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Analyze this cardiovascular health data and provide a heart disease risk assessment:

Patient Data:
- Age: ${formData.age}
- Sex: ${formData.sex === "1" ? "Male" : "Female"}
- Chest Pain Type: ${formData.cp} (0=asymptomatic, 1=atypical angina, 2=non-anginal, 3=typical angina)
- Resting Blood Pressure: ${formData.trestbps} mm Hg
- Serum Cholesterol: ${formData.chol} mg/dl
- Fasting Blood Sugar >120mg/dl: ${formData.fbs === "1" ? "Yes" : "No"}
- Resting ECG Results: ${formData.restecg}
- Max Heart Rate: ${formData.thalach}
- Exercise Induced Angina: ${formData.exang === "1" ? "Yes" : "No"}
- ST Depression: ${formData.oldpeak}
- Slope of Peak Exercise ST: ${formData.slope}
- Number of Major Vessels: ${formData.ca}
- Thalassemia: ${formData.thal}

Clinical guidelines:
- Normal BP: <120/80 mm Hg
- Elevated: 120-129/<80
- High BP: ≥130/80
- Normal cholesterol: <200 mg/dl
- Borderline high: 200-239
- High: ≥240

Provide a heart disease risk assessment.`;

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
            content: "You are a medical AI assistant specialized in cardiovascular disease risk assessment. Analyze patient cardiac health data and provide accurate risk predictions." 
          },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "heart_disease_assessment",
              description: "Provide heart disease risk assessment based on cardiovascular data",
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
        tool_choice: { type: "function", function: { name: "heart_disease_assessment" } }
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
    console.error("Error in predict-heart-disease function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
