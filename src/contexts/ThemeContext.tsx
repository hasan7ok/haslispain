import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeName = 'default' | 'cyber-sunset' | 'arctic-neon' | 'forest-matrix';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'default', setTheme: () => {} });

const THEME_CLASSES: Record<ThemeName, string> = {
  'default': '',
  'cyber-sunset': 'theme-cyber-sunset',
  'arctic-neon': 'theme-arctic-neon',
  'forest-matrix': 'theme-forest-matrix',
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    return (localStorage.getItem('pixnol-theme') as ThemeName) || 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    // Remove all theme classes
    Object.values(THEME_CLASSES).forEach(cls => {
      if (cls) root.classList.remove(cls);
    });
    // Add current
    const cls = THEME_CLASSES[theme];
    if (cls) root.classList.add(cls);
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
