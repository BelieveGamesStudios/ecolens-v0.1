import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function POST(request) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "No image provided" },
                { status: 400 }
            );
        }

        // Initialize Gemini Pro Vision model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a specialized prompt for object detection and eco-analysis
        const prompt = `Analyze this image and identify the main object in focus. 
    
If you can identify a clear object, respond with JSON in this exact format:
{
  "detected": true,
  "object": "object name",
  "materials": ["material1", "material2"],
  "confidence": 0.95,
  "recyclable": true/false,
  "disposal": "brief disposal instruction"
}

If no clear object is visible or the image is unclear, respond with:
{
  "detected": false,
  "object": "unknown",
  "materials": [],
  "confidence": 0.0
}

Focus on common household items like bottles, cans, paper, plastic, glass, food items, electronics, etc.
Be concise and accurate.`;

        // Remove the data URL prefix if present
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

        // Send image to Gemini
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse the JSON response from Gemini
        let analysisResult;
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
            const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            analysisResult = JSON.parse(jsonText);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json({
                detected: false,
                object: "unknown",
                materials: [],
                confidence: 0.0,
                error: "Failed to parse response",
            });
        }

        return NextResponse.json(analysisResult);
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            {
                error: "Analysis failed",
                details: error.message,
                detected: false,
                object: "unknown",
                materials: [],
                confidence: 0.0
            },
            { status: 500 }
        );
    }
}
