import { useMemo } from 'react';

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

    const skinLight = lighten(skinColor, 25);
    const skinDark = darken(skinColor, 30);
    const hairLight = lighten(hairColor, 20);
    const hairDark = darken(hairColor, 25);
    const outfitLight = lighten(outfitColor, 20);
    const outfitDark = darken(outfitColor, 30);

    const pixelSize = size / 16;
    const pixels: { x: number; y: number; color: string }[] = [];

    // Background with subtle gradient effect
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const gradientShift = Math.floor(y * 1.5);
        pixels.push({ x, y, color: darken(bgColor, gradientShift) });
      }
    }

    // Hair with shading
    const hairPixels: [number, number, string][] = [];
    if (hairStyle === 'messy') {
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 2, hairLight]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 3, hairColor]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 4, hairDark]);
      hairPixels.push([3, 5, hairDark], [4, 5, hairDark], [11, 5, hairDark], [12, 5, hairDark]);
      // Highlight strands
      hairPixels.push([5, 2, hairLight], [8, 2, hairLight], [10, 3, hairLight]);
    } else if (hairStyle === 'spiky') {
      hairPixels.push([5, 1, hairLight], [7, 1, hairLight], [9, 1, hairLight], [11, 1, hairLight]);
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 2, hairColor]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 3, x <= 7 ? hairLight : hairColor]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 4, hairDark]);
    } else if (hairStyle === 'long') {
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 2, hairLight]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 3, hairColor]);
      for (let x = 3; x <= 12; x++) hairPixels.push([x, 4, hairDark]);
      for (let y = 5; y <= 9; y++) {
        hairPixels.push([3, y, y < 7 ? hairColor : hairDark], [12, y, y < 7 ? hairColor : hairDark]);
      }
    } else if (hairStyle === 'short') {
      for (let x = 5; x <= 10; x++) hairPixels.push([x, 3, hairLight]);
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 4, hairColor]);
    } else if (hairStyle === 'mohawk') {
      for (let x = 6; x <= 9; x++) { hairPixels.push([x, 1, hairLight], [x, 2, hairColor]); }
      for (let x = 5; x <= 10; x++) hairPixels.push([x, 3, hairColor]);
      for (let x = 4; x <= 11; x++) hairPixels.push([x, 4, hairDark]);
    }

    hairPixels.forEach(([x, y, c]) => {
      pixels.push({ x, y, color: c });
    });

    // Face with 3D shading
    for (let y = 5; y <= 9; y++) {
      for (let x = 4; x <= 11; x++) {
        let c = skinColor;
        // Left edge darker (shadow)
        if (x === 4) c = skinDark;
        // Right edge lighter (highlight)
        else if (x === 11) c = skinLight;
        // Top lighter
        else if (y === 5) c = skinLight;
        // Bottom darker
        else if (y === 9) c = skinDark;
        pixels.push({ x, y, color: c });
      }
    }
    // Chin with rounding
    [6, 7, 8, 9].forEach(x => pixels.push({ x, y: 10, color: x === 6 || x === 9 ? skinDark : skinColor }));

    // Eyes with depth
    const eyeColor = '#1a1a2e';
    const eyeWhite = '#e8e8f0';
    if (eyeStyle === 'glasses') {
      // Frame
      [5, 6, 9, 10].forEach(x => pixels.push({ x, y: 6, color: '#555' }));
      pixels.push({ x: 7, y: 6, color: '#666' }, { x: 8, y: 6, color: '#666' });
      // Lenses
      pixels.push({ x: 5, y: 7, color: '#334' }, { x: 6, y: 7, color: eyeColor });
      pixels.push({ x: 9, y: 7, color: '#334' }, { x: 10, y: 7, color: eyeColor });
      // Glint
      pixels.push({ x: 5, y: 6, color: '#888' });
    } else if (eyeStyle === 'narrow') {
      pixels.push({ x: 6, y: 7, color: eyeColor }, { x: 10, y: 7, color: eyeColor });
    } else if (eyeStyle === 'wide') {
      pixels.push({ x: 5, y: 6, color: eyeWhite }, { x: 6, y: 6, color: eyeWhite });
      pixels.push({ x: 5, y: 7, color: eyeWhite }, { x: 6, y: 7, color: eyeColor });
      pixels.push({ x: 9, y: 6, color: eyeWhite }, { x: 10, y: 6, color: eyeWhite });
      pixels.push({ x: 9, y: 7, color: eyeWhite }, { x: 10, y: 7, color: eyeColor });
      // Highlight dot
      pixels.push({ x: 5, y: 6, color: '#fff' }, { x: 9, y: 6, color: '#fff' });
    } else {
      // Normal with white + pupil + glint
      pixels.push({ x: 5, y: 6, color: eyeWhite }, { x: 6, y: 6, color: eyeColor });
      pixels.push({ x: 9, y: 6, color: eyeWhite }, { x: 10, y: 6, color: eyeColor });
      // Tiny highlight
      pixels.push({ x: 5, y: 6, color: '#fff' }, { x: 9, y: 6, color: '#fff' });
    }

    // Eyebrows
    pixels.push({ x: 5, y: 5, color: darken(hairColor, 10) }, { x: 6, y: 5, color: darken(hairColor, 10) });
    pixels.push({ x: 9, y: 5, color: darken(hairColor, 10) }, { x: 10, y: 5, color: darken(hairColor, 10) });

    // Nose with highlight
    pixels.push({ x: 7, y: 8, color: skinDark }, { x: 8, y: 8, color: darken(skinColor, 15) });

    // Mouth
    pixels.push({ x: 7, y: 9, color: '#c0392b' }, { x: 8, y: 9, color: '#a93226' });

    // Neck with shadow
    pixels.push({ x: 7, y: 11, color: skinDark }, { x: 8, y: 11, color: skinColor });

    // Body/outfit with 3D shading
    for (let y = 12; y <= 15; y++) {
      for (let x = 4; x <= 11; x++) {
        let c = outfitColor;
        if (x === 4 || x === 5) c = outfitDark;
        else if (x === 10 || x === 11) c = outfitLight;
        else if (y === 12) c = outfitLight;
        else if (y === 15) c = outfitDark;
        pixels.push({ x, y, color: c });
      }
    }
    // Collar / neckline
    pixels.push({ x: 7, y: 12, color: darken(outfitColor, 40) }, { x: 8, y: 12, color: darken(outfitColor, 35) });
    // Shoulder highlight
    pixels.push({ x: 4, y: 12, color: outfitColor }, { x: 11, y: 12, color: outfitLight });

    // Accessories
    if (accessory === 'earring') {
      pixels.push({ x: 4, y: 7, color: '#ffd700' }, { x: 4, y: 8, color: '#ffed4a' });
    } else if (accessory === 'scar') {
      pixels.push({ x: 9, y: 8, color: darken(skinColor, 40) }, { x: 10, y: 9, color: darken(skinColor, 40) });
    } else if (accessory === 'bandana') {
      for (let x = 4; x <= 11; x++) {
        pixels.push({ x, y: 5, color: x % 2 === 0 ? '#e74c3c' : '#c0392b' });
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

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
  const b = Math.min(255, (num & 0x0000FF) + amount);
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
