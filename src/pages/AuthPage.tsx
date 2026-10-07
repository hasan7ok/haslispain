import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Eye, EyeOff, Loader2, LockKeyhole, RefreshCw, Sparkles, UserPlus } from 'lucide-react';
import { z } from 'zod';
import PixelAvatar from '@/components/PixelAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import logo from '@/assets/pixnol-logo.png';
import authBackground from '@/assets/premium-learning-hero.jpg';

interface AuthPageProps {
  onSignUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  onSignIn: (email: string, password: string) => Promise<{ error: any }>;
  checkUsername: (username: string) => Promise<boolean>;
}

const emailSchema = z.string().trim().email('بريد إلكتروني غير صالح').max(254);
const passwordSchema = z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل').max(128);
const usernameSchema = z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(20, 'الاسم يجب أن يكون أقل من 20 حرف').regex(/^[a-zA-Z0-9_]+$/, 'فقط أحرف إنجليزية وأرقام و _');

export default function AuthPage({ onSignUp, onSignIn, checkUsername }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarSeed, setAvatarSeed] = useState(() => `portrait_${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (mode !== 'signup' || username.length < 3 || !usernameSchema.safeParse(username).success) {
      setUsernameAvailable(null);
      return;
    }
    setCheckingUsername(true);
    const timer = window.setTimeout(async () => {
      setUsernameAvailable(await checkUsername(username));
      setCheckingUsername(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [username, mode, checkUsername]);

  const changeMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) return setError(emailResult.error.errors[0].message);
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) return setError(passwordResult.error.errors[0].message);
    if (mode === 'signup') {
      const usernameResult = usernameSchema.safeParse(username);
      if (!usernameResult.success) return setError(usernameResult.error.errors[0].message);
      if (usernameAvailable === false) return setError('هذا الاسم مستخدم بالفعل');
    }

    setLoading(true);
    try {
      const { error: authError } = mode === 'login'
        ? await onSignIn(email, password)
        : await onSignUp(email, password, username);
      if (authError) {
        if (authError.message?.includes('Invalid login credentials')) setError('بريد إلكتروني أو كلمة مرور خاطئة');
        else if (authError.message?.includes('Email not confirmed')) setError('يرجى تأكيد بريدك الإلكتروني أولاً');
        else if (authError.message?.includes('already registered')) setError('هذا البريد الإلكتروني مسجل بالفعل');
        else setError(authError.message || 'تعذر إكمال العملية، حاول مرة أخرى');
      } else if (mode === 'signup') {
        setSuccess('تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <img src={authBackground} alt="شارع إسباني معاصر في مدريد" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-background/65 to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/25" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1fr_1.05fr]">
        <section className="hidden min-h-screen flex-col justify-between p-10 lg:flex xl:p-14" dir="rtl">
          <img src={logo} alt="PIXÑOL" className="h-14 w-14 object-contain" />
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl pb-8">
            <p className="mb-5 flex items-center gap-3 text-sm font-semibold text-primary"><span className="h-px w-12 bg-primary" /> لغة للحياة الحقيقية</p>
            <h1 className="font-heading text-5xl font-semibold leading-tight xl:text-6xl">تعلّم الإسبانية<br />كما تُعاش.</h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-foreground/75">دروس عملية، ثقافة أصيلة، ومسار واضح يأخذك من أول تحية إلى محادثة واثقة.</p>
            <div className="mt-10 flex gap-8 border-t border-foreground/20 pt-6 text-sm">
              <span><strong className="block font-heading text-2xl text-foreground">7</strong> مستويات مترابطة</span>
              <span><strong className="block font-heading text-2xl text-foreground">13+</strong> رحلة ثقافية</span>
            </div>
          </motion.div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-8 lg:justify-end lg:px-12" dir="rtl">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[520px] border border-border/80 bg-card/95 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-7 flex items-center justify-between lg:hidden">
              <img src={logo} alt="PIXÑOL" className="h-12 w-12 object-contain" />
              <span className="text-xs font-semibold text-primary">APRENDE · EXPLORA · HABLA</span>
            </div>

            <p className="text-sm font-semibold text-primary">{mode === 'login' ? 'مرحباً بعودتك' : 'ابدأ رحلتك اليوم'}</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">{mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{mode === 'login' ? 'تابع من حيث توقفت في مسارك الإسباني.' : 'أنشئ هويتك وابدأ من المستوى المناسب لك.'}</p>

            <div className="mt-7 grid grid-cols-2 border border-border bg-background/50 p-1" aria-label="اختيار التسجيل">
              <Button type="button" variant={mode === 'login' ? 'default' : 'ghost'} className="rounded-sm" onClick={() => changeMode('login')}><LockKeyhole /> دخول</Button>
              <Button type="button" variant={mode === 'signup' ? 'default' : 'ghost'} className="rounded-sm" onClick={() => changeMode('signup')}><UserPlus /> حساب جديد</Button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <AnimatePresence initial={false}>
                {mode === 'signup' && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="grid gap-5 sm:grid-cols-[112px_1fr] sm:items-end">
                    <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                      <PixelAvatar seed={avatarSeed} size={82} frameStyle="cyber-green" />
                      <Button type="button" variant="ghost" size="sm" onClick={() => setAvatarSeed(`portrait_${Date.now()}_${Math.random()}`)}><RefreshCw /> تغيير الصورة</Button>
                    </div>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold">اسم المستخدم</span>
                      <span className="relative block">
                        <Input value={username} onChange={(event) => { setUsername(event.target.value); setError(''); }} maxLength={20} placeholder="spanish_explorer" className="h-12 rounded-sm bg-background/70 pl-10" dir="ltr" />
                        {checkingUsername && <Loader2 className="absolute left-3 top-4 size-4 animate-spin text-muted-foreground" />}
                        {!checkingUsername && usernameAvailable === true && <Check className="absolute left-3 top-4 size-4 text-primary" />}
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold">البريد الإلكتروني</span>
                <Input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(''); }} maxLength={254} placeholder="name@email.com" className="h-12 rounded-sm bg-background/70" dir="ltr" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold">كلمة المرور</span>
                <span className="relative block">
                  <Input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} maxLength={128} placeholder="••••••••" className="h-12 rounded-sm bg-background/70 pl-12" dir="ltr" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((visible) => !visible)} className="absolute left-1 top-1 h-10 w-10" aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}>{showPassword ? <EyeOff /> : <Eye />}</Button>
                </span>
              </label>

              <AnimatePresence>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-r-2 border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</motion.p>}
                {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="border-r-2 border-primary bg-primary/10 px-4 py-3 text-sm text-primary">{success}</motion.p>}
              </AnimatePresence>

              <Button type="submit" size="lg" disabled={loading} className="h-12 w-full rounded-sm font-semibold">
                {loading ? <Loader2 className="animate-spin" /> : <>{mode === 'login' ? 'ادخل إلى مسارك' : 'أنشئ حسابك'} <ArrowLeft /></>}
              </Button>
            </form>

            <div className="mt-7 flex items-center justify-between border-t border-border pt-5 text-xs text-muted-foreground">
              <a href="/how-it-works" className="transition-colors hover:text-primary">كيف يعمل PIXÑOL؟</a>
              <span className="flex items-center gap-1.5"><Sparkles className="size-3.5 text-accent" /> تجربة تعلّم شخصية</span>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}