import { useThemeContext, type ThemeName } from '@/contexts/ThemeContext';
import arcticImage from '@/assets/culture-sagrada-interior.jpg';
import sunsetImage from '@/assets/culture-flamenco.jpg';
import forestImage from '@/assets/culture-camino.jpg';
import amethystImage from '@/assets/culture-cine.jpg';
import sakuraImage from '@/assets/culture-boda.jpg';
import desertImage from '@/assets/culture-alhambra.jpg';

export type { ThemeName } from '@/contexts/ThemeContext';

export const THEMES: { id: ThemeName; label: string; labelAr: string; image: string }[] = [
  { id: 'arctic-neon', label: 'Arctic Neon', labelAr: 'نيون قطبي', image: arcticImage },
  { id: 'cyber-sunset', label: 'Cyber Sunset', labelAr: 'غروب سايبر', image: sunsetImage },
  { id: 'forest-matrix', label: 'Forest Matrix', labelAr: 'غابة ماتريكس', image: forestImage },
  { id: 'royal-amethyst', label: 'Royal Amethyst', labelAr: 'جمشت ملكي', image: amethystImage },
  { id: 'sakura-bloom', label: 'Sakura Bloom', labelAr: 'زهر الساكورا', image: sakuraImage },
  { id: 'desert-gold', label: 'Desert Gold', labelAr: 'ذهب الصحراء', image: desertImage },
];

export function useTheme() {
  const { theme, setTheme } = useThemeContext();

  const toggleTheme = () => {
    const idx = THEMES.findIndex(t => t.id === theme);
    setTheme(THEMES[(idx + 1) % THEMES.length].id);
  };

  return { theme, setTheme, toggleTheme };
}
