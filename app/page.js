"use client";

import { useState, useRef, useEffect } from "react";
import CameraView from "@/components/CameraView";
import Overlay from "@/components/Overlay";
import { detectObject } from "@/utils/detector";
import { getEcoData } from "@/utils/ecoDatabase";
import { Eye } from "lucide-react";

export default function Home() {
  console.log("🎬 EcoLens Page Component Loaded!");

  const [activeData, setActiveData] = useState(getEcoData("default"));
  const [scanning, setScanning] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);

  const videoRef = useRef(null);
  const loopRef = useRef(null);
  const lastPredictionRef = useRef(0);

  const handleStreamReady = (videoElement) => {
    console.log("📹 Camera stream ready! Video element:", videoElement);
    videoRef.current = videoElement;
    startDetectionLoop();
  };

  const startDetectionLoop = () => {
    if (loopRef.current) return;

    console.log("🚀 Starting detection loop...");

    const loop = async () => {
      if (videoRef.current) {
        try {
          const now = Date.now();
          // Throttle detection to every 500ms
          if (now - lastPredictionRef.current > 500) {

            console.log("🔄 Running detection cycle...");
            const predictions = await detectObject(videoRef.current);
            console.log("📦 Received predictions:", predictions);

            // Model has loaded successfully if we got predictions
            if (predictions && predictions.length > 0) {
              if (modelLoading) {
                setModelLoading(false);
                console.log("✅ Model loaded successfully!");
              }

              const topResult = predictions[0];
              console.log("🎯 Top result:", topResult.className, "confidence:", topResult.probability);

              if (topResult.probability > 0.6) {
                console.log("✅ Confidence threshold met! Looking up eco data for:", topResult.className);
                const ecoData = getEcoData(topResult.className);
                console.log("📋 Eco data found:", ecoData);
                setActiveData(ecoData);
                setScanning(false);
              } else {
                console.log("⚠️ Confidence too low:", topResult.probability);
              }
            } else {
              console.log("❌ No predictions received");
            }

            lastPredictionRef.current = now;
          }
        } catch (e) {
          console.error("❌ Detection error:", e);
        }
      } else {
        console.log("⏳ Video element not ready");
      }
      loopRef.current = requestAnimationFrame(loop);
    };

    loop();
  };

  useEffect(() => {
    return () => {
      if (loopRef.current) cancelAnimationFrame(loopRef.current);
    };
  }, []); // Only run once on mount

  return (
    <main>
      <CameraView onStreamReady={handleStreamReady} />
      <Overlay ecoData={activeData} scanning={scanning} modelLoading={modelLoading} />
    </main>
  );
}

