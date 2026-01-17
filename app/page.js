"use client";

import { useState, useRef, useEffect } from "react";
import CameraView from "@/components/CameraView";
import Overlay from "@/components/Overlay";
// import { detectObject } from "@/utils/detector"; // Legacy MobileNet
import { getEcoData } from "@/utils/ecoDatabase";

export default function Home() {
  const [activeData, setActiveData] = useState(null); // Init as null to show viewfinder
  const [scanning, setScanning] = useState(false); // "scanning" now means "analyzing"

  const videoRef = useRef(null);

  // We keep a reference to the loop just in case we need it later, or for cleanup
  const loopRef = useRef(null);

  const handleStreamReady = (videoElement) => {
    videoRef.current = videoElement;
  };

  const handleScan = async () => {
    if (!videoRef.current) return;

    setScanning(true);

    try {
      // Capture frame
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);

      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setActiveData(data);

    } catch (error) {
      console.error("Scan error:", error);
      alert("Failed to analyze object. Check API Key in .env.local");
      // Fallback or keep previous data?
      // Maybe show default if failed?
      setActiveData(getEcoData("default"));
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup if we had any loops
    };
  }, []);

  return (
    <main>
      <CameraView onStreamReady={handleStreamReady} />
      <Overlay ecoData={activeData} scanning={scanning} onScan={handleScan} />
    </main>
  );
}
