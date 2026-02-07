import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GRAMMAR_BOSSES } from '@/data/grammarBosses';
import { useGameState } from '@/hooks/useGameState';
import Header from '@/components/Header';
import { ArrowLeft, Swords, Skull, ChevronRight, Lock } from 'lucide-react';

export default function BossFightsListPage() {
  const navigate = useNavigate();
  const { state } = useGameState();

  const getBossRequiredLevel = (boss: typeof GRAMMAR_BOSSES[0]) => {
    if (boss.level.includes('A1')) return 1;
    if (boss.level.includes('A2')) return 3;
    if (boss.level.includes('B1')) return 5;
    if (boss.level.includes('B2')) return 8;
    return 1;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-2xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة للخريطة
        </button>

        <div className="pixel-card-primary p-6 mb-6 text-center">
          <Swords size={28} className="text-destructive mx-auto mb-3" />
          <h1 className="font-pixel text-sm text-primary mb-1">معارك الزعماء</h1>
          <p className="font-pixel text-[0.5rem] text-muted-foreground">Grammar Boss Fights</p>
          <p className="text-foreground font-body text-sm mt-2">واجه قواعد اللغة في معارك RPG ملحمية!</p>
        </div>

        <div className="space-y-3">
          {GRAMMAR_BOSSES.map((boss, idx) => {
            const requiredLevel = getBossRequiredLevel(boss);
            const isUnlocked = state.level >= requiredLevel;
            const isDefeated = state.completedGames.includes(boss.id);

            return (
              <motion.div
                key={boss.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <button
                  onClick={() => isUnlocked && navigate(`/boss/${boss.id}`)}
                  disabled={!isUnlocked}
                  className={`w-full pixel-card p-4 flex items-center gap-4 transition-all group ${
                    isUnlocked
                      ? 'hover:border-destructive hover:translate-y-[-1px]'
                      : 'opacity-50 cursor-not-allowed'
                  } ${isDefeated ? 'border-accent/50' : ''}`}
                >
                  <div className="relative">
                    <span className="text-4xl">{boss.icon}</span>
                    {!isUnlocked && (
                      <Lock size={16} className="absolute -top-1 -right-1 text-muted-foreground" />
                    )}
                    {isDefeated && (
                      <span className="absolute -bottom-1 -right-1 text-accent text-sm">✓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-right">
                    <h3 className="font-pixel text-[0.55rem] text-primary">{boss.name}</h3>
                    <p className="text-foreground font-body text-sm mt-0.5">{boss.nameAr}</p>
                    <p className="text-muted-foreground font-body text-xs mt-1">{boss.descriptionAr}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-pixel text-[0.4rem] text-muted-foreground border border-border px-2 py-0.5">{boss.level}</span>
                      <span className="font-pixel text-[0.4rem] text-destructive flex items-center gap-0.5"><Skull size={10} /> HP: {boss.maxHp}</span>
                      <span className="font-pixel text-[0.4rem] text-xp">+{boss.xpReward} XP</span>
                    </div>
                  </div>
                  {isUnlocked && <ChevronRight size={14} className="text-muted-foreground group-hover:text-destructive" />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
