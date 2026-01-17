import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Cache for different models
const modelCache = {
    standard: null, // MobileNet
};

export async function loadModel() {
    // Standard MobileNet Loading
    if (!modelCache.standard) {
        console.log("Loading Standard MobileNet model...");
        modelCache.standard = await mobilenet.load({ version: 2, alpha: 1.0 });
    }
    return modelCache.standard;
}

export async function detectObject(videoElement) {
    try {
        const model = await loadModel();

        if (model && videoElement && videoElement.readyState === 4) {
            // Standard MobileNet Library
            const predictions = await model.classify(videoElement);
            return predictions;
        }
    } catch (err) {
        console.error("Detection Error:", err);
    }
    return [];
}
