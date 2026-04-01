import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DonationButton() {
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Fixed button */}
      <motion.button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center"
        style={{
          border: '2px solid hsl(var(--primary))',
          background: 'hsl(var(--background) / 0.9)',
          boxShadow: hovered
            ? '0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.3)'
            : '0 0 12px hsl(var(--primary) / 0.3), 0 0 24px hsl(var(--primary) / 0.15)',
          transition: 'box-shadow 0.3s ease',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 100 100" width="60" height="60" className="absolute inset-0">
          {/* Rotating text ring */}
          <defs>
            <path id="textRing" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
          </defs>
          <g style={{ animation: 'spin-slow 12s linear infinite' }}>
            <text fontSize="6.5" fill="hsl(var(--primary))" fontFamily="monospace" letterSpacing="1">
              <textPath href="#textRing">
                SUPPORT THE JOURNEY ✦ SUPPORT THE JOURNEY ✦
              </textPath>
            </text>
          </g>

          {/* Orbital ellipses */}
          <ellipse cx="50" cy="50" rx="22" ry="10" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5"
            style={{ animation: 'orbit-tilt 6s linear infinite' }} />
          <ellipse cx="50" cy="50" rx="10" ry="20" fill="none" stroke="hsl(var(--secondary) / 0.15)" strokeWidth="0.5"
            style={{ animation: 'orbit-tilt 8s linear infinite reverse' }} />
        </svg>

        {/* Center coffee cup */}
        <svg viewBox="0 0 40 40" width="28" height="28" className="relative z-10">
          {/* Cup body */}
          <rect x="10" y="16" width="16" height="14" rx="2" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          {/* Handle */}
          <path d="M26 20 C30 20 30 26 26 26" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
          {/* Saucer */}
          <ellipse cx="18" cy="31" rx="12" ry="2" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" />
          {/* Steam lines */}
          <g className="steam-anim">
            <path d="M14 14 Q15 10 14 7" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1" strokeLinecap="round" />
            <path d="M18 13 Q19 9 18 5" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1" strokeLinecap="round" />
            <path d="M22 14 Q23 10 22 7" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </svg>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-sm pixel-card-primary p-6 text-center"
            >
              <h3 className="font-pixel text-[0.65rem] text-primary mb-3">ادعم الرحلة ☕</h3>
              <p className="font-body text-sm text-foreground mb-4">
                ساعدنا في تطوير PixÑol وإضافة محتوى جديد!
              </p>
              <div className="mb-4 mx-auto w-32 h-32 flex items-center justify-center border border-primary/30 p-2">
                <img src="/image_2.png" alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <p className="font-mono text-[0.5rem] text-muted-foreground break-all mb-4" dir="ltr">
                TN9Nzck6RCVMZeJJ9593qP7eXtyRaDqcgn
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="pixel-btn mx-auto"
              >
                <span>إغلاق</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); transform-origin: 50px 50px; } to { transform: rotate(360deg); transform-origin: 50px 50px; } }
        @keyframes orbit-tilt { from { transform: rotate3d(1,1,0,0deg); } to { transform: rotate3d(1,1,0,360deg); } }
        .steam-anim { animation: steam-float 2s ease-in-out infinite; }
        @keyframes steam-float {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
