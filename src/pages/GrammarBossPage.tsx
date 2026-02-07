import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { GRAMMAR_BOSSES } from '@/data/grammarBosses';
import Header from '@/components/Header';
import { ArrowLeft, Shield, Swords, Heart, Zap, Skull } from 'lucide-react';

export default function GrammarBossPage() {
  const { bossId } = useParams<{ bossId: string }>();
  const navigate = useNavigate();
  const { addXP, completeGame } = useGameState();

  const boss = GRAMMAR_BOSSES.find(b => b.id === bossId);

  const [currentQ, setCurrentQ] = useState(0);
  const [bossHp, setBossHp] = useState(boss?.maxHp || 100);
  const [playerHp, setPlayerHp] = useState(100);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [bossShake, setBossShake] = useState(false);
  const [showDamage, setShowDamage] = useState<{ amount: number; type: 'boss' | 'player' } | null>(null);
  const [combo, setCombo] = useState(0);

  if (!boss) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <p className="font-pixel text-primary">الزعيم غير موجود</p>
          <button onClick={() => navigate('/')} className="pixel-btn mt-4">العودة</button>
        </div>
      </div>
    );
  }

  const question = boss.questions[currentQ];

  const handleSelect = (option: string) => {
    if (result) return;
    setSelected(option);

    if (option === question.correctAnswer) {
      setResult('correct');
      const damage = question.damage + (combo * 5);
      setBossShake(true);
      setShowDamage({ amount: damage, type: 'boss' });
      setCombo(c => c + 1);
      setTimeout(() => setBossShake(false), 500);
      setTimeout(() => setShowDamage(null), 1500);

      setBossHp(prev => {
        const newHp = Math.max(0, prev - damage);
        if (newHp <= 0) {
          setTimeout(() => {
            setGameOver('win');
            addXP(boss.xpReward);
            completeGame(boss.id, boss.xpReward);
          }, 1000);
        }
        return newHp;
      });
    } else {
      setResult('wrong');
      const damage = 25;
      setShakeScreen(true);
      setShowDamage({ amount: damage, type: 'player' });
      setCombo(0);
      setTimeout(() => setShakeScreen(false), 500);
      setTimeout(() => setShowDamage(null), 1500);

      setPlayerHp(prev => {
        const newHp = Math.max(0, prev - damage);
        if (newHp <= 0) {
          setTimeout(() => setGameOver('lose'), 1000);
        }
        return newHp;
      });
    }
  };

  const nextQuestion = () => {
    if (currentQ >= boss.questions.length - 1) {
      // Ran out of questions
      if (bossHp > 0 && playerHp > 0) {
        setGameOver(bossHp < boss.maxHp / 2 ? 'win' : 'lose');
        if (bossHp < boss.maxHp / 2) {
          addXP(Math.floor(boss.xpReward / 2));
        }
      }
      return;
    }
    setCurrentQ(q => q + 1);
    setSelected(null);
    setResult(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-3 py-12 max-w-lg text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="pixel-card-primary p-8"
          >
            <motion.div
              className="text-6xl mb-4"
              animate={gameOver === 'win' ? { rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: 2, duration: 0.5 }}
            >
              {gameOver === 'win' ? '🏆' : '💀'}
            </motion.div>
            <h2 className="font-pixel text-sm text-primary mb-2">
              {gameOver === 'win' ? '¡Victoria!' : '¡Derrota!'}
            </h2>
            <p className="text-foreground font-body mb-2">
              {gameOver === 'win' ? `هزمت ${boss.nameAr}!` : `هُزمت من ${boss.nameAr}!`}
            </p>
            {gameOver === 'win' && (
              <p className="font-pixel text-[0.55rem] text-xp mb-4">+{boss.xpReward} XP</p>
            )}
            <p className="text-muted-foreground font-body text-sm mb-6">
              {gameOver === 'win' ? 'أحسنت! أتقنت هذا الموضوع!' : 'حاول مرة أخرى لتتقن القواعد!'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/boss-fights')} className="pixel-btn-secondary">الزعماء</button>
              {gameOver === 'lose' && (
                <button onClick={() => window.location.reload()} className="pixel-btn">أعد المحاولة</button>
              )}
              <button onClick={() => navigate('/')} className="pixel-btn">الخريطة</button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-background transition-transform ${shakeScreen ? 'animate-pixel-shake' : ''}`}>
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-2xl">
        <button onClick={() => navigate('/boss-fights')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        {/* Boss arena header */}
        <div className="pixel-card-primary p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-primary" />
              <span className="font-pixel text-[0.5rem] text-primary">{boss.topic}</span>
            </div>
            {combo > 1 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="font-pixel text-[0.5rem] text-secondary flex items-center gap-1"
              >
                <Zap size={12} /> COMBO x{combo}!
              </motion.span>
            )}
          </div>

          {/* Boss display */}
          <div className="text-center mb-4">
            <motion.div
              animate={bossShake ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.3 }}
              className="relative inline-block"
            >
              <span className="text-6xl">{boss.icon}</span>
              {/* Damage popup */}
              <AnimatePresence>
                {showDamage && showDamage.type === 'boss' && (
                  <motion.span
                    initial={{ opacity: 1, y: 0, scale: 1 }}
                    animate={{ opacity: 0, y: -40, scale: 1.5 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-2 right-0 font-pixel text-xs text-destructive"
                  >
                    -{showDamage.amount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <h2 className="font-pixel text-[0.6rem] text-primary mt-2">{boss.name}</h2>
            <p className="font-pixel text-[0.45rem] text-muted-foreground">{boss.nameAr}</p>
          </div>

          {/* Boss HP bar */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="font-pixel text-[0.4rem] text-destructive flex items-center gap-1">
                <Skull size={10} /> BOSS HP
              </span>
              <span className="font-pixel text-[0.4rem] text-muted-foreground">{bossHp}/{boss.maxHp}</span>
            </div>
            <div className="h-3 bg-muted border-2 border-border overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg, hsl(0, 75%, 55%), hsl(0, 75%, 45%))' }}
                initial={{ width: '100%' }}
                animate={{ width: `${(bossHp / boss.maxHp) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Player HP bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-pixel text-[0.4rem] text-accent flex items-center gap-1">
                <Heart size={10} /> YOUR HP
              </span>
              <span className="font-pixel text-[0.4rem] text-muted-foreground">{playerHp}/100</span>
            </div>
            <div className="h-3 bg-muted border-2 border-border overflow-hidden">
              <motion.div
                className="h-full"
                style={{ background: 'linear-gradient(90deg, hsl(120, 60%, 45%), hsl(120, 60%, 35%))' }}
                initial={{ width: '100%' }}
                animate={{ width: `${playerHp}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Player damage popup */}
          <AnimatePresence>
            {showDamage && showDamage.type === 'player' && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0, scale: 1.5 }}
                className="text-center font-pixel text-xs text-destructive mt-2"
              >
                -{showDamage.amount} HP!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="pixel-card p-6 mb-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Swords size={16} className="text-secondary" />
                <span className="font-pixel text-[0.45rem] text-muted-foreground">سؤال {currentQ + 1}/{boss.questions.length}</span>
              </div>
              <p className="text-primary font-pixel text-xs mb-2 leading-relaxed" dir="ltr">{question.questionEs}</p>
              <p className="text-foreground font-body text-sm">{question.questionAr}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {question.options.map(option => {
                let cls = 'pixel-card p-4 text-center font-body text-sm transition-all cursor-pointer';
                if (result) {
                  if (option === question.correctAnswer) {
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
                    whileHover={!result ? { scale: 1.03 } : {}}
                    whileTap={!result ? { scale: 0.97 } : {}}
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
                  {result === 'correct' ? '⚔️ ¡Golpe crítico!' : '💔 ¡El boss te atacó!'}
                </p>
                <p className="text-foreground font-body text-sm">{question.explanationAr}</p>
                <p className="text-muted-foreground font-body text-xs mt-1" dir="ltr">{question.explanationEs}</p>
              </motion.div>
            )}

            {result && gameOver === null && (
              <div className="text-center">
                <button onClick={nextQuestion} className="pixel-btn flex items-center gap-2 mx-auto">
                  <Swords size={14} /> الهجوم التالي
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
