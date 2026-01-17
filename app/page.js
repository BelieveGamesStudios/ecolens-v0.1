"use client";

import { useState, useRef, useEffect } from "react";
import CameraView from "@/components/CameraView";
import Overlay from "@/components/Overlay";
import { detectObject } from "@/utils/detector";
import { getEcoData } from "@/utils/ecoDatabase";
import { Eye } from "lucide-react";

export default function Home() {
  const [activeData, setActiveData] = useState(null);
  const [scanning, setScanning] = useState(true);

  const videoRef = useRef(null);
  const loopRef = useRef(null);
  const lastPredictionRef = useRef(0);

  const handleStreamReady = (videoElement) => {
    videoRef.current = videoElement;
    startDetectionLoop();
  };

  const startDetectionLoop = () => {
    if (loopRef.current) return;

    const loop = async () => {
      if (videoRef.current) {
        try {
          const now = Date.now();
          // Throttle detection to every 500ms
          if (now - lastPredictionRef.current > 500) {

            const predictions = await detectObject(videoRef.current);
            if (predictions && predictions.length > 0) {
              const topResult = predictions[0];
              if (topResult.probability > 0.6) {
                setActiveData(getEcoData(topResult.className));
                setScanning(false);
              }
            }

            lastPredictionRef.current = now;
          }
        } catch (e) {
          console.error("Detection error:", e);
        }
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
      <Overlay ecoData={activeData} scanning={scanning} />
    </main>
  );
}

