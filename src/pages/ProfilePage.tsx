import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState, CharacterConfig } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import PixelCharacter from '@/components/PixelCharacter';
import PixelAvatar from '@/components/PixelAvatar';
import NFTCollection, { NFTItem } from '@/components/NFTCollection';
import XPBar from '@/components/XPBar';
import Header from '@/components/Header';
import { ArrowLeft, Edit3, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const { state, updateCharacter, updateUsername, resetProgress, xpToNextLevel } = useGameState();
  const { profile, user } = useAuth();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(state.username);
  const [nfts, setNfts] = useState<NFTItem[]>([]);

  useEffect(() => {
    const loadNFTs = async () => {
      // Get all NFT collections
      const { data: collections } = await supabase
        .from('nft_collections')
        .select('*');

      // Get user's earned NFTs
      const { data: userNfts } = user
        ? await supabase
            .from('user_nfts')
            .select('nft_id, earned_at')
            .eq('user_id', user.id)
        : { data: [] };

      if (collections) {
        const earnedIds = new Set((userNfts || []).map(n => n.nft_id));
        setNfts(
          collections.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            image_seed: c.image_seed,
            rarity: c.rarity,
            category: c.category,
            frame_style: c.frame_style || 'default',
            unlock_condition: c.unlock_condition,
            earned: earnedIds.has(c.id),
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
    if (newName.trim()) {
      updateUsername(newName.trim());
      setEditingName(false);
    }
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
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                className="px-3 py-1 bg-muted border-2 border-primary text-foreground font-body text-center focus:outline-none"
                dir="auto"
                autoFocus
              />
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

        {/* Customization */}
        <div className="pixel-card p-4 mb-6">
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
                  <button
                    key={color}
                    onClick={() => handleColorChange(key, color)}
                    className={`w-7 h-7 border-2 transition-all ${
                      state.character[key] === color ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="mb-3">
            <p className="text-muted-foreground font-body text-xs mb-1.5">تسريحة الشعر</p>
            <div className="flex gap-2">
              {[0, 1, 2].map(style => (
                <button
                  key={style}
                  onClick={() => updateCharacter({ hairStyle: style })}
                  className={`px-3 py-1 font-pixel text-[0.45rem] border-2 ${
                    state.character.hairStyle === style ? 'border-primary text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
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
        <div className="text-center">
          <button
            onClick={() => { if (confirm('هل أنت متأكد؟ سيتم حذف كل التقدم!')) resetProgress(); }}
            className="text-destructive font-body text-xs flex items-center gap-1 mx-auto hover:underline"
          >
            <Trash2 size={12} /> إعادة تعيين التقدم
          </button>
        </div>
      </main>
    </div>
  );
}
