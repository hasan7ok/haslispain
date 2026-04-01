import { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme, THEMES, ThemeName } from '@/hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 text-muted-foreground hover:text-foreground transition-all border border-transparent hover:border-primary/30 hover:shadow-[0_0_8px_hsl(var(--primary)/0.2)]"
        title="تغيير المظهر"
      >
        <Palette size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-48 border border-border bg-card/95 backdrop-blur-md p-2 z-50"
            style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.2)' }}
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all ${
                  theme === t.id
                    ? 'bg-primary/10 border border-primary/40'
                    : 'border border-transparent hover:bg-primary/5 hover:border-primary/20'
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full border border-foreground/20 shrink-0"
                  style={{
                    background: t.accent,
                    boxShadow: theme === t.id ? `0 0 8px ${t.glow}` : 'none',
                  }}
                />
                <div>
                  <p className="font-pixel text-[0.45rem] text-foreground">{t.label}</p>
                  <p className="font-body text-[0.6rem] text-muted-foreground">{t.labelAr}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
