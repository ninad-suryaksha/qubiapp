import React, { useState } from 'react';
import { QubitDot } from './QubitDot';
import { sounds } from '../utils/audio';

interface BlochSphereProps {
  initialTheta?: number; // 0 (zero / top) to Math.PI (one / bottom)
  onChange?: (theta: number) => void;
  className?: string;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({
  initialTheta = Math.PI / 4, // 45 deg = blend
  onChange,
  className = '',
}) => {
  // theta from 0 (top = |0>) to Math.PI (bottom = |1>)
  const [theta, setTheta] = useState(initialTheta);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTheta(val);
    sounds.playClick(400 + val * 200, 0.02);
    if (onChange) onChange(val);
  };

  // Coordinates on 2D projection
  // Sphere center: (120, 120), radius R = 75
  const cx = 120;
  const cy = 120;
  const R = 75;

  // Arrow tip coordinates based on theta (polar angle from positive Z axis, which is up)
  // angle in standard math: 0 = up (0, -R), PI = down (0, +R)
  // Let's add slight phi offset for 3D tilt
  const phi = Math.PI / 6; // 30 deg perspective tilt
  const tipX = cx + R * Math.sin(theta) * Math.cos(phi);
  const tipY = cy - R * Math.cos(theta) * 0.95 + R * Math.sin(theta) * Math.sin(phi) * 0.35;

  // Probability of measuring |1> = sin²(theta / 2)
  const probOne = Math.pow(Math.sin(theta / 2), 2);
  const probZero = 1 - probOne;

  // Determine visual qubit state
  let currentState: 'zero' | 'one' | 'blend' = 'blend';
  if (probOne < 0.15) currentState = 'zero';
  else if (probOne > 0.85) currentState = 'one';
  else currentState = 'blend';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* SVG Sphere matching PDF page 8 */}
      <div className="relative w-[240px] h-[240px]">
        <svg viewBox="0 0 240 240" className="w-full h-full select-none">
          {/* Sphere Outer Outline */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="#FAFAF8"
            stroke="#D6D3D1"
            strokeWidth="1.2"
          />

          {/* Equator Dashed Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={R}
            ry={26}
            fill="none"
            stroke="#D6D3D1"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Vertical Z Axis */}
          <line
            x1={cx}
            y1={cy - R - 12}
            x2={cx}
            y2={cy + R + 12}
            stroke="#D6D3D1"
            strokeWidth="1"
            strokeDasharray="2 2"
          />

          {/* Top Label: "zero" */}
          <text
            x={cx}
            y={cy - R - 18}
            textAnchor="middle"
            className="text-[13px] fill-stone-700 font-medium"
          >
            zero
          </text>

          {/* Bottom Label: "one" */}
          <text
            x={cx}
            y={cy + R + 26}
            textAnchor="middle"
            className="text-[13px] fill-stone-700 font-medium"
          >
            one
          </text>

          {/* State Vector Arrow */}
          <line
            x1={cx}
            y1={cy}
            x2={tipX}
            y2={tipY}
            stroke="#F58720"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Arrow Tip Dot */}
          <circle
            cx={tipX}
            cy={tipY}
            r="6.5"
            fill="#F58720"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />

          {/* Center Pivot Point */}
          <circle cx={cx} cy={cy} r="3" fill="#D6D3D1" />
        </svg>
      </div>

      {/* Interactive Angle Slider */}
      <div className="w-full max-w-[280px] mt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-stone-500 font-medium px-1">
          <span>|0⟩ zero (top)</span>
          <span className="text-orange-600 font-semibold">
            {(probOne * 100).toFixed(0)}% lit
          </span>
          <span>|1⟩ one (bottom)</span>
        </div>
        <input
          type="range"
          min="0"
          max={Math.PI}
          step="0.05"
          value={theta}
          onChange={handleSliderChange}
          className="w-full accent-[#F58720] cursor-pointer"
        />
      </div>

      {/* Live Qubit Light Readout */}
      <div className="mt-4 flex items-center gap-3 bg-stone-50 border border-stone-200/70 rounded-2xl px-4 py-2.5">
        <span className="text-xs text-stone-600 font-medium">resulting light:</span>
        <QubitDot state={currentState} size="sm" />
        <span className="text-xs font-semibold text-stone-800">
          {currentState === 'blend'
            ? `blend (${(probZero * 100).toFixed(0)}% / ${(probOne * 100).toFixed(0)}%)`
            : currentState}
        </span>
      </div>
    </div>
  );
};
