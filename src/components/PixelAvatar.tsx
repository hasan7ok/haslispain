import avatarMan from '@/assets/avatar-pixel-premium.jpg';
import avatarWoman from '@/assets/avatar-pixel-woman.jpg';

interface PixelAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  frameStyle?: string;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const PORTRAITS = [avatarMan, avatarWoman];

export default function PixelAvatar({ seed, size = 128, className = '', frameStyle }: PixelAvatarProps) {
  const portrait = seed === 'portrait-man' ? avatarMan : seed === 'portrait-woman' ? avatarWoman : PORTRAITS[hashCode(seed) % PORTRAITS.length];
  const frameClasses = getFrameClasses(frameStyle);

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {frameStyle && (
        <div className={`absolute -inset-1 ${frameClasses} rounded-full`} />
      )}
      <img
        src={portrait}
        alt="صورة حساب بكسل آرت شبه واقعية"
        width={size}
        height={size}
        loading="lazy"
        className="relative z-10 rounded-full object-cover"
        style={{ width: size, height: size, imageRendering: 'pixelated' }}
      />
    </div>
  );
}

function getFrameClasses(frameStyle?: string): string {
  switch (frameStyle) {
    case 'cyber-green': return 'border border-primary/70 shadow-[0_0_18px_hsl(var(--primary)/0.25)]';
    case 'pixel-gold': return 'border border-accent/70 shadow-[0_0_18px_hsl(var(--accent)/0.25)]';
    case 'neon-purple': return 'border border-secondary/70 shadow-[0_0_18px_hsl(var(--secondary)/0.25)]';
    case 'cyber-blue': return 'border border-primary/70 shadow-[0_0_18px_hsl(var(--primary)/0.25)]';
    case 'rainbow-glow': return 'border border-primary shadow-[0_0_24px_hsl(var(--primary)/0.3)]';
    case 'fire-frame': return 'border border-destructive/70';
    case 'book-frame': return 'border border-accent/70';
    case 'star-frame': return 'border border-primary/70';
    default: return 'border-2 border-border';
  }
}
