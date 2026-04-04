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
      {/* Pixel-styled donate button */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="donate-btn fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-base">☕</span>
        <span className="text-[0.5rem] leading-none">ادعمنا</span>
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
