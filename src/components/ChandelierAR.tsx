import React, { useRef, useState, useEffect } from 'react';
import { Camera, ZoomIn, Sparkles, Thermometer } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ChandelierARProps {
  onTapProcessor: () => void;
  onBack?: () => void;
}

export const ChandelierAR: React.FC<ChandelierARProps> = ({
  onTapProcessor,
}) => {
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hoveredStage, setHoveredStage] = useState<{ name: string; temp: string; desc: string } | null>(null);

  // Handle camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable', err);
          setCameraError('Camera access unavailable. Using AR simulation.');
          setUseCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useCamera]);

  const handleProcessorClick = () => {
    sounds.playGate();
    onTapProcessor();
  };

  return (
    <div className="relative w-full h-full min-h-[460px] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Background: Camera Feed or Rich Simulated AR Room Surface */}
      {useCamera ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FFFDF8] via-[#FFF3DE] to-[#FED7AA]/60">
          {/* Volumetric ambient warm light cone descending from above */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[380px] h-[480px] pointer-events-none opacity-85"
            style={{
              background: 'radial-gradient(ellipse at 50% 10%, rgba(254, 215, 170, 0.7) 0%, rgba(251, 146, 60, 0.25) 45%, rgba(254, 243, 199, 0.05) 70%, transparent 85%)',
            }}
          />

          {/* Core glow behind the cryogenic stages */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full pointer-events-none blur-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(251, 146, 60, 0.35) 0%, rgba(245, 135, 32, 0.15) 50%, transparent 75%)',
            }}
          />

          {/* AR Surface Tracking Grid Plane */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_right,#EA580C18_1px,transparent_1px),linear-gradient(to_bottom,#EA580C18_1px,transparent_1px)] bg-[size:28px_28px] [transform:perspective(500px)_rotateX(60deg)] opacity-70 pointer-events-none origin-bottom" />
        </div>
      )}

      {/* AR Camera Mode Switch Pill & Temperature indicator */}
      <div className="absolute top-3 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-amber-900 border border-amber-200/70 shadow-sm">
          <Thermometer className="w-3.5 h-3.5 text-orange-600" />
          <span>Base Temp: 15 mK (-273.13°C)</span>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setUseCamera(!useCamera);
          }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-md text-stone-700 hover:text-stone-900 border border-amber-200/60 shadow-sm transition-all active:scale-95"
          title={useCamera ? 'Switch to AR simulation' : 'Use real device camera'}
        >
          <Camera className="w-3.5 h-3.5 text-orange-500" />
          <span>{useCamera ? 'Simulation' : 'Camera'}</span>
        </button>
      </div>

      {/* Cryogenic Chandelier Graphic (SVG) */}
      <div className="relative z-10 w-full max-w-[360px] h-[380px] flex items-center justify-center">
        <svg
          viewBox="0 0 320 380"
          className="w-full h-full filter drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Multi-stop gold plate gradient */}
            <linearGradient id="goldPlate" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B45309" />
              <stop offset="20%" stopColor="#F59E0B" />
              <stop offset="45%" stopColor="#FEF3C7" />
              <stop offset="70%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#92400E" />
            </linearGradient>

            {/* Stage radial fill with luminous rim */}
            <radialGradient id="plateTop" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FFFDF5" />
              <stop offset="50%" stopColor="#FEF3C7" />
              <stop offset="85%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>

            <linearGradient id="goldTube" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92400E" />
              <stop offset="40%" stopColor="#FCD34D" />
              <stop offset="60%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Central Support Rods & Cryogenic Tubes */}
          <line x1="160" y1="15" x2="160" y2="280" stroke="url(#goldTube)" strokeWidth="4.5" />
          <line x1="146" y1="25" x2="146" y2="280" stroke="url(#goldTube)" strokeWidth="1.8" strokeOpacity="0.85" />
          <line x1="174" y1="25" x2="174" y2="280" stroke="url(#goldTube)" strokeWidth="1.8" strokeOpacity="0.85" />
          <line x1="135" y1="45" x2="135" y2="240" stroke="url(#goldTube)" strokeWidth="1.2" strokeOpacity="0.6" />
          <line x1="185" y1="45" x2="185" y2="240" stroke="url(#goldTube)" strokeWidth="1.2" strokeOpacity="0.6" />

          {/* Stage 1 (Top / 50K plate) */}
          <g
            className="cursor-pointer transition-all hover:brightness-105"
            onMouseEnter={() => setHoveredStage({ name: '50K Thermal Shield', temp: '50 Kelvin (-223°C)', desc: 'First barrier shedding ambient room radiation' })}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <ellipse cx="160" cy="50" rx="98" ry="19" fill="url(#plateTop)" stroke="#D97706" strokeWidth="2.2" />
            <ellipse cx="160" cy="52" rx="96" ry="17" fill="none" stroke="#FBBF24" strokeWidth="1" strokeOpacity="0.8" />
          </g>

          {/* Stage 2 (4K plate) */}
          <g
            className="cursor-pointer transition-all hover:brightness-105"
            onMouseEnter={() => setHoveredStage({ name: '4K Stage', temp: '4 Kelvin (-269°C)', desc: 'Liquid helium cooling zone for amplifier electronics' })}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <ellipse cx="160" cy="115" rx="74" ry="15" fill="url(#plateTop)" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="160" cy="117" rx="72" ry="14" fill="none" stroke="#FBBF24" strokeWidth="1" strokeOpacity="0.8" />
          </g>

          {/* Stage 3 (Still / 800mK plate) */}
          <g
            className="cursor-pointer transition-all hover:brightness-105"
            onMouseEnter={() => setHoveredStage({ name: 'Still Stage', temp: '800 milliKelvin', desc: 'Evaporates Helium-3 to extract heat' })}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <ellipse cx="160" cy="175" rx="55" ry="12" fill="url(#plateTop)" stroke="#D97706" strokeWidth="2" />
            <ellipse cx="160" cy="177" rx="53" ry="11" fill="none" stroke="#FBBF24" strokeWidth="1" strokeOpacity="0.8" />
          </g>

          {/* Stage 4 (Mixing Chamber / 100mK plate) */}
          <g
            className="cursor-pointer transition-all hover:brightness-105"
            onMouseEnter={() => setHoveredStage({ name: 'Mixing Chamber Stage', temp: '100 milliKelvin', desc: 'Helium-3 and Helium-4 dilution phase boundary' })}
            onMouseLeave={() => setHoveredStage(null)}
          >
            <ellipse cx="160" cy="235" rx="38" ry="9" fill="url(#plateTop)" stroke="#D97706" strokeWidth="2" />
          </g>

          {/* Target Reticle (Dashed circle from page 2) */}
          <circle
            cx="160"
            cy="278"
            r="88"
            fill="none"
            stroke="#EA580C"
            strokeWidth="2"
            strokeDasharray="5 5"
            className="animate-[spin_40s_linear_infinite]"
          />

          {/* Ambient Processor Core Glow */}
          <circle cx="160" cy="278" r="32" fill="rgba(249, 115, 22, 0.25)" />
          <circle cx="160" cy="278" r="18" fill="rgba(249, 115, 22, 0.45)" />

          {/* The Processor Chip Disc & Shield */}
          <g
            onClick={handleProcessorClick}
            className="cursor-pointer group"
          >
            <ellipse
              cx="160"
              cy="255"
              rx="25"
              ry="7.5"
              fill="#F59E0B"
              stroke="#EA580C"
              strokeWidth="2"
              className="transition-transform group-hover:scale-110"
            />
            {/* The Silicon Processor Chip Box */}
            <rect
              x="151"
              y="262"
              width="18"
              height="18"
              rx="3"
              fill="#1C1917"
              stroke="#F58720"
              strokeWidth="1.8"
              className="transition-transform group-hover:scale-125"
            />
            {/* Quantum Core Dot */}
            <circle cx="160" cy="271" r="3" fill="#F97316" className="animate-ping origin-center" />
            <circle cx="160" cy="271" r="3.5" fill="#FFA84A" />
          </g>
        </svg>

        {/* Floating Tap Button on the Target */}
        <button
          onClick={handleProcessorClick}
          className="absolute bottom-5 px-5 py-2.5 bg-gradient-to-r from-white via-white to-amber-50 rounded-full border border-orange-300 shadow-lg flex items-center gap-2 text-xs font-bold text-orange-950 hover:from-amber-50 hover:to-orange-100 active:scale-95 transition-all group"
        >
          <ZoomIn className="w-4 h-4 text-orange-600 group-hover:scale-110 transition-transform" />
          <span>tap processor to zoom in</span>
        </button>
      </div>

      {/* Hover info tooltip */}
      {hoveredStage && (
        <div className="absolute bottom-20 z-20 px-4 py-2 bg-stone-900/90 backdrop-blur-md text-white text-xs rounded-2xl shadow-xl border border-stone-700/50 flex flex-col items-center gap-0.5 animate-in fade-in duration-150">
          <span className="font-bold text-amber-300">{hoveredStage.name} ({hoveredStage.temp})</span>
          <span className="text-stone-300 text-[11px]">{hoveredStage.desc}</span>
        </div>
      )}
    </div>
  );
};
