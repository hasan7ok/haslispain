import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';

const WALLET_ADDRESS = 'TN9Nzck6RCVMZeJJ9593qP7eXtyRaDqcgn';

function CoffeeIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Steam lines */}
      <path d="M35 28c0-6 3-8 1-14" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        <animate attributeName="d" values="M35 28c0-6 3-8 1-14;M35 28c0-6-3-8 1-14;M35 28c0-6 3-8 1-14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite"/>
      </path>
      <path d="M50 25c0-5 2-7 0-12" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.5">
        <animate attributeName="d" values="M50 25c0-5 2-7 0-12;M50 25c0-5-2-7 0-12;M50 25c0-5 2-7 0-12" dur="2.4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.4s" repeatCount="indefinite"/>
      </path>
      <path d="M65 28c0-6 3-8 1-14" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        <animate attributeName="d" values="M65 28c0-6-3-8 1-14;M65 28c0-6 3-8 1-14;M65 28c0-6-3-8 1-14" dur="1.8s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.8s" repeatCount="indefinite"/>
      </path>

      {/* Cup body - rounded mug shape */}
      <path d="M20 35h60c0 0 2 0 2 3l-4 38c-1 5-4 8-10 8H32c-6 0-9-3-10-8L18 38c0-3 2-3 2-3z" fill="url(#mugBody)" stroke="url(#mugStroke)" strokeWidth="2.5"/>
      
      {/* Coffee surface */}
      <ellipse cx="50" cy="39" rx="28" ry="5" fill="#4A1E06"/>
      <ellipse cx="50" cy="38" rx="25" ry="4" fill="#6B3410" opacity="0.8"/>
      <ellipse cx="42" cy="37" rx="8" ry="2" fill="#8B5E3C" opacity="0.4"/>

      {/* Cup rim highlight */}
      <path d="M22 35h56" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Body highlight */}
      <path d="M28 45c1 15 3 28 5 33" stroke="rgba(255,255,255,0.12)" strokeWidth="3" strokeLinecap="round"/>

      {/* Handle */}
      <path d="M80 42c8 0 12 5 12 13s-4 13-12 13" fill="none" stroke="url(#mugStroke)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M80 45c5 0 9 4 9 10s-4 10-9 10" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" strokeLinecap="round"/>

      {/* Saucer */}
      <ellipse cx="50" cy="86" rx="35" ry="6" fill="url(#saucerFill)" stroke="url(#mugStroke)" strokeWidth="1.5"/>
      <ellipse cx="50" cy="85" rx="28" ry="4" fill="rgba(255,255,255,0.06)"/>

      <defs>
        <linearGradient id="mugBody" x1="20" y1="35" x2="80" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F8F4EE"/>
          <stop offset="0.5" stopColor="#EDE5D8"/>
          <stop offset="1" stopColor="#D4C4AE"/>
        </linearGradient>
        <linearGradient id="mugStroke" x1="20" y1="35" x2="80" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C4A882"/>
          <stop offset="1" stopColor="#A08060"/>
        </linearGradient>
        <linearGradient id="saucerFill" x1="15" y1="86" x2="85" y2="86" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D8CCBC"/>
          <stop offset="0.5" stopColor="#F0E8DC"/>
          <stop offset="1" stopColor="#D8CCBC"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

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
      {/* Floating coffee cup — no background, no circle */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-transparent border-none p-0 cursor-pointer"
        whileHover={{ scale: 1.15, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        title="ادعمنا"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
      >
        <CoffeeIcon />
      </motion.button>

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
    </>
  );
}
