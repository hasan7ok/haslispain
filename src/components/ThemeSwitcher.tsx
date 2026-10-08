import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Palette, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { THEMES, useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const activeTheme = THEMES.find((item) => item.id === theme) ?? THEMES[0];

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target) && !dialogRef.current?.contains(target)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <Button onClick={() => setOpen((value) => !value)} variant="outline" size="sm" className="rounded-sm border-primary/30 bg-card/70 px-2.5 sm:px-3" aria-expanded={open} aria-haspopup="dialog">
        <Palette /> <span className="hidden sm:inline">{activeTheme.labelAr}</span>
      </Button>

      {createPortal(
        <AnimatePresence>
          {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm sm:hidden" onClick={() => setOpen(false)} />
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-label="اختيار مظهر الموقع"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[82vh] overflow-y-auto border-t border-border bg-card p-4 shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-[440px] sm:max-h-none sm:border sm:p-5"
              dir="rtl"
            >
              <div className="mb-4 flex items-start justify-between">
                <div><p className="font-heading text-lg font-semibold">اختر أجواء رحلتك</p><p className="mt-1 text-xs text-muted-foreground">يتغير اللون والمشهد، ويبقى المحتوى كما هو.</p></div>
                <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} className="-ml-2 -mt-2 sm:hidden" aria-label="إغلاق"><X /></Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((item) => {
                  const selected = theme === item.id;
                  return (
                    <Button key={item.id} type="button" variant="ghost" onClick={() => { setTheme(item.id); setOpen(false); }} className={`group relative h-28 justify-end overflow-hidden rounded-sm border p-0 text-right ${selected ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                      <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                      <span className="relative z-10 mt-auto flex w-full items-end justify-between gap-2 p-3">
                        <span><span className="block text-sm font-semibold text-foreground">{item.labelAr}</span><span className="block text-[10px] text-foreground/65">{item.label}</span></span>
                        {selected && <span className="grid size-6 place-items-center bg-primary text-primary-foreground"><Check className="size-3.5" /></span>}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </motion.div>
          </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}