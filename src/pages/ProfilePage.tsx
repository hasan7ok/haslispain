import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import PixelAvatar from '@/components/PixelAvatar';
import NFTCollection, { NFTItem } from '@/components/NFTCollection';
import Header from '@/components/Header';
import { ArrowLeft, Save, Trash2, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { BookOpen, FileText, Flame, Trophy } from 'lucide-react';
import { LESSONS } from '@/data/vocabulary';
import { ZONES } from '@/data/zones';
import ProfileLearningPanel from '@/components/ProfileLearningPanel';
import ProfileJournals from '@/components/ProfileJournals';

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
  const { state, updateUsername, resetProgress, xpToNextLevel } = useGameState();
  const { profile, user, updateProfile, checkUsernameAvailable, refreshProfile } = useAuth();

  const [nfts, setNfts] = useState<NFTItem[]>([]);

  // Settings state
  const [username, setUsername] = useState(profile?.username || '');
  useEffect(() => { if (profile) { setUsername(profile.username); setAvatarSeed(profile.avatar_url || profile.username); } }, [profile?.username, profile?.avatar_url]);
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

  const progress = Math.min(state.xp / xpToNextLevel, 1);
  const learnedWords = new Set(state.completedLessons.flatMap(id => LESSONS[id]?.vocabulary.map(word => word.word) || [])).size;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-12 pt-24" dir="rtl">
        <Button variant="ghost" className="mb-6 px-0 text-muted-foreground" onClick={() => navigate('/')}><ArrowLeft />العودة للخريطة</Button>
        <section className="border-b border-border pb-10">
          <p className="mb-6 text-xs text-primary">MI PERFIL · ملفّي الشخصي</p>
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <PixelAvatar seed={profile?.avatar_url || profile?.username || state.username} size={112} frameStyle="cyber-green" />
            <div className="min-w-0 flex-1"><h1 dir="auto" className="break-words font-heading text-3xl font-semibold sm:text-4xl">{profile?.username || state.username}</h1><p className="mt-2 text-sm text-muted-foreground">رحلتي في اللغة الإسبانية · Mi viaje</p>
              <div className="mt-6 flex items-center justify-between gap-4 text-sm"><span>المستوى {state.level}</span><span dir="ltr" className="text-primary">{state.xp} / {xpToNextLevel} XP</span></div>
              <div role="progressbar" aria-label="تقدم المستوى" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100} className="mt-3 h-2 overflow-hidden rounded-sm bg-muted"><div className="h-full origin-right bg-primary" style={{ transform: `scaleX(${progress})` }} /></div>
              <p className="mt-2 text-xs text-muted-foreground">{Math.max(0, xpToNextLevel - state.xp)} نقطة للمستوى التالي</p>
            </div>
          </div>
        </section>
        <section id="stats-share-area" className="border-b border-border py-8">
          <div className="mb-5 flex items-center justify-between"><h2 className="font-heading text-xl font-semibold">لمحة عن تقدّمي</h2><Button variant="ghost" size="icon" title="مشاركة الإحصائيات" aria-label="مشاركة الإحصائيات" onClick={shareStats}><Share2 /></Button></div>
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">{[
            { value: state.completedLessons.length, label: 'دروس مكتملة', icon: BookOpen },
            { value: learnedWords, label: 'مفردات الدروس المكتملة', icon: FileText },
            { value: state.streak, label: 'أيام متتالية', icon: Flame },
            { value: state.totalXpEarned, label: 'إجمالي نقاط الخبرة', icon: Trophy },
          ].map(stat => <div key={stat.label} className="border-r border-border px-4"><stat.icon className="mb-3 size-4 text-accent" /><p className="font-heading text-3xl font-semibold">{stat.value}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{stat.label}</p></div>)}</div>
        </section>
        <section className="border-b border-border py-10"><div className="mb-6 flex items-center justify-between"><h2 className="font-heading text-2xl font-semibold">تقدّم المناطق</h2><span className="text-xs text-muted-foreground">{state.unlockedZones.length} / {ZONES.length}</span></div>
          <div className="space-y-5">{ZONES.map(zone => { const count = zone.lessons.filter(lesson => state.completedLessons.includes(lesson.id)).length; return <div key={zone.id} className="flex items-center gap-4"><span dir="ltr" className="w-16 shrink-0 text-xs text-accent">{zone.level}</span><div className="min-w-0 flex-1"><div className="mb-2 flex items-center justify-between text-sm"><span>{zone.nameEs}</span><span className="text-xs text-muted-foreground">{count} / {zone.lessons.length}</span></div><div className="h-1.5 overflow-hidden bg-muted"><div className="h-full origin-right bg-primary" style={{ transform: `scaleX(${count / zone.lessons.length})` }} /></div></div></div>; })}</div>
        </section>
        <ProfileLearningPanel />
        <ProfileJournals userId={user?.id} />
        <section className="border-b border-border py-10"><h2 className="mb-6 font-heading text-2xl font-semibold">إعدادات الحساب</h2><div className="grid gap-8 sm:grid-cols-2">
          <div><h3 className="mb-4 text-sm font-semibold">صورة الحساب</h3><div className="flex gap-5">{['portrait-man', 'portrait-woman'].map(seed => <Button key={seed} variant="ghost" className={`h-auto rounded-full p-1 ${avatarSeed === seed ? 'ring-2 ring-primary' : ''}`} aria-label={seed === 'portrait-man' ? 'اختيار صورة الرجل' : 'اختيار صورة المرأة'} aria-pressed={avatarSeed === seed} onClick={() => setAvatarSeed(seed)}><PixelAvatar seed={seed} size={76} /></Button>)}</div><p className="mt-3 text-xs text-muted-foreground">{avatarSeed !== profile?.avatar_url ? 'احفظ لتطبيق الصورة الجديدة' : 'صورة الحساب الحالية'}</p></div>
          <div><label htmlFor="profile-username" className="mb-3 block text-sm font-semibold">اسم المستخدم</label><input id="profile-username" value={username} onChange={event => handleUsernameChange(event.target.value)} maxLength={20} dir="ltr" className="h-12 w-full rounded-md border border-input bg-card/40 px-4 font-body text-base" /><div className="mt-2 min-h-6 text-xs text-muted-foreground">{checkingUsername ? 'جارٍ التحقق…' : usernameAvailable === false ? 'اسم المستخدم غير متاح' : '3–20 حرف إنجليزي أو أرقام أو _'}</div></div>
        </div>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}{success && <p role="status" className="mt-4 text-sm text-primary">{success}</p>}<Button className="mt-6 w-full sm:w-auto" disabled={saving || checkingUsername} onClick={handleSave}><Save />{saving ? 'جارٍ الحفظ…' : 'حفظ التغييرات'}</Button></section>
        {nfts.length > 0 && <section className="border-b border-border py-10"><NFTCollection nfts={nfts} title="مكافآتي · Mis recompensas" /></section>}
        <section className="py-10"><h2 className="mb-6 font-heading text-2xl font-semibold">إنجازاتي</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{ACHIEVEMENTS_LIST.map(achievement => <div key={achievement.id} className={`rounded-md border border-border p-4 ${state.achievements.includes(achievement.id) ? 'bg-card/40' : 'opacity-50'}`}><Trophy className={`mb-3 size-5 ${state.achievements.includes(achievement.id) ? 'text-accent' : 'text-muted-foreground'}`} /><p className="font-semibold">{achievement.name}</p><p className="mt-2 text-xs leading-6 text-muted-foreground">{achievement.desc}</p></div>)}</div></section>
        <Button variant="ghost" className="text-destructive" onClick={() => { if (confirm('هل أنت متأكد؟ سيتم حذف كل التقدم!')) resetProgress(); }}><Trash2 />إعادة تعيين التقدم</Button>
      </main>
    </div>
  );
}
