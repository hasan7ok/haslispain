import { CharacterConfig } from '@/hooks/useGameState';
import portraitImg from '@/assets/avatar-pixel-premium.jpg';

interface PixelCharacterProps {
  character?: CharacterConfig;
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function PixelCharacter({ size = 6, animate = false, className = '' }: PixelCharacterProps) {
  const portraitSize = size * 11;

  return (
    <div
      className={`inline-block ${animate ? 'animate-pixel-float' : ''} ${className}`}
    >
      <img
        src={portraitImg}
        alt="صورة المتعلم"
        width={portraitSize}
        height={portraitSize}
        loading="lazy"
        className="aspect-square rounded-full object-cover border border-primary/50 shadow-[0_0_18px_hsl(var(--primary)/0.18)]"
         style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
