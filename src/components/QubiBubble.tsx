import React from 'react';
import { QubiAvatar } from './QubiAvatar';

interface QubiBubbleProps {
  message: string;
  className?: string;
  onAvatarClick?: () => void;
}

export const QubiBubble: React.FC<QubiBubbleProps> = ({
  message,
  className = '',
  onAvatarClick,
}) => {
  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      <div onClick={onAvatarClick} className="cursor-pointer shrink-0">
        <QubiAvatar size="md" mood="excited" />
      </div>
      <div className="relative bg-gradient-to-r from-white via-white/95 to-amber-50/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-amber-200/60 shadow-[0_4px_16px_rgba(245,135,32,0.06)] text-stone-800 text-[15px] leading-snug font-normal flex-1">
        {/* Subtle orange accent pip */}
        <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-white border-l border-b border-amber-200/60" />
        {message}
      </div>
    </div>
  );
};
