import React, { useEffect, useState, useRef } from 'react';
import { sounds } from '../utils/audio';

interface QubiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  mood?: 'happy' | 'neutral' | 'curious' | 'excited' | 'thinking';
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const QubiAvatar: React.FC<QubiAvatarProps> = ({
  size = 'md',
  mood = 'neutral',
  interactive = true,
  className = '',
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [isWinking, setIsWinking] = useState(false);
  const lastInteractionTime = useRef<number>(Date.now());

  // Max eye displacement based on avatar size
  const maxTravel = {
    sm: { x: 2.5, y: 2 },
    md: { x: 4, y: 3 },
    lg: { x: 6, y: 4.5 },
    hero: { x: 9, y: 7 },
  }[size];

  // Natural blinking cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3200 + Math.random() * 2800);

    return () => clearInterval(blinkInterval);
  }, []);

  // Idle wandering / looking around behavior when user is not moving pointer
  useEffect(() => {
    const wanderInterval = setInterval(() => {
      const timeSinceLast = Date.now() - lastInteractionTime.current;
      if (timeSinceLast > 2200) {
        // Natural ambient saccadic glance
        const randomGlances = [
          { x: -maxTravel.x * 0.75, y: 0 },                  // look left
          { x: maxTravel.x * 0.75, y: 0 },                   // look right
          { x: 0, y: -maxTravel.y * 0.7 },                   // look up thoughtfully
          { x: -maxTravel.x * 0.4, y: maxTravel.y * 0.5 },   // look down-left
          { x: maxTravel.x * 0.4, y: -maxTravel.y * 0.4 },   // look up-right
          { x: 0, y: 0 },                                    // center
        ];
        const nextGlance = randomGlances[Math.floor(Math.random() * randomGlances.length)];
        setEyeOffset(nextGlance);
      }
    }, 2400);

    return () => clearInterval(wanderInterval);
  }, [maxTravel]);

  // Global pointer & touch tracking across the entire screen
  useEffect(() => {
    if (!interactive) return;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      lastInteractionTime.current = Date.now();
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist === 0) {
        setEyeOffset({ x: 0, y: 0 });
        return;
      }

      // Smooth gaze interpolation with soft clamping
      const normalizedX = dx / dist;
      const normalizedY = dy / dist;
      const intensity = Math.min(dist / 220, 1);

      setEyeOffset({
        x: normalizedX * maxTravel.x * intensity,
        y: normalizedY * maxTravel.y * intensity,
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
    };
  }, [interactive, maxTravel]);

  const handleClick = () => {
    sounds.playClick(720, 0.05);
    setIsWinking(true);
    setTimeout(() => setIsWinking(false), 300);
    if (onClick) onClick();
  };

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    hero: 'w-32 h-32 md:w-36 md:h-36',
  }[size];

  const eyeSizeClasses = {
    sm: 'w-1.5 h-3',
    md: 'w-2.5 h-4.5',
    lg: 'w-3.5 h-6.5',
    hero: 'w-4.5 h-10',
  }[size];

  const eyeGap = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-3.5',
    hero: 'gap-4',
  }[size];

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`relative rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95 ${sizeClasses} ${className}`}
      style={{
        background: 'radial-gradient(circle at 32% 28%, #FFAE54 0%, #F58720 50%, #D96000 100%)',
        boxShadow:
          size === 'hero'
            ? '0 16px 48px -6px rgba(245, 135, 32, 0.45), 0 0 24px 4px rgba(254, 215, 170, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
            : '0 6px 18px -2px rgba(245, 135, 32, 0.4), inset 0 1.5px 3px rgba(255, 255, 255, 0.5)',
      }}
      title="Tap me! I follow your touch & cursor"
    >
      {/* Radiant inner specular shine */}
      <div className="absolute inset-x-2 top-1.5 h-[32%] bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-full pointer-events-none" />

      {/* Eyes container with smooth springy tracking */}
      <div
        className={`flex items-center justify-center ${eyeGap} transition-transform duration-75 ease-out`}
        style={{
          transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
        }}
      >
        {/* Left Eye */}
        <div
          className={`bg-white rounded-full shadow-sm transition-all duration-75 ${eyeSizeClasses}`}
          style={{
            transform: isBlinking || isWinking ? 'scaleY(0.12)' : mood === 'excited' ? 'scaleY(1.15)' : 'scaleY(1)',
          }}
        />
        {/* Right Eye */}
        <div
          className={`bg-white rounded-full shadow-sm transition-all duration-75 ${eyeSizeClasses}`}
          style={{
            transform: isBlinking ? 'scaleY(0.12)' : mood === 'excited' ? 'scaleY(1.15)' : 'scaleY(1)',
          }}
        />
      </div>

      {/* Cute subtle blush spots when looking happy or excited */}
      {(mood === 'excited' || mood === 'happy') && (
        <>
          <div className="absolute bottom-3 left-4 w-3 h-1.5 bg-orange-700/25 rounded-full blur-[1px]" />
          <div className="absolute bottom-3 right-4 w-3 h-1.5 bg-orange-700/25 rounded-full blur-[1px]" />
        </>
      )}
    </div>
  );
};
