import { CharacterConfig } from '@/hooks/useGameState';
import pixelCharImg from '@/assets/pixel-character.png';

interface PixelCharacterProps {
  character?: CharacterConfig;
  size?: number;
  animate?: boolean;
  className?: string;
}

export default function PixelCharacter({ size = 6, animate = false, className = '' }: PixelCharacterProps) {
  const pixelSize = size * 11; // scale factor

  return (
    <div
      className={`inline-block ${animate ? 'animate-pixel-float' : ''} ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <img
        src={pixelCharImg}
        alt="Pixel Character"
        width={pixelSize}
        height={pixelSize}
        style={{ imageRendering: 'pixelated' }}
        className="drop-shadow-[0_0_12px_hsl(var(--primary)/0.5)]"
      />
    </div>
  );
}
