import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

// Cache for different models
const modelCache = {
    standard: null, // MobileNet
    custom: null    // Custom TFJS
};

export async function loadModel(url = null) {
    if (url) {
        // Custom Model Loading
        if (!modelCache.custom) {
            console.log("Loading Custom Model from:", url);
            modelCache.custom = await tf.loadLayersModel(url);
        }
        return modelCache.custom;
    } else {
        // Standard MobileNet Loading
        if (!modelCache.standard) {
            console.log("Loading Standard MobileNet model...");
            modelCache.standard = await mobilenet.load({ version: 2, alpha: 1.0 });
        }
        return modelCache.standard;
    }
}

export async function detectObject(videoElement, modelUrl = null) {
    try {
        const model = await loadModel(modelUrl);

        if (model && videoElement && videoElement.readyState === 4) {
            // DIFFERENT LOGIC FOR OBSOLETE MOBILENET VS CUSTOM LAYERS MODEL
            if (modelUrl) {
                // Custom Model (TensorFlow.js LayersModel)
                // 1. Preprocess image
                const tfImg = tf.browser.fromPixels(videoElement)
                    .resizeNearestNeighbor([224, 224]) // MobileNetV2 input size
                    .toFloat()
                    .expandDims();

                // 2. Predict
                const predictions = await model.predict(tfImg).data();

                // 3. Cleanup
                tfImg.dispose();

                // 4. Format Result
                // Find max probability index
                const maxProb = Math.max(...predictions);
                const maxIndex = predictions.indexOf(maxProb);

                return [{
                    className: `class_${maxIndex}`, // Matches ecoDatabase keys
                    probability: maxProb,
                    index: maxIndex
                }];

            } else {
                // Standard MobileNet Library
                const predictions = await model.classify(videoElement);
                return predictions;
            }
        }
    } catch (err) {
        console.error("Detection Error:", err);
    }
    return [];
}
