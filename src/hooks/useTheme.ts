import { useState, useEffect } from 'react';

export type ThemeName = 'cyber-sunset' | 'arctic-neon' | 'forest-matrix';

export const THEMES: { id: ThemeName; label: string; labelAr: string; accent: string; bg: string; glow: string }[] = [
  { id: 'cyber-sunset', label: 'Cyber Sunset', labelAr: 'غروب سايبر', accent: '#ff6b00', bg: '#1a0a2e', glow: '#ff6b0088' },
  { id: 'arctic-neon', label: 'Arctic Neon', labelAr: 'نيون قطبي', accent: '#00f5ff', bg: '#020d1f', glow: '#00f5ff88' },
  { id: 'forest-matrix', label: 'Forest Matrix', labelAr: 'غابة ماتريكس', accent: '#00c853', bg: '#050f05', glow: '#00c85388' },
];

// Convert hex to HSL string for CSS variables
function hexToHsl(hex: string): string {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexToHslDarker(hex: string, factor = 0.4): string {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * factor * 100)}%`;
}

const THEME_CSS_MAP: Record<ThemeName, Record<string, string>> = {
  'cyber-sunset': {
    '--background': hexToHsl('#1a0a2e'),
    '--primary': hexToHsl('#ff6b00'),
    '--secondary': hexToHsl('#ff3d7f'),
    '--accent': hexToHsl('#ffaa00'),
    '--neon-magenta': hexToHsl('#ff3d7f'),
    '--neon-cyan': hexToHsl('#ff6b00'),
    '--neon-orange': hexToHsl('#ffaa00'),
    '--card': hexToHslDarker('#1a0a2e', 1.2),
    '--muted': hexToHslDarker('#1a0a2e', 1.1),
    '--border': hexToHslDarker('#ff6b00', 0.3),
    '--ring': hexToHsl('#ff6b00'),
  },
  'arctic-neon': {
    '--background': hexToHsl('#020d1f'),
    '--primary': hexToHsl('#00f5ff'),
    '--secondary': hexToHsl('#7b61ff'),
    '--accent': hexToHsl('#00f5ff'),
    '--neon-magenta': hexToHsl('#7b61ff'),
    '--neon-cyan': hexToHsl('#00f5ff'),
    '--neon-orange': hexToHsl('#00f5ff'),
    '--card': hexToHslDarker('#020d1f', 1.3),
    '--muted': hexToHslDarker('#020d1f', 1.2),
    '--border': hexToHslDarker('#00f5ff', 0.25),
    '--ring': hexToHsl('#00f5ff'),
  },
  'forest-matrix': {
    '--background': hexToHsl('#050f05'),
    '--primary': hexToHsl('#00c853'),
    '--secondary': hexToHsl('#76ff03'),
    '--accent': hexToHsl('#00e676'),
    '--neon-magenta': hexToHsl('#00c853'),
    '--neon-cyan': hexToHsl('#76ff03'),
    '--neon-orange': hexToHsl('#00e676'),
    '--card': hexToHslDarker('#050f05', 1.3),
    '--muted': hexToHslDarker('#050f05', 1.2),
    '--border': hexToHslDarker('#00c853', 0.25),
    '--ring': hexToHsl('#00c853'),
  },
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('pixnol-theme');
    if (saved && THEMES.some(t => t.id === saved)) return saved as ThemeName;
    return 'cyber-sunset';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove light class
    root.classList.remove('light');

    const vars = THEME_CSS_MAP[theme];
    if (vars) {
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

    // Smooth transition
    root.style.transition = 'all 0.4s ease';
    setTimeout(() => { root.style.transition = ''; }, 500);

    localStorage.setItem('pixnol-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const idx = THEMES.findIndex(t => t.id === theme);
    setTheme(THEMES[(idx + 1) % THEMES.length].id);
  };

  return { theme, setTheme, toggleTheme };
}
