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
      {/* Floating realistic coffee cup — no background, no border */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 bg-transparent border-none p-0 cursor-pointer"
        whileHover={{ scale: 1.15, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        title="ادعمنا"
      >
        <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Steam */}
          <path d="M22 16c0-4 2-6 0-10" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
            <animate attributeName="d" values="M22 16c0-4 2-6 0-10;M22 16c0-4-2-6 0-10;M22 16c0-4 2-6 0-10" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/>
          </path>
          <path d="M30 14c0-3 1.5-5 0-8" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.4">
            <animate attributeName="d" values="M30 14c0-3 1.5-5 0-8;M30 14c0-3-1.5-5 0-8;M30 14c0-3 1.5-5 0-8" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite"/>
          </path>
          <path d="M38 16c0-4 2-6 0-10" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.5">
            <animate attributeName="d" values="M38 16c0-4-2-6 0-10;M38 16c0-4 2-6 0-10;M38 16c0-4-2-6 0-10" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.8s" repeatCount="indefinite"/>
          </path>
          {/* Cup body */}
          <path d="M12 22h36l-4 30a4 4 0 01-4 3.5H20a4 4 0 01-4-3.5L12 22z" fill="url(#cupGrad)" stroke="#FFD700" strokeWidth="1.5"/>
          {/* Coffee liquid */}
          <ellipse cx="30" cy="26" rx="16" ry="3.5" fill="#3B1A08" opacity="0.9"/>
          <ellipse cx="30" cy="25.5" rx="14" ry="2.5" fill="#5C2E0E" opacity="0.7"/>
          {/* Highlight on cup */}
          <path d="M16 28c0 0 1 18 4 24" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeLinecap="round"/>
          {/* Handle */}
          <path d="M48 26c6 0 8 4 8 9s-2 9-8 9" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
          {/* Saucer */}
          <ellipse cx="30" cy="56" rx="22" ry="4" fill="url(#saucerGrad)" stroke="#FFD700" strokeWidth="1"/>
          <defs>
            <linearGradient id="cupGrad" x1="12" y1="22" x2="48" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F5F0E8"/>
              <stop offset="1" stopColor="#D4C9B8"/>
            </linearGradient>
            <linearGradient id="saucerGrad" x1="8" y1="56" x2="52" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#E8E0D4"/>
              <stop offset="0.5" stopColor="#F5F0E8"/>
              <stop offset="1" stopColor="#D4C9B8"/>
            </linearGradient>
          </defs>
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
        .donate-btn {
          image-rendering: pixelated;
          border: 3px solid #FFD700;
          background: #2d0a4e;
          color: #FFD700;
          font-family: 'Press Start 2P', monospace;
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.3), inset 0 0 8px rgba(255, 215, 0, 0.1);
        }
        .donate-btn:hover {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 12px rgba(255, 215, 0, 0.2);
        }
      `}</style>
    </>
  );
}
