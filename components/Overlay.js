"use client";

import { Leaf, Recycle, Activity } from "lucide-react";

export default function Overlay({ ecoData, scanning, mode = 'visual' }) {
    // If no data, show scanning state
    const data = ecoData;
    const isScanning = scanning || !data;

    // Header Color based on mode
    let modeColor = 'var(--primary)'; // Default Green (Visual)
    if (mode === 'custom') modeColor = '#8b5cf6'; // Purple (AI/Custom)

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, pointerEvents: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>

            {/* Header */}
            <header className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {mode === 'custom' ? <Activity color={modeColor} /> :
                        <Leaf color={modeColor} />}
                    <h1 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }}>EcoLens</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isScanning ? 'var(--accent)' : 'var(--primary)', animation: isScanning ? 'pulse 1s infinite' : 'none' }}></div>
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                        {mode === 'visual' ? 'AI VISION' : 'CUSTOM MODEL'}
                    </span>
                </div>
            </header>

            {/* Reticle / Focus Area (Center) */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isScanning && (
                    <div style={{
                        width: '250px',
                        height: '250px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '24px',
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Leaf size={48} color="rgba(255,255,255,0.5)" />

                        {/* Corner Markers */}
                        <div style={{ position: 'absolute', top: -2, left: -2, width: 20, height: 20, borderTop: `4px solid ${modeColor}`, borderLeft: `4px solid ${modeColor}`, borderRadius: '4px 0 0 0' }}></div>
                        <div style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderTop: `4px solid ${modeColor}`, borderRight: `4px solid ${modeColor}`, borderRadius: '0 4px 0 0' }}></div>
                        <div style={{ position: 'absolute', bottom: -2, left: -2, width: 20, height: 20, borderBottom: `4px solid ${modeColor}`, borderLeft: `4px solid ${modeColor}`, borderRadius: '0 0 0 4px' }}></div>
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderBottom: `4px solid ${modeColor}`, borderRight: `4px solid ${modeColor}`, borderRadius: '0 0 4px 0' }}></div>
                    </div>
                )}
            </div>

            {/* Result Card (Bottom) */}
            {data && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem', borderLeft: `6px solid ${data.color}`, transition: 'all 0.3s ease', pointerEvents: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{data.name}</h2>
                        <div style={{ background: data.color, color: '#000', padding: '0.2rem 0.6rem', borderRadius: '8px', fontWeight: 'bold' }}>
                            {data.rating} Rating
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} color="var(--primary)" />
                            <div>
                                <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>CARBON</p>
                                <p style={{ fontWeight: 'bold' }}>{data.carbon}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Recycle size={20} color="var(--secondary)" />
                            <div>
                                <p style={{ fontSize: '0.7rem', opacity: 0.7 }}>RECYCLE</p>
                                <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{data.recycle}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.9rem' }}>
                        💡 <b>Eco Tip:</b> {data.tip}
                    </div>
                </div>
            )}
        </div>
    );
}

