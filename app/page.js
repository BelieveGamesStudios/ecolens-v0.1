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
  const [mode, setMode] = useState("visual"); // "visual" or "custom"

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

            if (mode === "visual") {
              const predictions = await detectObject(videoRef.current);
              if (predictions && predictions.length > 0) {
                const topResult = predictions[0];
                if (topResult.probability > 0.6) {
                  setActiveData(getEcoData(topResult.className));
                  setScanning(false);
                }
              }
            } else if (mode === "custom") {
              // CUSTOM MODEL MODE
              // Assuming model is at /model/model.json
              const predictions = await detectObject(videoRef.current, "/model/model.json");
              if (predictions && predictions.length > 0) {
                const topResult = predictions[0];
                if (topResult.probability > 0.6) {
                  // Map Class 0/1 to Data
                  // This needs the user's mapping!
                  const data = getEcoData(`class_${topResult.index}`);
                  setActiveData(data);
                  setScanning(false);
                }
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

  // Effect to reset scanning when mode changes
  useEffect(() => {
    setActiveData(null);
    setScanning(true);
  }, [mode]);

  return (
    <main>
      <CameraView onStreamReady={handleStreamReady} />

      {/* Mode Toggle */}
      <div style={{ position: 'fixed', top: '5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', background: 'rgba(0,0,0,0.6)', borderRadius: '20px', padding: '4px' }}>
        <button
          onClick={() => setMode("visual")}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '16px', border: 'none',
            background: mode === "visual" ? "var(--primary)" : "transparent",
            color: mode === "visual" ? "#000" : "#fff",
            fontWeight: 'bold', cursor: 'pointer'
          }}>
          <Eye size={16} /> Visual
        </button>
        <button
          onClick={() => setMode("custom")}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 16px', borderRadius: '16px', border: 'none',
            background: mode === "custom" ? "var(--primary)" : "transparent",
            color: mode === "custom" ? "#000" : "#fff",
            fontWeight: 'bold', cursor: 'pointer'
          }}>
          <Eye size={16} /> Custom AI
        </button>
      </div>

      <Overlay ecoData={activeData} scanning={scanning} mode={mode} />
    </main>
  );
}

