import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { WORD_HUNT_CHALLENGES } from '@/data/vocabulary';
import Header from '@/components/Header';
import { ArrowLeft, Target } from 'lucide-react';

export default function WordHuntPage() {
  const navigate = useNavigate();
  const { completeGame } = useGameState();
  const { playSuccess, playError, playVictory } = usePixelSounds();
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const challenges = WORD_HUNT_CHALLENGES.slice(0, 8);
  const current = challenges[round];

  const handleSelect = (option: string) => {
    if (result) return;
    setSelected(option);
    if (option === current.correct) {
      setResult('correct');
      setScore(s => s + 1);
      playSuccess();
    } else {
      setResult('wrong');
      playError();
    }
  };

  const nextRound = () => {
    if (round >= challenges.length - 1) {
      setGameOver(true);
      completeGame('word-hunt', score * 4 + 10);
      playVictory();
      return;
    }
    setRound(r => r + 1);
    setSelected(null);
    setResult(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-3 py-12 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="pixel-card-primary p-8">
            <div className="text-5xl mb-4 animate-victory">🎯</div>
            <h2 className="font-pixel text-sm text-primary mb-2">¡Excelente!</h2>
            <p className="text-foreground font-body mb-2">أكملت تحدي صيد الكلمات!</p>
            <p className="font-pixel text-[0.6rem] text-xp mb-1">{score}/{challenges.length} صحيح</p>
            <p className="font-pixel text-[0.5rem] text-accent mb-6">+{score * 4 + 10} XP</p>
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
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        <div className="pixel-card-primary p-4 mb-4 flex items-center gap-3">
          <Target size={20} className="text-accent" />
          <div>
            <h1 className="font-pixel text-[0.65rem] text-accent">Word Hunt</h1>
            <p className="text-muted-foreground font-body text-xs">أكمل الجملة بالكلمة الصحيحة</p>
          </div>
          <span className="font-pixel text-[0.5rem] text-muted-foreground ml-auto">{round + 1}/{challenges.length}</span>
        </div>

        {/* Score bar */}
        <div className="flex gap-1 mb-6 justify-center">
          {challenges.map((_, i) => (
            <div key={i} className={`w-3 h-3 border ${
              i < round ? (i < score ? 'bg-accent border-accent' : 'bg-destructive border-destructive') :
              i === round ? 'border-primary bg-primary/20' : 'border-border'
            }`} />
          ))}
        </div>

        {/* Sentence */}
        <div className="pixel-card-primary p-6 mb-6 text-center">
          <p className="font-pixel text-sm text-primary mb-2 leading-relaxed">
            {current.sentence.replace('___', result ? current.correct : '______')}
          </p>
          <p className="text-muted-foreground font-body text-sm">{current.sentenceAr}</p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {current.options.map(option => {
            let btnClass = 'pixel-card font-pixel text-[0.6rem] p-4 text-center transition-all cursor-pointer';
            if (result) {
              if (option === current.correct) {
                btnClass += ' border-accent bg-accent/10 text-accent';
              } else if (option === selected && result === 'wrong') {
                btnClass += ' border-destructive bg-destructive/10 text-destructive animate-pixel-shake';
              } else {
                btnClass += ' opacity-50 text-muted-foreground';
              }
            } else {
              btnClass += ' text-foreground hover:border-primary hover:bg-primary/5';
            }

            return (
              <motion.button
                key={option}
                whileHover={!result ? { scale: 1.02 } : {}}
                whileTap={!result ? { scale: 0.98 } : {}}
                onClick={() => handleSelect(option)}
                className={btnClass}
                disabled={!!result}
              >
                {option}
              </motion.button>
            );
          })}
        </div>

        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <p className={`font-pixel text-[0.6rem] mb-4 ${result === 'correct' ? 'text-accent' : 'text-destructive'}`}>
              {result === 'correct' ? '✅ ¡Correcto!' : `❌ الجواب الصحيح: ${current.correct}`}
            </p>
            <button onClick={nextRound} className="pixel-btn">
              {round >= challenges.length - 1 ? 'إنهاء' : 'التالي →'}
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
