
import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { image } = await request.json();

        if (!image) {
            return NextResponse.json(
                { error: "Image data is required" },
                { status: 400 }
            );
        }

        const groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });

        // Remove data:image/jpeg;base64, prefix if present
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Identify the main object in this image. Return a JSON object with the following fields: 'name' (string, short name), 'color' (string, a hex color code matching the object vibe usually green/blue/brown/grey), 'rating' (string, 'Eco-Friendly', 'Neutral', or 'Hazardous'), 'carbon' (string, estimated carbon footprint e.g. 'Low'), 'recycle' (string, recycling instructions), and 'tip' (string, a short sustainability tip). Return ONLY valid JSON, no markdown formatting.",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                            },
                        },
                    ],
                },
            ],
            model: "llama-3.2-11b-vision-preview",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0]?.message?.content;
        let ecoData;

        try {
            ecoData = JSON.parse(content);
        } catch (parseError) {
            console.error("Failed to parse Groq response:", content);
            return NextResponse.json({ error: "Failed to parse analysis results" }, { status: 500 });
        }

        return NextResponse.json(ecoData);

    } catch (error) {
        console.error("Groq Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to analyze image" },
            { status: 500 }
        );
    }
}
