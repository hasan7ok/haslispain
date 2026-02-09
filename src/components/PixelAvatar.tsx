import { useMemo } from 'react';

interface PixelAvatarProps {
  seed: string;
  size?: number;
  className?: string;
  frameStyle?: string;
}

// Generate deterministic pixel art avatar from seed
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const SKIN_TONES = ['#f4c794', '#e0ac69', '#c68642', '#8d5524', '#f9d5a7', '#dbb89a'];
const HAIR_COLORS = ['#1a1a2e', '#3d2314', '#c9a96e', '#e74c3c', '#2980b9', '#8e44ad', '#1abc9c', '#f39c12'];
const OUTFIT_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'];
const BG_COLORS = ['#6b5b7b', '#4a5568', '#2d3748', '#553c9a', '#285e61', '#702459', '#1a365d', '#742a2a'];
const EYE_STYLES = ['normal', 'glasses', 'narrow', 'wide'];
const HAIR_STYLES = ['messy', 'spiky', 'long', 'short', 'mohawk'];
const ACCESSORY_TYPES = ['none', 'earring', 'scar', 'mask', 'bandana'];

export default function PixelAvatar({ seed, size = 128, className = '', frameStyle }: PixelAvatarProps) {
  const avatarData = useMemo(() => {
    const hash = hashCode(seed);
    const rand = seededRandom(hash);

    const skinColor = SKIN_TONES[Math.floor(rand() * SKIN_TONES.length)];
    const hairColor = HAIR_COLORS[Math.floor(rand() * HAIR_COLORS.length)];
    const outfitColor = OUTFIT_COLORS[Math.floor(rand() * OUTFIT_COLORS.length)];
    const bgColor = BG_COLORS[Math.floor(rand() * BG_COLORS.length)];
    const eyeStyle = EYE_STYLES[Math.floor(rand() * EYE_STYLES.length)];
    const hairStyle = HAIR_STYLES[Math.floor(rand() * HAIR_STYLES.length)];
    const accessory = ACCESSORY_TYPES[Math.floor(rand() * ACCESSORY_TYPES.length)];

    // Generate 16x16 pixel grid
    const pixelSize = size / 16;
    const pixels: { x: number; y: number; color: string }[] = [];

    // Background
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        pixels.push({ x, y, color: bgColor });
      }
    }

    // Hair based on style
    const hairPixels: [number, number][] = [];
    if (hairStyle === 'messy') {
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 2]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 3]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 4]);
      hairPixels.push([3, 5], [4, 5], [11, 5], [12, 5]);
    } else if (hairStyle === 'spiky') {
      hairPixels.push([5, 1], [7, 1], [9, 1], [11, 1]);
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 2]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 3]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 4]);
    } else if (hairStyle === 'long') {
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 2]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 3]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 4]);
      hairPixels.push([3, 5], [3, 6], [3, 7], [3, 8], [12, 5], [12, 6], [12, 7], [12, 8]);
    } else if (hairStyle === 'short') {
      for (let x = 5; x <= 10; x++) hairPixels.push([x, 3]);
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 4]);
    } else if (hairStyle === 'mohawk') {
      for (let x = 6; x <= 9; x++) { hairPixels.push([x, 1], [x, 2]); }
      for (let x = 5; x <= 10; x++) hairPixels.push([x, 3]);
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 4]);
    }

    hairPixels.forEach(([x, y]) => {
      pixels.push({ x, y, color: hairColor });
    });

    // Face (skin)
    const facePixels: [number, number][] = [];
    for (let y = 5; y <= 9; y++) {
      for (let x = 4; x <= 11; x++) {
        facePixels.push([x, y]);
      }
    }
    facePixels.push([5, 10], [6, 10], [7, 10], [8, 10], [9, 10], [10, 10]);
    facePixels.forEach(([x, y]) => {
      pixels.push({ x, y, color: skinColor });
    });

    // Eyes
    const eyeColor = '#1a1a2e';
    if (eyeStyle === 'glasses') {
      pixels.push({ x: 5, y: 6, color: eyeColor }, { x: 6, y: 6, color: eyeColor });
      pixels.push({ x: 9, y: 6, color: eyeColor }, { x: 10, y: 6, color: eyeColor });
      pixels.push({ x: 7, y: 6, color: '#555' }, { x: 8, y: 6, color: '#555' });
      pixels.push({ x: 5, y: 7, color: '#555' }, { x: 6, y: 7, color: '#333' });
      pixels.push({ x: 9, y: 7, color: '#555' }, { x: 10, y: 7, color: '#333' });
    } else if (eyeStyle === 'narrow') {
      pixels.push({ x: 6, y: 7, color: eyeColor }, { x: 10, y: 7, color: eyeColor });
    } else if (eyeStyle === 'wide') {
      pixels.push({ x: 5, y: 6, color: '#fff' }, { x: 6, y: 6, color: eyeColor });
      pixels.push({ x: 9, y: 6, color: '#fff' }, { x: 10, y: 6, color: eyeColor });
      pixels.push({ x: 5, y: 7, color: '#fff' }, { x: 6, y: 7, color: eyeColor });
      pixels.push({ x: 9, y: 7, color: '#fff' }, { x: 10, y: 7, color: eyeColor });
    } else {
      pixels.push({ x: 6, y: 6, color: eyeColor }, { x: 10, y: 6, color: eyeColor });
    }

    // Nose
    pixels.push({ x: 8, y: 8, color: darken(skinColor, 20) });

    // Mouth
    pixels.push({ x: 7, y: 9, color: '#c0392b' }, { x: 8, y: 9, color: '#c0392b' });

    // Neck
    pixels.push({ x: 7, y: 11, color: skinColor }, { x: 8, y: 11, color: skinColor });

    // Body/outfit
    for (let y = 12; y <= 15; y++) {
      for (let x = 4; x <= 11; x++) {
        pixels.push({ x, y, color: outfitColor });
      }
    }
    // Collar detail
    pixels.push({ x: 7, y: 12, color: darken(outfitColor, 30) }, { x: 8, y: 12, color: darken(outfitColor, 30) });

    // Accessories
    if (accessory === 'earring') {
      pixels.push({ x: 4, y: 7, color: '#ffd700' });
    } else if (accessory === 'scar') {
      pixels.push({ x: 9, y: 8, color: darken(skinColor, 40) });
      pixels.push({ x: 10, y: 9, color: darken(skinColor, 40) });
    } else if (accessory === 'bandana') {
      for (let x = 4; x <= 11; x++) {
        pixels.push({ x, y: 5, color: '#e74c3c' });
      }
    }

    return { pixels, pixelSize, bgColor };
  }, [seed, size]);

  const frameClasses = getFrameClasses(frameStyle);

  return (
    <div className={`relative inline-block ${className}`} style={{ imageRendering: 'pixelated' }}>
      {frameStyle && (
        <div className={`absolute -inset-1 ${frameClasses} rounded-sm`} />
      )}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="relative z-10"
        style={{ imageRendering: 'pixelated' }}
      >
        {avatarData.pixels.map((p, i) => (
          <rect
            key={i}
            x={p.x * avatarData.pixelSize}
            y={p.y * avatarData.pixelSize}
            width={avatarData.pixelSize}
            height={avatarData.pixelSize}
            fill={p.color}
          />
        ))}
      </svg>
    </div>
  );
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
  const b = Math.max(0, (num & 0x0000FF) - amount);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}

function getFrameClasses(frameStyle?: string): string {
  switch (frameStyle) {
    case 'cyber-green': return 'border-2 border-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]';
    case 'pixel-gold': return 'border-2 border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.5)]';
    case 'neon-purple': return 'border-2 border-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.5)]';
    case 'cyber-blue': return 'border-2 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]';
    case 'rainbow-glow': return 'border-2 border-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.5),0_0_24px_rgba(168,85,247,0.3)]';
    case 'fire-frame': return 'border-2 border-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)]';
    case 'book-frame': return 'border-2 border-amber-600 shadow-[0_0_12px_rgba(217,119,6,0.4)]';
    case 'star-frame': return 'border-2 border-yellow-300 shadow-[0_0_12px_rgba(253,224,71,0.5)]';
    default: return 'border-2 border-border';
  }
}
