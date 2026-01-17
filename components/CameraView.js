"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, AlertCircle } from "lucide-react";

export default function CameraView({ onStreamReady }) {
    const videoRef = useRef(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment", // Use back camera on mobile
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false,
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setLoading(false);
                        if (onStreamReady) onStreamReady(videoRef.current);
                    };
                }
            } catch (err) {
                console.error("Camera access error:", err);
                setError("Could not access camera. Please allow permission.");
                setLoading(false);
            }
        }

        setupCamera();

        return () => {
            // Cleanup stream
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [onStreamReady]);

    return (
        <div className="camera-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, background: '#000' }}>
            {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--primary)' }}>
                    <Camera className="animate-pulse" size={48} />
                    <p style={{ marginTop: '1rem' }}>Initializing EcoLens...</p>
                </div>
            )}

            {error && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--accent)', padding: '2rem', textAlign: 'center' }}>
                    <AlertCircle size={48} style={{ marginBottom: '1rem' }} />
                    <p>{error}</p>
                </div>
            )}

            <video
                ref={videoRef}
                playsInline
                muted
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: loading || error ? 'none' : 'block'
                }}
            />
        </div>
    );
}
