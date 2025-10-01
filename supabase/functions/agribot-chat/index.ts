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
    const { question } = await req.json();
    
    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Agribot AI, a multilingual farm assistant chatbot for Indian farmers.
Your job is to provide trusted, simple, and farmer-friendly information only about:
- Crop pest problems
- Plant diseases
- Treatment and remedies
- Long-term prevention methods

Rules:
1. Always give the answer in three languages: English, Hindi, and Kannada.
2. Output must be a JSON object with three keys: "en", "hi", "kn".
3. Keep answers short (3–5 sentences per language). 
   - Sentence 1: State the pest/disease and crop affected.
   - Sentence 2–3: Give immediate treatment instructions (low-cost, simple).
   - Sentence 4–5: Provide prevention tips (resistant seeds, crop rotation, spacing, etc.).
4. Use simple words farmers can understand. Avoid long technical terms.
5. If the user asks something not related to farming, pests, or plant health, reply: 
   {"en": "I can only answer questions about pests and crop diseases.", "hi": "मैं केवल कीटों और फसल रोगों के बारे में जानकारी दे सकता हूँ।", "kn": "ನಾನು ಕೀಟಗಳು ಮತ್ತು ಬೆಳೆ ರೋಗಗಳ ಬಗ್ಗೆ ಮಾತ್ರ ಮಾಹಿತಿ ನೀಡಬಹುದು."}
6. Do not use bullet points or formatting. Just plain spoken text.
7. CRITICAL: Your response MUST be valid JSON with exactly three keys: en, hi, kn. Each key must contain plain text (no markdown, no special formatting).`;

    console.log("Calling AI with question:", question);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.7,
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
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    console.log("AI response:", aiResponse);

    // Try to parse the JSON response
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResponse = JSON.parse(cleanedResponse);
      
      // Validate the response has all required keys
      if (!parsedResponse.en || !parsedResponse.hi || !parsedResponse.kn) {
        throw new Error("Missing required language keys");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return new Response(
        JSON.stringify({
          en: "I encountered an error processing your question. Please try rephrasing it.",
          hi: "आपके प्रश्न को संसाधित करने में त्रुटि हुई। कृपया इसे दोबारा पूछें।",
          kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸಂಸ್ಕರಿಸುವಲ್ಲಿ ದೋಷ ಎದುರಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಕೇಳಿ."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in agribot-chat:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        en: "An error occurred. Please try again.",
        hi: "एक त्रुटि हुई। कृपया पुनः प्रयास करें।",
        kn: "ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
