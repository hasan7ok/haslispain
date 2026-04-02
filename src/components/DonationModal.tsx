import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Copy, Check } from 'lucide-react';

const WALLET_ADDRESS = 'TN9Nzck6RCVMZeJJ9593qP7eXtyRaDqcgn';

export default function DonationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border-2 border-primary bg-card/90 backdrop-blur-sm flex items-center justify-center group transition-all duration-300 hover:scale-110"
        style={{ boxShadow: '0 0 20px hsl(var(--primary) / 0.4)' }}
      >
        <svg viewBox="0 0 60 60" width="56" height="56" className="absolute inset-0">
          <defs>
            <path id="circlePath" d="M30,30 m-22,0 a22,22 0 1,1 44,0 a22,22 0 1,1 -44,0" />
          </defs>
          <text fontSize="5.5" fill="hsl(var(--primary))" className="uppercase tracking-widest">
            <textPath href="#circlePath">
              SUPPORT THE JOURNEY ✦ SUPPORT THE JOURNEY ✦
            </textPath>
          </text>
          <animateTransform attributeName="transform" type="rotate" from="0 30 30" to="360 30 30" dur="20s" repeatCount="indefinite" />
        </svg>
        <span className="text-lg relative z-10">☕</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="pixel-card-primary p-6 max-w-sm w-full text-center relative"
            >
              <button onClick={() => setIsOpen(false)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
              <Heart size={28} className="text-primary mx-auto mb-3" />
              <h3 className="font-pixel text-[0.6rem] text-primary mb-2">ادعم المشروع</h3>
              <p className="font-body text-sm text-foreground mb-4">ساعدنا في تطوير التطبيق وإضافة محتوى جديد!</p>
              
              <div className="bg-muted/50 border border-border p-3 mb-3">
                <p className="font-mono text-[0.55rem] text-muted-foreground mb-1">USDT (TRC20)</p>
                <p className="font-mono text-xs text-secondary break-all" dir="ltr">{WALLET_ADDRESS}</p>
              </div>

              <button
                onClick={copyAddress}
                className="flex items-center gap-2 mx-auto px-4 py-2 border border-primary/50 text-primary font-pixel text-[0.45rem] hover:bg-primary/10 transition-all"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'تم النسخ!' : 'نسخ العنوان'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
