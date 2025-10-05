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
    console.log("Parkinsons prediction request:", formData);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Analyze this voice measurement data for Parkinson's disease indicators:

Voice Measurements:
- MDVP:Fo(Hz): ${formData.mdvpFo}
- MDVP:Fhi(Hz): ${formData.mdvpFhi}
- MDVP:Flo(Hz): ${formData.mdvpFlo}
- MDVP:Jitter(%): ${formData.mdvpJitter}
- MDVP:Jitter(Abs): ${formData.mdvpJitterAbs}
- MDVP:RAP: ${formData.mdvpRap}
- MDVP:PPQ: ${formData.mdvpPpq}
- Jitter:DDP: ${formData.jitterDdp}
- MDVP:Shimmer: ${formData.mdvpShimmer}
- MDVP:Shimmer(dB): ${formData.mdvpShimmerDb}
- Shimmer:APQ3: ${formData.shimmerApq3}
- Shimmer:APQ5: ${formData.shimmerApq5}
- MDVP:APQ: ${formData.mdvpApq}
- Shimmer:DDA: ${formData.shimmerDda}
- NHR: ${formData.nhr}
- HNR: ${formData.hnr}
- RPDE: ${formData.rpde}
- DFA: ${formData.dfa}
- Spread1: ${formData.spread1}
- Spread2: ${formData.spread2}
- D2: ${formData.d2}
- PPE: ${formData.ppe}

Key indicators for Parkinson's:
- High jitter values indicate vocal instability
- High shimmer values suggest amplitude variations
- Low HNR (Harmonic-to-Noise Ratio) indicates vocal cord issues
- RPDE and DFA measure complexity and signal fractal scaling

Provide a Parkinson's disease risk assessment.`;

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
            content: "You are a medical AI assistant specialized in analyzing voice measurements for Parkinson's disease detection. Analyze biomedical voice data and provide accurate predictions." 
          },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "parkinsons_assessment",
              description: "Provide Parkinson's disease risk assessment based on voice measurements",
              parameters: {
                type: "object",
                properties: {
                  prediction: {
                    type: "string",
                    enum: ["Positive", "Negative"],
                    description: "The assessment result"
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
        tool_choice: { type: "function", function: { name: "parkinsons_assessment" } }
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
    console.error("Error in predict-parkinsons function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
