import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Cache for different models
const modelCache = {
    standard: null, // MobileNet
};

export async function loadModel() {
    // Standard MobileNet Loading
    if (!modelCache.standard) {
        console.log("🔄 Loading Standard MobileNet model...");
        console.log("📡 Note: This requires internet access to download ~4MB model from Google CDN");
        try {
            modelCache.standard = await mobilenet.load({
                version: 2,
                alpha: 1.0
            });
            console.log("✅ MobileNet model loaded successfully!");
        } catch (error) {
            console.error("❌ Failed to load MobileNet model:", error);

            // Provide helpful error message
            if (error.message && error.message.includes("fetch")) {
                console.error(`
🚫 NETWORK ERROR - Cannot load AI model
                
Possible causes:
1. No internet connection
2. Firewall/proxy blocking storage.googleapis.com
3. Network restrictions in your location

Solutions:
- Check your internet connection
- Try disabling VPN/proxy temporarily
- Contact your network administrator if on corporate network
- Try a different network (mobile hotspot, different WiFi)

The MobileNet model (~4MB) must be downloaded from Google's CDN.
                `);

                // Show user-friendly error in UI
                alert("⚠️ Cannot load AI model - Please check your internet connection.\n\nThe app needs to download a 4MB AI model from Google's servers. Make sure you have internet access and try refreshing the page.");
            }
            throw error;
        }
    }
    return modelCache.standard;
}

export async function detectObject(videoElement) {
    try {
        console.log("🎥 detectObject called, video ready state:", videoElement?.readyState);

        const model = await loadModel();

        if (model && videoElement && videoElement.readyState === 4) {
            console.log("🔍 Running classification...");
            // Standard MobileNet Library
            const predictions = await model.classify(videoElement);
            console.log("📊 Predictions received:", predictions);
            return predictions;
        } else {
            console.log("⏳ Video not ready yet (readyState: " + videoElement?.readyState + ")");
        }
    } catch (err) {
        console.error("❌ Detection Error:", err);
    }
    return [];
}
