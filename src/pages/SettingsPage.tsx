import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import PixelAvatar from '@/components/PixelAvatar';
import Header from '@/components/Header';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, RefreshCw, Loader2, Check, Sun, Moon } from 'lucide-react';
import { z } from 'zod';

const usernameSchema = z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(20, 'الاسم يجب أن يكون أقل من 20 حرف').regex(/^[a-zA-Z0-9_]+$/, 'فقط أحرف إنجليزية وأرقام و _');

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, user, updateProfile, checkUsernameAvailable, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState(profile?.username || '');
  const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  const regenerateAvatar = () => {
    setAvatarSeed(`pixel_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    setError('');
    setUsernameAvailable(null);

    if (value === profile?.username) {
      setUsernameAvailable(true);
      return;
    }

    const parsed = usernameSchema.safeParse(value);
    if (!parsed.success || value.length < 3) return;

    setCheckingUsername(true);
    const available = await checkUsernameAvailable(value);
    setUsernameAvailable(available);
    setCheckingUsername(false);
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');

    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }

    if (username !== profile?.username && usernameAvailable === false) {
      setError('هذا الاسم مستخدم بالفعل');
      return;
    }

    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      if (username !== profile?.username) updates.username = username;
      if (avatarSeed !== profile?.avatar_url) updates.avatar_url = avatarSeed;

      if (Object.keys(updates).length === 0) {
        setSuccess('لا توجد تغييرات لحفظها');
        setSaving(false);
        return;
      }

      const result = await updateProfile(updates);
      if (result?.error) {
        setError(result.error.message || 'حدث خطأ أثناء الحفظ');
      } else {
        setSuccess('تم حفظ التغييرات بنجاح ✓');
        await refreshProfile();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-lg">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-6">
          <ArrowLeft size={16} /> العودة
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-pixel text-sm text-gradient-vapor mb-6">الإعدادات - Ajustes</h1>

          {/* Avatar */}
          <div className="pixel-card-primary p-6 mb-6 text-center">
            <p className="font-pixel text-[0.5rem] text-secondary mb-4">الصورة الرمزية - Avatar</p>
            <motion.div key={avatarSeed} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
              <PixelAvatar seed={avatarSeed} size={96} frameStyle="cyber-green" />
            </motion.div>
            <button
              type="button"
              onClick={regenerateAvatar}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 mx-auto text-xs font-mono text-secondary border border-secondary/30 hover:bg-secondary/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all uppercase tracking-wider"
            >
              <RefreshCw size={12} /> توليد صورة جديدة
            </button>
          </div>

          {/* Username */}
          <div className="pixel-card p-6 mb-6">
            <label className="block font-pixel text-[0.5rem] text-foreground mb-3">
              اسم المعرّف - Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 bg-background border-b-2 border-primary text-secondary font-mono text-sm placeholder:text-primary/40 focus:outline-none focus:border-secondary focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all"
                dir="ltr"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {checkingUsername && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                {!checkingUsername && usernameAvailable === true && <Check size={14} className="text-accent" />}
                {!checkingUsername && usernameAvailable === false && <span className="text-destructive text-xs">✗</span>}
              </div>
          </div>

          {/* Theme Toggle */}
          <div className="pixel-card p-6 mb-6">
            <label className="block font-pixel text-[0.5rem] text-foreground mb-3">
              المظهر - Tema
            </label>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon size={18} className="text-secondary" />
                ) : (
                  <Sun size={18} className="text-accent" />
                )}
                <span className="font-mono text-sm text-foreground">
                  {theme === 'dark' ? 'الوضع المظلم - Oscuro' : 'الوضع الفاتح - Claro'}
                </span>
              </div>
              <Switch checked={theme === 'light'} onCheckedChange={toggleTheme} />
            </div>
          </div>
            <p className="font-mono text-[0.55rem] text-muted-foreground mt-2">3-20 حرف إنجليزي أو أرقام أو _</p>
          </div>

          {/* Error / Success */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive font-body text-sm px-3 py-2 border border-destructive/30 bg-destructive/10 mb-4">
              {error}
            </motion.p>
          )}
          {success && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent font-body text-sm px-3 py-2 border border-accent/30 bg-accent/10 mb-4">
              {success}
            </motion.p>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="pixel-btn-secondary w-full flex items-center justify-center gap-2"
          >
            <span className="flex items-center gap-2">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </span>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
