import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

const WALLET_ADDRESS = 'TN9Nzck6RCVMZeJJ9593qP7eXtyRaDqcgn';

export default function DonationButton() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating coffee cup — no border/frame */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 w-[56px] h-[56px] flex items-center justify-center"
        style={{ background: 'transparent' }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg viewBox="0 0 56 56" width="56" height="56">
          {/* Cup body */}
          <rect x="14" y="22" width="22" height="18" rx="3" fill="none" stroke="hsl(var(--primary))" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.6))' }} />
          {/* Handle */}
          <path d="M36 27 C42 27 42 35 36 35" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
          {/* Coffee surface */}
          <ellipse cx="25" cy="30" rx="8" ry="2" fill="hsl(var(--primary) / 0.2)" />
          {/* Steam */}
          <g className="steam-lines">
            <path d="M20 19 Q21 14 20 10" fill="none" stroke="hsl(var(--primary) / 0.6)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M25 18 Q26 12 25 7" fill="none" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M30 19 Q31 14 30 10" fill="none" stroke="hsl(var(--primary) / 0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </g>
          {/* Saucer */}
          <ellipse cx="25" cy="41" rx="16" ry="3" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1.5" />
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
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>

              <h3 className="font-pixel text-[0.65rem] text-primary mb-3">ادعم الرحلة ☕</h3>
              <p className="font-body text-sm text-foreground mb-4">
                ساعدنا في تطوير PixÑol وإضافة محتوى جديد!
              </p>

              {/* QR Code */}
              <div className="mb-4 mx-auto w-40 h-40 flex items-center justify-center border border-primary/30 p-2 rounded-lg">
                <img src="/qr-donation.jpg" alt="QR Code - USDT TRC20" className="w-full h-full object-contain rounded" />
              </div>

              {/* Wallet address */}
              <div className="bg-muted/50 border border-border p-3 mb-3 rounded">
                <p className="font-mono text-[0.55rem] text-muted-foreground mb-1">USDT (TRC20)</p>
                <p className="font-mono text-xs text-secondary break-all" dir="ltr">{WALLET_ADDRESS}</p>
              </div>

              <button
                onClick={copyAddress}
                className="flex items-center gap-2 mx-auto px-4 py-2 border border-primary/50 text-primary font-pixel text-[0.45rem] hover:bg-primary/10 transition-all rounded"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'تم النسخ!' : 'نسخ العنوان'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .steam-lines { animation: steam-float 2s ease-in-out infinite; }
        @keyframes steam-float {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </>
  );
}
