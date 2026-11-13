import avatarOne from '@/assets/avatar-spain-1.jpg.asset.json';
import avatarTwo from '@/assets/avatar-spain-2.jpg.asset.json';
const avatarMan = avatarOne.url;
const avatarWoman = avatarTwo.url;

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
    <div className={`relative inline-block shrink-0 self-start ${className}`} style={{ width: size, height: size }}>
      {size >= 56 && (
        <div aria-hidden className="absolute -inset-1.5 rounded-full opacity-80 animate-[spin_8s_linear_infinite] will-change-transform"
          style={{ background: 'conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--accent)), transparent 40%, hsl(var(--secondary)), hsl(var(--primary)))' }} />
      )}
      {frameStyle && (
        <div className={`absolute -inset-1 ${frameClasses} rounded-full`} />
      )}
      <div className="relative z-10 rounded-full overflow-hidden bg-background ring-2 ring-background" style={{ width: size, height: size }}>
        <img
          src={portrait}
          alt="صورة الحساب"
          width={size}
          height={size}
          loading="lazy"
          className="object-cover scale-[1.12]"
          style={{ width: size, height: size, imageRendering: 'pixelated' }}
        />
      </div>
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
