import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';

const ALL_ACHIEVEMENTS = [
  { id: 'firstGame', name: 'اللاعب الأول', nameEs: 'Primer Jugador', icon: '🎮', desc: 'أكمل أول لعبة' },
  { id: 'lessons5', name: 'طالب مجتهد', nameEs: 'Estudiante Dedicado', icon: '📚', desc: 'أكمل 5 دروس' },
  { id: 'lessons10', name: 'باحث عن المعرفة', nameEs: 'Buscador de Saber', icon: '🎓', desc: 'أكمل 10 دروس' },
  { id: 'level5', name: 'المستكشف', nameEs: 'Explorador', icon: '🗺️', desc: 'وصل للمستوى 5' },
  { id: 'level10', name: 'البطل', nameEs: 'Héroe', icon: '⚔️', desc: 'وصل للمستوى 10' },
  { id: 'xp500', name: 'جامع الخبرة', nameEs: 'Experto', icon: '✨', desc: 'اجمع 500 XP إجمالي' },
  { id: 'xp1000', name: 'الأسطورة', nameEs: 'Leyenda', icon: '👑', desc: 'اجمع 1000 XP إجمالي' },
];

export default function AchievementsPage() {
  const navigate = useNavigate();
  const { state } = useGameState();
  const unlockedCount = state.achievements.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-2xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        <div className="pixel-card-primary p-6 mb-6 text-center">
          <h1 className="font-pixel text-sm text-primary mb-2">🏆 الإنجازات - Logros</h1>
          <p className="font-pixel text-[0.5rem] text-xp">{unlockedCount} / {ALL_ACHIEVEMENTS.length} مفتوح</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ALL_ACHIEVEMENTS.map((ach, idx) => {
            const unlocked = state.achievements.includes(ach.id);
            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`pixel-card p-4 flex items-center gap-3 ${
                  unlocked ? 'border-primary/50 zone-glow-gold' : 'opacity-40'
                }`}
              >
                <span className="text-3xl">{ach.icon}</span>
                <div>
                  <h3 className="font-pixel text-[0.5rem] text-foreground">{ach.name}</h3>
                  <p className="font-pixel text-[0.4rem] text-muted-foreground">{ach.nameEs}</p>
                  <p className="text-muted-foreground font-body text-xs mt-0.5">{ach.desc}</p>
                </div>
                {unlocked && <span className="ml-auto text-accent">✓</span>}
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
