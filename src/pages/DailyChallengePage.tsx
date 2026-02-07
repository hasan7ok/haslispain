import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { getDailyChallenge } from '@/data/dailyChallenges';
import Header from '@/components/Header';
import { ArrowLeft, Flame, Check, X, Trophy } from 'lucide-react';

export default function DailyChallengePage() {
  const navigate = useNavigate();
  const { addXP } = useGameState();
  const challenges = getDailyChallenge();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [completed, setCompleted] = useState(false);

  const current = challenges[currentIdx];

  const handleSelect = (option: string) => {
    if (result) return;
    setSelected(option);
    if (option === current.correctAnswer) {
      setResult('correct');
      setScore(s => s + 1);
      setTotalXP(xp => xp + current.xpReward);
      addXP(current.xpReward);
    } else {
      setResult('wrong');
    }
  };

  const nextChallenge = () => {
    if (currentIdx >= challenges.length - 1) {
      setCompleted(true);
      return;
    }
    setCurrentIdx(i => i + 1);
    setSelected(null);
    setResult(null);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-3 py-12 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="pixel-card-primary p-8">
            <div className="text-5xl mb-4 animate-victory">
              {score === challenges.length ? '🏆' : score > 0 ? '⭐' : '💪'}
            </div>
            <h2 className="font-pixel text-sm text-primary mb-2">
              {score === challenges.length ? '¡Perfecto!' : '¡Buen trabajo!'}
            </h2>
            <p className="text-foreground font-body mb-2">أكملت التحديات اليومية!</p>
            <p className="font-pixel text-[0.6rem] text-xp mb-1">{score}/{challenges.length} صحيح</p>
            <p className="font-pixel text-[0.5rem] text-accent mb-6">+{totalXP} XP</p>
            <button onClick={() => navigate('/')} className="pixel-btn">العودة للخريطة</button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-2xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        <div className="pixel-card-primary p-4 mb-6 flex items-center gap-3">
          <Flame size={24} className="text-secondary" />
          <div>
            <h1 className="font-pixel text-[0.65rem] text-secondary">التحدي اليومي</h1>
            <p className="font-pixel text-[0.45rem] text-muted-foreground">Desafío Diario</p>
          </div>
          <span className="font-pixel text-[0.5rem] text-muted-foreground ml-auto">{currentIdx + 1}/{challenges.length}</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-6">
          {challenges.map((_, i) => (
            <div key={i} className={`w-4 h-4 border-2 flex items-center justify-center ${
              i < currentIdx ? (i < score ? 'bg-accent border-accent' : 'bg-destructive border-destructive') :
              i === currentIdx ? 'border-primary' : 'border-border'
            }`}>
              {i < currentIdx && (i < score ? <Check size={10} className="text-accent-foreground" /> : <X size={10} className="text-destructive-foreground" />)}
            </div>
          ))}
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="pixel-card p-6 mb-4 text-center">
              <span className="font-pixel text-[0.4rem] text-muted-foreground border border-border px-2 py-0.5 inline-block mb-3">{current.level}</span>
              <p className="text-foreground font-body text-lg font-bold mb-2">{current.questionAr}</p>
              <p className="text-primary font-body text-sm" dir="ltr">{current.questionEs}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {current.options?.map(option => {
                let cls = 'pixel-card p-4 text-center font-body text-sm transition-all cursor-pointer';
                if (result) {
                  if (option === current.correctAnswer) {
                    cls += ' border-accent bg-accent/10 text-accent';
                  } else if (option === selected && result === 'wrong') {
                    cls += ' border-destructive bg-destructive/10 text-destructive animate-pixel-shake';
                  } else {
                    cls += ' opacity-40 text-muted-foreground';
                  }
                } else {
                  cls += ' text-foreground hover:border-primary hover:bg-primary/5';
                }
                return (
                  <motion.button
                    key={option}
                    whileHover={!result ? { scale: 1.02 } : {}}
                    whileTap={!result ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(option)}
                    className={cls}
                    disabled={!!result}
                  >
                    {option}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`pixel-card p-4 mb-4 border-2 ${
                  result === 'correct' ? 'border-accent bg-accent/5' : 'border-destructive bg-destructive/5'
                }`}
              >
                <p className={`font-pixel text-[0.55rem] mb-2 ${result === 'correct' ? 'text-accent' : 'text-destructive'}`}>
                  {result === 'correct' ? '✅ ¡Correcto!' : '❌ ¡Incorrecto!'}
                </p>
                <p className="text-foreground font-body text-sm">{current.explanationAr}</p>
                <p className="text-muted-foreground font-body text-xs mt-1" dir="ltr">{current.explanation}</p>
              </motion.div>
            )}

            {result && (
              <div className="text-center">
                <button onClick={nextChallenge} className="pixel-btn">
                  {currentIdx >= challenges.length - 1 ? 'إنهاء التحديات' : 'التالي →'}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
