import { useState } from 'react';
import { motion } from 'framer-motion';
import PixelCharacter from '@/components/PixelCharacter';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [eyesCovered, setEyesCovered] = useState(false);
  const [error, setError] = useState('');

  // Extract name from email for the character greeting
  const nameFromEmail = email.split('@')[0] || '';

  const handleEmailFocus = () => {
    setIsTyping(true);
    setEyesCovered(false);
  };

  const handleEmailBlur = () => {
    setIsTyping(false);
  };

  const handlePasswordFocus = () => {
    setEyesCovered(true);
    setIsTyping(false);
  };

  const handlePasswordBlur = () => {
    setEyesCovered(false);
  };

  const handleLogin = () => {
    if (!email.trim()) {
      setError('أدخل بريدك الإلكتروني');
      return;
    }
    // Simple local auth - extract username from email
    const username = nameFromEmail || email;
    onLogin(username);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="pixel-card-primary max-w-md w-full p-8"
      >
        {/* Character header - Yeti style */}
        <div className="text-center mb-6">
          <motion.div
            animate={
              eyesCovered
                ? { y: [0, -3, 0] }
                : isTyping
                ? { rotate: [0, -2, 2, 0] }
                : {}
            }
            transition={{ repeat: isTyping ? Infinity : 0, duration: 1.5 }}
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <PixelCharacter
                character={{
                  skinColor: '#f4c794',
                  hairColor: '#3d2314',
                  outfitColor: '#3498db',
                  bootsColor: '#5d4037',
                  eyeColor: eyesCovered ? '#f4c794' : '#1a1a2e',
                  hairStyle: 1,
                  accessory: 0,
                }}
                size={10}
                animate={!eyesCovered}
              />
              {/* Cover eyes when typing password */}
              {eyesCovered && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-[38%] left-1/2 -translate-x-1/2 flex gap-1"
                >
                  <span className="text-lg">🙈</span>
                </motion.div>
              )}
            </div>
          </motion.div>
          <h1 className="font-pixel text-lg text-primary animate-pixel-glow">PIXÑOL</h1>
          <p className="font-pixel text-[0.5rem] text-muted-foreground mt-1">تسجيل الدخول - Iniciar sesión</p>
        </div>

        {/* Email field */}
        <div className="mb-4">
          <label htmlFor="loginEmail" className="block font-pixel text-[0.5rem] text-foreground mb-2">
            البريد الإلكتروني - Email
          </label>
          <input
            type="email"
            id="loginEmail"
            maxLength={254}
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            onFocus={handleEmailFocus}
            onBlur={handleEmailBlur}
            placeholder="email@domain.com"
            className="w-full px-4 py-3 bg-muted border-2 border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            dir="ltr"
          />
          <p className="text-muted-foreground font-body text-xs mt-1 text-left" dir="ltr">
            email@domain.com
          </p>
        </div>

        {/* Password toggle */}
        {!showPassword ? (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowPassword(true)}
            className="w-full mb-4 text-center font-pixel text-[0.45rem] text-primary hover:text-primary/80 transition-colors underline"
          >
            إضافة كلمة مرور (اختياري)
          </motion.button>
        ) : (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mb-4 overflow-hidden"
          >
            <label htmlFor="loginPassword" className="block font-pixel text-[0.5rem] text-foreground mb-2">
              كلمة المرور - Contraseña
            </label>
            <input
              type="password"
              id="loginPassword"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-muted border-2 border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              dir="ltr"
            />
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-destructive font-body text-sm mb-3"
          >
            {error}
          </motion.p>
        )}

        {/* Login button */}
        <button
          id="login"
          onClick={handleLogin}
          className="pixel-btn w-full mb-4"
        >
          ¡Entrar! تسجيل الدخول
        </button>

        <p className="text-center text-muted-foreground font-body text-xs">
          ليس لديك حساب؟{' '}
          <button
            onClick={handleLogin}
            className="text-primary hover:underline font-pixel text-[0.45rem]"
          >
            سجل الآن
          </button>
        </p>
      </motion.div>
    </div>
  );
}
