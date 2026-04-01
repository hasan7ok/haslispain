import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState, CharacterConfig } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import PixelCharacter from '@/components/PixelCharacter';
import PixelAvatar from '@/components/PixelAvatar';
import NFTCollection, { NFTItem } from '@/components/NFTCollection';
import XPBar from '@/components/XPBar';
import Header from '@/components/Header';
import { ArrowLeft, Edit3, Save, Trash2, RefreshCw, Loader2, Check, Share2 } from 'lucide-react';
import { THEMES } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const SKIN_COLORS = ['#f4c794', '#e0ac69', '#c68642', '#8d5524', '#6b3a1f', '#f9d5a7'];
const HAIR_COLORS = ['#3d2314', '#1a1a2e', '#c9a96e', '#e74c3c', '#2980b9', '#8e44ad', '#f39c12', '#ecf0f1'];
const OUTFIT_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
const BOOTS_COLORS = ['#5d4037', '#1a1a2e', '#795548', '#3e2723', '#4a148c', '#b71c1c'];

const ACHIEVEMENTS_LIST = [
  { id: 'firstGame', name: 'اللاعب الأول', nameEs: 'Primer Jugador', icon: '🎮', desc: 'أكمل أول لعبة' },
  { id: 'lessons5', name: 'طالب مجتهد', nameEs: 'Estudiante', icon: '📚', desc: 'أكمل 5 دروس' },
  { id: 'lessons10', name: 'باحث عن المعرفة', nameEs: 'Sabio', icon: '🎓', desc: 'أكمل 10 دروس' },
  { id: 'level5', name: 'المستكشف', nameEs: 'Explorador', icon: '🗺️', desc: 'وصل للمستوى 5' },
  { id: 'level10', name: 'البطل', nameEs: 'Héroe', icon: '⚔️', desc: 'وصل للمستوى 10' },
  { id: 'xp500', name: 'جامع الخبرة', nameEs: 'Experto', icon: '✨', desc: 'اجمع 500 XP' },
  { id: 'xp1000', name: 'الأسطورة', nameEs: 'Leyenda', icon: '👑', desc: 'اجمع 1000 XP' },
];

const usernameSchema = z.string().trim().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل').max(20, 'الاسم يجب أن يكون أقل من 20 حرف').regex(/^[a-zA-Z0-9_]+$/, 'فقط أحرف إنجليزية وأرقام و _');

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, updateCharacter, updateUsername, resetProgress, xpToNextLevel } = useGameState();
  const { profile, user, updateProfile, checkUsernameAvailable, refreshProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(state.username);
  const [nfts, setNfts] = useState<NFTItem[]>([]);

  // Settings state
  const [username, setUsername] = useState(profile?.username || '');
  const [avatarSeed, setAvatarSeed] = useState(profile?.avatar_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const loadNFTs = async () => {
      const { data: collections } = await supabase.from('nft_collections').select('*');
      const { data: userNfts } = user
        ? await supabase.from('user_nfts').select('nft_id, earned_at').eq('user_id', user.id)
        : { data: [] };

      if (collections) {
        const earnedIds = new Set((userNfts || []).map(n => n.nft_id));
        setNfts(
          collections.map(c => ({
            id: c.id, name: c.name, description: c.description, image_seed: c.image_seed,
            rarity: c.rarity, category: c.category, frame_style: c.frame_style || 'default',
            unlock_condition: c.unlock_condition, earned: earnedIds.has(c.id),
            earned_at: userNfts?.find(n => n.nft_id === c.id)?.earned_at || undefined,
          }))
        );
      }
    };
    loadNFTs();
  }, [user]);

  const handleColorChange = (key: keyof CharacterConfig, value: string) => {
    updateCharacter({ [key]: value });
  };

  const saveName = () => {
    if (newName.trim()) { updateUsername(newName.trim()); setEditingName(false); }
  };

  const regenerateAvatar = () => {
    setAvatarSeed(`pixel_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  };

  const handleUsernameChange = async (value: string) => {
    setUsername(value);
    setError('');
    setUsernameAvailable(null);
    if (value === profile?.username) { setUsernameAvailable(true); return; }
    const parsed = usernameSchema.safeParse(value);
    if (!parsed.success || value.length < 3) return;
    setCheckingUsername(true);
    const available = await checkUsernameAvailable(value);
    setUsernameAvailable(available);
    setCheckingUsername(false);
  };

  const handleSave = async () => {
    setError(''); setSuccess('');
    const parsed = usernameSchema.safeParse(username);
    if (!parsed.success) { setError(parsed.error.errors[0].message); return; }
    if (username !== profile?.username && usernameAvailable === false) { setError('هذا الاسم مستخدم بالفعل'); return; }

    setSaving(true);
    try {
      const updates: Record<string, unknown> = {};
      if (username !== profile?.username) updates.username = username;
      if (avatarSeed !== profile?.avatar_url) updates.avatar_url = avatarSeed;
      if (Object.keys(updates).length === 0) { setSuccess('لا توجد تغييرات لحفظها'); setSaving(false); return; }

      const result = await updateProfile(updates);
      if (result?.error) { setError(result.error.message || 'حدث خطأ أثناء الحفظ'); }
      else {
        // Sync username to game state (localStorage) so it shows on home page
        if (updates.username) updateUsername(updates.username as string);
        setSuccess('تم حفظ التغييرات بنجاح ✓');
        await refreshProfile();
      }
    } finally { setSaving(false); }
  };

  const shareStats = async () => {
    const statsArea = document.getElementById('stats-share-area');
    if (!statsArea) return;
    
    // Create a canvas to render stats as image
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 600, 400);
    
    // Border glow
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 584, 384);
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, 576, 376);

    // Title
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('📊 إحصائياتي - Mis Estadísticas', 300, 45);

    // Username
    ctx.fillStyle = '#00ffff';
    ctx.font = '16px monospace';
    ctx.fillText(`🎮 ${state.username}`, 300, 75);

    // Stats grid
    const stats = [
      { icon: '📚', value: `${state.completedLessons.length}`, label: 'دروس' },
      { icon: '🎮', value: `${state.completedGames.length}`, label: 'ألعاب' },
      { icon: '📝', value: `${state.completedLessons.length * 8}`, label: 'كلمات' },
      { icon: '⭐', value: `${state.totalXpEarned}`, label: 'XP' },
      { icon: '🔥', value: `${state.streak}`, label: 'أيام' },
      { icon: '🏆', value: `${state.achievements.length}`, label: 'إنجازات' },
    ];

    stats.forEach((s, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 80 + col * 180;
      const y = 120 + row * 130;

      ctx.fillStyle = 'rgba(255,0,255,0.08)';
      ctx.fillRect(x - 60, y - 20, 150, 100);
      ctx.strokeStyle = 'rgba(255,0,255,0.3)';
      ctx.strokeRect(x - 60, y - 20, 150, 100);

      ctx.font = '28px serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fff';
      ctx.fillText(s.icon, x + 15, y + 15);
      
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(s.value, x + 15, y + 48);
      
      ctx.fillStyle = '#aaa';
      ctx.font = '12px monospace';
      ctx.fillText(s.label, x + 15, y + 68);
    });

    // Footer
    ctx.fillStyle = '#555';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PIXÑOL 🇪🇸 — طريقك لإتقان الإسبانية يبدأ هنا', 300, 385);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'my-stats.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'إحصائياتي في HaSli Spain', text: '🎮 شاهد تقدمي في تعلّم الإسبانية!' });
          return;
        } catch {}
      }
      
      // Fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-stats.png';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('تم تحميل صورة الإحصائيات! 📊');
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-2xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        {/* Character display */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pixel-card-primary p-6 mb-6 text-center">
          <PixelCharacter character={state.character} size={10} animate className="mb-4" />
          {editingName ? (
            <div className="flex gap-2 justify-center items-center">
              <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveName()}
                className="px-3 py-1 bg-muted border-2 border-primary text-foreground font-body text-center focus:outline-none" dir="auto" autoFocus />
              <button onClick={saveName} className="p-1 text-accent"><Save size={16} /></button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h2 className="font-pixel text-sm text-primary">{state.username}</h2>
              <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-foreground"><Edit3 size={14} /></button>
            </div>
          )}
          {profile?.avatar_url && (
            <div className="mt-3 flex justify-center">
              <PixelAvatar seed={profile.avatar_url || profile.username} size={48} frameStyle="cyber-green" />
            </div>
          )}
          <div className="max-w-xs mx-auto mt-3">
            <XPBar xp={state.xp} xpToNext={xpToNextLevel} level={state.level} />
          </div>
          <div className="flex gap-4 justify-center mt-3 text-sm font-body">
            <span className="text-secondary">🔥 {state.streak} يوم</span>
            <span className="text-accent">✅ {state.completedLessons.length} درس</span>
            <span className="text-xp">⭐ {state.totalXpEarned} XP</span>
          </div>
        </motion.div>

        {/* ─── Statistics Section ─── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="pixel-card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-pixel text-[0.6rem] text-gradient-vapor">الإحصائيات - Estadísticas</h3>
            <button onClick={shareStats} className="flex items-center gap-1.5 px-3 py-1.5 font-pixel text-[0.4rem] text-primary border-2 border-primary/40 hover:border-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all">
              <Share2 size={12} /> مشاركة
            </button>
          </div>
          <div id="stats-share-area" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { icon: '📚', value: state.completedLessons.length, label: 'دروس مكتملة', labelEs: 'Lecciones' },
              { icon: '🎮', value: state.completedGames.length, label: 'ألعاب مكتملة', labelEs: 'Juegos' },
              { icon: '📝', value: state.completedLessons.length * 8, label: 'كلمات متعلّمة', labelEs: 'Palabras' },
              { icon: '⭐', value: state.totalXpEarned, label: 'مجموع XP', labelEs: 'XP Total' },
              { icon: '🔥', value: state.streak, label: 'أيام متتالية', labelEs: 'Racha' },
              { icon: '🏆', value: state.achievements.length, label: 'إنجازات', labelEs: 'Logros' },
              { icon: '🗺️', value: state.unlockedZones.length, label: 'مناطق مفتوحة', labelEs: 'Zonas' },
              { icon: '⏱️', value: `${Math.max(1, Math.round((state.completedLessons.length * 5 + state.completedGames.length * 3)))}`, label: 'دقائق تعلّم', labelEs: 'Minutos' },
              { icon: '🎯', value: state.level, label: 'المستوى', labelEs: 'Nivel' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 + i * 0.03 }}
                className="pixel-card p-3 text-center border-primary/20 hover:border-primary/50 transition-all">
                <div className="text-xl mb-1">{stat.icon}</div>
                <p className="font-pixel text-sm text-secondary" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--secondary) / 0.4))' }}>{stat.value}</p>
                <p className="font-pixel text-[0.4rem] text-muted-foreground mt-0.5">{stat.label}</p>
                <p className="font-mono text-[0.5rem] text-primary/60">{stat.labelEs}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ─── Settings Section ─── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 className="font-pixel text-[0.6rem] text-gradient-vapor mb-4">الإعدادات - Ajustes</h3>

          {/* Avatar regeneration */}
          <div className="pixel-card-primary p-6 mb-4 text-center">
            <p className="font-pixel text-[0.5rem] text-secondary mb-4">الصورة الرمزية - Avatar</p>
            <motion.div key={avatarSeed} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
              <PixelAvatar seed={avatarSeed} size={96} frameStyle="cyber-green" />
            </motion.div>
            <button type="button" onClick={regenerateAvatar}
              className="mt-4 flex items-center gap-1.5 px-4 py-2 mx-auto text-xs font-mono text-secondary border border-secondary/30 hover:bg-secondary/10 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] transition-all uppercase tracking-wider">
              <RefreshCw size={12} /> توليد صورة جديدة
            </button>
          </div>

          {/* Username edit */}
          <div className="pixel-card p-6 mb-4">
            <label className="block font-pixel text-[0.5rem] text-foreground mb-3">اسم المعرّف - Username</label>
            <div className="relative">
              <input type="text" value={username} onChange={e => handleUsernameChange(e.target.value)} maxLength={20}
                className="w-full px-4 py-3 bg-background border-b-2 border-primary text-secondary font-mono text-sm placeholder:text-primary/40 focus:outline-none focus:border-secondary focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all" dir="ltr" />
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                {checkingUsername && <Loader2 size={14} className="animate-spin text-muted-foreground" />}
                {!checkingUsername && usernameAvailable === true && <Check size={14} className="text-accent" />}
                {!checkingUsername && usernameAvailable === false && <span className="text-destructive text-xs">✗</span>}
              </div>
            </div>
            <p className="font-mono text-[0.55rem] text-muted-foreground mt-2">3-20 حرف إنجليزي أو أرقام أو _</p>
          </div>

          {/* Theme selector */}
          <div className="pixel-card p-6 mb-4">
            <label className="block font-pixel text-[0.5rem] text-foreground mb-3">المظهر - Tema</label>
            <div className="flex flex-col gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                    theme === t.id
                      ? 'bg-primary/10 border border-primary/40'
                      : 'border border-transparent hover:bg-primary/5 hover:border-primary/20'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ background: t.accent, boxShadow: theme === t.id ? `0 0 8px ${t.glow}` : 'none' }} />
                  <span className="font-pixel text-[0.45rem] text-foreground">{t.label}</span>
                  <span className="font-body text-[0.6rem] text-muted-foreground">{t.labelAr}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error / Success */}
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-destructive font-body text-sm px-3 py-2 border border-destructive/30 bg-destructive/10 mb-4">{error}</motion.p>
          )}
          {success && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-accent font-body text-sm px-3 py-2 border border-accent/30 bg-accent/10 mb-4">{success}</motion.p>
          )}

          {/* Game-style Save Button */}
          <button onClick={handleSave} disabled={saving}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 font-pixel text-[0.65rem] uppercase tracking-widest text-primary-foreground border-2 border-primary transition-all duration-200 hover:shadow-[0_0_20px_hsl(var(--primary)/0.5),0_0_40px_hsl(var(--primary)/0.2)] active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
              boxShadow: '0 0 12px hsl(var(--primary) / 0.4), inset 0 1px 0 hsl(var(--primary-foreground) / 0.1)',
            }}
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </motion.div>

        {/* ─── Customization ─── */}
        <div className="pixel-card p-4 mb-6 mt-6">
          <h3 className="font-pixel text-[0.6rem] text-foreground mb-4">تخصيص الشخصية - Personalizar</h3>
          {[
            { label: 'لون البشرة', key: 'skinColor' as keyof CharacterConfig, colors: SKIN_COLORS },
            { label: 'لون الشعر', key: 'hairColor' as keyof CharacterConfig, colors: HAIR_COLORS },
            { label: 'لون الملابس', key: 'outfitColor' as keyof CharacterConfig, colors: OUTFIT_COLORS },
            { label: 'لون الحذاء', key: 'bootsColor' as keyof CharacterConfig, colors: BOOTS_COLORS },
          ].map(({ label, key, colors }) => (
            <div key={key} className="mb-3">
              <p className="text-muted-foreground font-body text-xs mb-1.5">{label}</p>
              <div className="flex gap-2 flex-wrap">
                {colors.map(color => (
                  <button key={color} onClick={() => handleColorChange(key, color)}
                    className={`w-7 h-7 border-2 transition-all ${state.character[key] === color ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          ))}
          <div className="mb-3">
            <p className="text-muted-foreground font-body text-xs mb-1.5">تسريحة الشعر</p>
            <div className="flex gap-2">
              {[0, 1, 2].map(style => (
                <button key={style} onClick={() => updateCharacter({ hairStyle: style })}
                  className={`px-3 py-1 font-pixel text-[0.45rem] border-2 ${state.character.hairStyle === style ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}>
                  Style {style + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* NFT Collection */}
        {nfts.length > 0 && (
          <div className="pixel-card p-4 mb-6">
            <NFTCollection nfts={nfts} title="مجموعة NFT - Colección NFT" />
          </div>
        )}

        {/* Achievements */}
        <div className="pixel-card p-4 mb-6">
          <h3 className="font-pixel text-[0.6rem] text-foreground mb-4">الإنجازات - Logros</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ACHIEVEMENTS_LIST.map(ach => {
              const unlocked = state.achievements.includes(ach.id);
              return (
                <div key={ach.id} className={`pixel-card p-3 text-center ${unlocked ? 'border-primary/50' : 'opacity-40'}`}>
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <p className="font-pixel text-[0.4rem] text-foreground">{ach.name}</p>
                  <p className="text-muted-foreground font-body text-[0.6rem]">{ach.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="text-center mb-8">
          <button onClick={() => { if (confirm('هل أنت متأكد؟ سيتم حذف كل التقدم!')) resetProgress(); }}
            className="text-destructive font-body text-xs flex items-center gap-1 mx-auto hover:underline">
            <Trash2 size={12} /> إعادة تعيين التقدم
          </button>
        </div>
      </main>
    </div>
  );
}
