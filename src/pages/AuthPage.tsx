import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PixelAvatar from '@/components/PixelAvatar';
import { Eye, EyeOff, Loader2, UserPlus, LogIn, RefreshCw, ChevronRight } from 'lucide-react';
import { z } from 'zod';

interface AuthPageProps {
  onSignUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  checkUsername: (username: string) => Promise<boolean>;
}

const emailSchema = z.string().trim().email('بريد إلكتروني غير صالح').max(254);
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').max(128);
const usernameSchema = z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(20, 'الاسم يجب أن يكون أقل من 20 حرف').regex(/^[a-zA-Z0-9_]+$/, 'فقط أحرف إنجليزية وأرقام و _');

// Vaporwave grid background
function VaporGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    const colors = ['#FF00FF', '#00FFFF', '#FF9900', '#FF00FF', '#00FFFF'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    let offset = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 0.3;

      // Perspective grid
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.04)';
      ctx.lineWidth = 1;
      const cx = canvas.width / 2;
      const horizon = canvas.height * 0.35;
      for (let x = -canvas.width; x < canvas.width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(cx, horizon);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = horizon; y < canvas.height; y += 20 + (y - horizon) * 0.15) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.03 + (y - horizon) / canvas.height * 0.04})`;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

export default function AuthPage({ onSignUp, onSignIn, checkUsername }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(() => `pixel_${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [success, setSuccess] = useState('');

  // Debounced username check
  useEffect(() => {
    if (mode !== 'signup' || !username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      const available = await checkUsername(username);
      setUsernameAvailable(available);
      setCheckingUsername(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [username, mode, checkUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setError(emailResult.error.errors[0].message);
      return;
    }
    const passResult = passwordSchema.safeParse(password);
    if (!passResult.success) {
      setError(passResult.error.errors[0].message);
      return;
    }

    if (mode === 'signup') {
      const userResult = usernameSchema.safeParse(username);
      if (!userResult.success) {
        setError(userResult.error.errors[0].message);
        return;
      }
      if (usernameAvailable === false) {
        setError('هذا الاسم مستخدم بالفعل');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: authError } = await onSignIn(email, password);
        if (authError) {
          if (authError.message?.includes('Invalid login credentials')) {
            setError('بريد إلكتروني أو كلمة مرور خاطئة');
          } else if (authError.message?.includes('Email not confirmed')) {
            setError('يرجى تأكيد بريدك الإلكتروني أولاً');
          } else {
            setError(authError.message || 'حدث خطأ في تسجيل الدخول');
          }
        }
      } else {
        const { error: authError } = await onSignUp(email, password, username);
        if (authError) {
          if (authError.message?.includes('already registered')) {
            setError('هذا البريد الإلكتروني مسجل بالفعل');
          } else {
            setError(authError.message || 'حدث خطأ في إنشاء الحساب');
          }
        } else {
          setSuccess('تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتأكيد الحساب 📧');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const regenerateAvatar = () => {
    setAvatarSeed(`pixel_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #090014 0%, #120025 50%, #090014 100%)' }}>
      <VaporGrid />

      {/* Floating sun orb */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full opacity-15 blur-[100px]"
        style={{ background: 'linear-gradient(to bottom, #FF9900, #FF00FF)' }}
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="relative z-20 w-full max-w-md mx-4"
      >
        {/* Terminal window card */}
        <div className="border-2 border-secondary/40 bg-card/90 backdrop-blur-md"
          style={{
            boxShadow: '0 0 30px rgba(0,255,255,0.1), 0 0 60px rgba(255,0,255,0.05)',
          }}
        >
          {/* Window title bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-secondary/30 bg-secondary/5">
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <div className="h-3 w-3 rounded-full bg-secondary" />
              <div className="h-3 w-3 rounded-full bg-accent" />
            </div>
            <span className="font-mono text-[0.6rem] text-secondary/60 uppercase tracking-widest">
              {'>'} auth.sys
            </span>
          </div>

          <div className="p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <motion.h1
                className="font-pixel text-2xl mb-1"
                style={{
                  background: 'linear-gradient(to right, #FF9900, #FF00FF, #00FFFF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(255,0,255,0.5))',
                }}
                animate={{ filter: ['drop-shadow(0 0 10px rgba(255,0,255,0.3))', 'drop-shadow(0 0 25px rgba(255,0,255,0.6))', 'drop-shadow(0 0 10px rgba(255,0,255,0.3))'] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                PIXÑOL
              </motion.h1>
              <p className="font-mono text-[0.6rem] text-secondary/70 uppercase tracking-wider">
                {mode === 'login' ? 'تسجيل الدخول - Iniciar sesión' : 'إنشاء حساب - Crear cuenta'}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="flex mb-6 border-2 border-border">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 font-pixel text-[0.5rem] flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10'
                }`}
              >
                <LogIn size={14} /> دخول
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 font-pixel text-[0.5rem] flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                    : 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-primary/10'
                }`}
              >
                <UserPlus size={14} /> تسجيل
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Avatar for signup */}
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col items-center gap-3 mb-4">
                      <p className="font-mono text-[0.6rem] text-secondary/70 uppercase tracking-wider">أفاتارك العشوائي</p>
                      <motion.div
                        key={avatarSeed}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <PixelAvatar seed={avatarSeed} size={96} frameStyle="cyber-green" />
                      </motion.div>
                      <button
                        type="button"
                        onClick={regenerateAvatar}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-secondary border border-secondary/30 hover:bg-secondary/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all uppercase tracking-wider"
                      >
                        <RefreshCw size={12} /> توليد جديد
                      </button>
                    </div>

                    {/* Username */}
                    <div className="mb-4">
                      <label className="block font-pixel text-[0.45rem] text-foreground mb-2">
                        اسم المعرّف - Username
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={username}
                          onChange={e => { setUsername(e.target.value); setError(''); }}
                          maxLength={20}
                          placeholder="pixel_warrior"
                          className="w-full px-4 py-3 bg-background border-b-2 border-primary text-secondary font-mono text-sm placeholder:text-primary/40 focus:outline-none focus:border-secondary focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
                          dir="ltr"
                        />
                        {checkingUsername && (
                          <Loader2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
                        )}
                        {!checkingUsername && usernameAvailable === true && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent text-xs" style={{ filter: 'drop-shadow(0 0 4px rgba(255,153,0,0.6))' }}>✓</span>
                        )}
                        {!checkingUsername && usernameAvailable === false && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-destructive text-xs">✗</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div>
                <label className="block font-pixel text-[0.45rem] text-foreground mb-2">
                  البريد الإلكتروني - Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  maxLength={254}
                  placeholder="email@domain.com"
                  className="w-full px-4 py-3 bg-background border-b-2 border-primary text-secondary font-mono text-sm placeholder:text-primary/40 focus:outline-none focus:border-secondary focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
                  dir="ltr"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-pixel text-[0.45rem] text-foreground mb-2">
                  كلمة المرور - Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    maxLength={128}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-background border-b-2 border-primary text-secondary font-mono text-sm placeholder:text-primary/40 focus:outline-none focus:border-secondary focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all pr-12"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error/Success */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-destructive font-body text-sm px-3 py-2 border border-destructive/30 bg-destructive/10"
                  >
                    {error}
                  </motion.p>
                )}
                {success && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-body text-sm px-3 py-2 border bg-secondary/10 text-secondary border-secondary/30"
                  >
                    {success}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="pixel-btn-secondary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="flex items-center gap-2">
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? '¡Entrar! دخول' : '¡Crear! إنشاء'}
                      <ChevronRight size={14} />
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          {/* How it works link */}
          <div className="px-4 py-2.5 border-t border-border bg-background/50 text-center">
            <a
              href="/how-it-works"
              className="font-pixel text-[0.5rem] text-secondary/70 hover:text-secondary transition-colors uppercase tracking-wider"
              style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.3))' }}
            >
              كيف يعمل التطبيق؟ - ¿Cómo funciona?
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
