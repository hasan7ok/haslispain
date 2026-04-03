import { useState, useEffect } from 'react';

export type ThemeName = 'cyber-sunset' | 'arctic-neon' | 'forest-matrix' | 'royal-amethyst' | 'sakura-bloom' | 'desert-gold';

export const THEMES: { id: ThemeName; label: string; labelAr: string; accent: string; bg: string; glow: string }[] = [
  { id: 'cyber-sunset', label: 'Cyber Sunset', labelAr: 'غروب سايبر', accent: '#ff6b00', bg: '#1a0a2e', glow: '#ff6b0088' },
  { id: 'arctic-neon', label: 'Arctic Neon', labelAr: 'نيون قطبي', accent: '#00f5ff', bg: '#020d1f', glow: '#00f5ff88' },
  { id: 'forest-matrix', label: 'Forest Matrix', labelAr: 'غابة ماتريكس', accent: '#00c853', bg: '#050f05', glow: '#00c85388' },
  { id: 'royal-amethyst', label: 'Royal Amethyst', labelAr: 'جمشت ملكي', accent: '#b388ff', bg: '#120826', glow: '#b388ff88' },
  { id: 'sakura-bloom', label: 'Sakura Bloom', labelAr: 'زهر الساكورا', accent: '#ff6b9d', bg: '#1a0a14', glow: '#ff6b9d88' },
  { id: 'desert-gold', label: 'Desert Gold', labelAr: 'ذهب الصحراء', accent: '#ffd700', bg: '#1a1400', glow: '#ffd70088' },
];

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

function buildThemeVars(accent: string, bg: string, secondary: string, accentAlt: string): Record<string, string> {
  return {
    '--background': hexToHsl(bg),
    '--primary': hexToHsl(accent),
    '--secondary': hexToHsl(secondary),
    '--accent': hexToHsl(accentAlt),
    '--neon-magenta': hexToHsl(secondary),
    '--neon-cyan': hexToHsl(accent),
    '--neon-orange': hexToHsl(accentAlt),
    '--card': hexToHslDarker(bg, 1.2),
    '--muted': hexToHslDarker(bg, 1.1),
    '--border': hexToHslDarker(accent, 0.3),
    '--ring': hexToHsl(accent),
  };
}

const THEME_CSS_MAP: Record<ThemeName, Record<string, string>> = {
  'cyber-sunset': buildThemeVars('#ff6b00', '#1a0a2e', '#ff3d7f', '#ffaa00'),
  'arctic-neon': buildThemeVars('#00f5ff', '#020d1f', '#7b61ff', '#00f5ff'),
  'forest-matrix': buildThemeVars('#00c853', '#050f05', '#76ff03', '#00e676'),
  'royal-amethyst': buildThemeVars('#b388ff', '#120826', '#ea80fc', '#7c4dff'),
  'sakura-bloom': buildThemeVars('#ff6b9d', '#1a0a14', '#ff4081', '#ffab91'),
  'desert-gold': buildThemeVars('#ffd700', '#1a1400', '#ff8f00', '#ffe082'),
};

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('pixnol-theme');
    if (saved && THEMES.some(t => t.id === saved)) return saved as ThemeName;
    return 'cyber-sunset';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');

    const vars = THEME_CSS_MAP[theme];
    if (vars) {
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }

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
