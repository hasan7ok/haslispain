import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 3500);
    return () => clearTimeout(timer);
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
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(transparent 95%, rgba(255,0,255,0.08) 95%), linear-gradient(90deg, transparent 95%, rgba(255,0,255,0.08) 95%)',
            backgroundSize: '40px 40px',
          }} />

          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
            style={{ background: 'linear-gradient(to bottom, #FF9900, #FF00FF)' }} />

          <div className="relative z-10 text-center px-8 w-full max-w-md">

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
              className="font-body text-sm"
              style={{ color: 'rgba(224,224,224,0.7)' }}
            >
              طريقك لإتقان الإسبانية يبدأ هنا
            </motion.p>
          </div>

          <style>{`
            @keyframes intro-pulse-glow {
              0%, 100% { filter: drop-shadow(0 0 10px rgba(255,0,255,0.4)); }
              50% { filter: drop-shadow(0 0 30px rgba(255,0,255,0.8)) drop-shadow(0 0 60px rgba(0,255,255,0.4)); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
