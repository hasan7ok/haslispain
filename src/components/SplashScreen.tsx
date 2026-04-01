import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 5000;
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setVisible(false);
        setTimeout(onComplete, 600);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 flex items-center justify-center"
          style={{
            zIndex: 9999,
            background: 'linear-gradient(180deg, #090014 0%, #1a0030 50%, #090014 100%)',
          }}
        >
          {/* Background grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(transparent 95%, rgba(255,0,255,0.08) 95%), linear-gradient(90deg, transparent 95%, rgba(255,0,255,0.08) 95%)',
            backgroundSize: '40px 40px',
          }} />

          {/* Floating sun orb */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
            style={{ background: 'linear-gradient(to bottom, #FF9900, #FF00FF)' }} />

          <div className="relative z-10 text-center px-8 w-full max-w-md">
            {/* Logo with pulse glow */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            >
              <img
                src={logo}
                alt="PixÑol"
                className="h-16 md:h-20 w-auto mx-auto mb-2"
                style={{
                  imageRendering: 'pixelated',
                  animation: 'intro-pulse-glow 2s ease-in-out infinite',
                }}
              />
            </motion.div>

            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="font-pixel text-3xl md:text-5xl mb-2"
              style={{
                background: 'linear-gradient(to right, #FF9900, #FF00FF, #00FFFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(255,0,255,0.6))',
              }}
            >
              PIXÑOL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="font-pixel text-[0.55rem] md:text-xs mb-1"
              style={{ color: '#00FFFF', filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.6))' }}
            >
              Aprende Español con RPG
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="font-body text-sm mb-8"
              style={{ color: 'rgba(224,224,224,0.7)' }}
            >
              طريقك لإتقان الإسبانية يبدأ هنا
            </motion.p>

            {/* Neon loading bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="relative mx-auto"
              style={{ maxWidth: '320px' }}
            >
              {/* Track */}
              <div className="h-[4px] w-full rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                {/* Fill */}
                <div
                  className="h-full relative"
                  style={{
                    width: `${progress * 100}%`,
                    background: 'linear-gradient(90deg, #FFD700, #FF6B00, #FF0055)',
                    boxShadow: '0 0 12px #FF6B00, 0 0 24px rgba(255,107,0,0.5)',
                    transition: 'none',
                  }}
                >
                  {/* Leading pulse dot */}
                  <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full"
                    style={{
                      background: '#FFFFFF',
                      boxShadow: '0 0 8px #FFD700, 0 0 16px #FF6B00, 0 0 24px rgba(255,107,0,0.6)',
                      animation: 'intro-dot-pulse 1s ease-in-out infinite',
                    }}
                  />
                </div>
              </div>

              {/* Percentage text */}
              <p className="font-mono text-[0.6rem] mt-3 tracking-widest"
                style={{ color: 'rgba(255,107,0,0.7)' }}>
                {Math.round(progress * 100)}%
              </p>
            </motion.div>
          </div>

          <style>{`
            @keyframes intro-pulse-glow {
              0%, 100% { filter: drop-shadow(0 0 10px rgba(255,0,255,0.4)); }
              50% { filter: drop-shadow(0 0 30px rgba(255,0,255,0.8)) drop-shadow(0 0 60px rgba(0,255,255,0.4)); }
            }
            @keyframes intro-dot-pulse {
              0%, 100% { transform: translate(50%, -50%) scale(1); opacity: 1; }
              50% { transform: translate(50%, -50%) scale(1.8); opacity: 0.6; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
