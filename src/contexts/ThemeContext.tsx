import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeName = 'cyber-sunset' | 'arctic-neon' | 'forest-matrix' | 'royal-amethyst' | 'sakura-bloom' | 'desert-gold';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'arctic-neon', setTheme: () => {} });

const THEME_CLASSES: Record<ThemeName, string> = {
  'cyber-sunset': 'theme-cyber-sunset',
  'arctic-neon': 'theme-arctic-neon',
  'forest-matrix': 'theme-forest-matrix',
  'royal-amethyst': 'theme-royal-amethyst',
  'sakura-bloom': 'theme-sakura-bloom',
  'desert-gold': 'theme-desert-gold',
};

const isThemeName = (value: string | null): value is ThemeName =>
  value !== null && Object.prototype.hasOwnProperty.call(THEME_CLASSES, value);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem('pixnol-theme');
    return isThemeName(savedTheme) ? savedTheme : 'arctic-neon';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    Object.values(THEME_CLASSES).forEach((className) => root.classList.remove(className));
    root.classList.add(THEME_CLASSES[theme]);
    localStorage.setItem('pixnol-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}
