import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { SENTENCE_CHALLENGES } from '@/data/vocabulary';
import Header from '@/components/Header';
import { ArrowLeft, RotateCcw, Swords } from 'lucide-react';

export default function SentenceForgePage() {
  const navigate = useNavigate();
  const { completeGame } = useGameState();
  const { playSuccess, playError, playVictory } = usePixelSounds();
  const [round, setRound] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>(() =>
    [...SENTENCE_CHALLENGES[0].words].sort(() => Math.random() - 0.5)
  );
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const challenges = SENTENCE_CHALLENGES.slice(0, 8);
  const current = challenges[round];

  const selectWord = useCallback((word: string) => {
    if (result) return;
    setSelectedWords(prev => [...prev, word]);
    setAvailableWords(prev => {
      const idx = prev.indexOf(word);
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  }, [result]);

  const removeWord = useCallback((idx: number) => {
    if (result) return;
    const word = selectedWords[idx];
    setSelectedWords(prev => [...prev.slice(0, idx), ...prev.slice(idx + 1)]);
    setAvailableWords(prev => [...prev, word]);
  }, [selectedWords, result]);

  const checkAnswer = () => {
    const answer = selectedWords.join(' ');
    if (answer === current.targetSentence) {
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
      completeGame('sentence-forge', score * 5 + 10);
      playVictory();
      return;
    }
    const next = round + 1;
    setRound(next);
    setSelectedWords([]);
    setAvailableWords([...challenges[next].words].sort(() => Math.random() - 0.5));
    setResult(null);
  };

  const resetRound = () => {
    setSelectedWords([]);
    setAvailableWords([...current.words].sort(() => Math.random() - 0.5));
    setResult(null);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-3 py-12 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="pixel-card-primary p-8">
            <div className="text-5xl mb-4 animate-victory">⚔️</div>
            <h2 className="font-pixel text-sm text-primary mb-2">¡Victoria!</h2>
            <p className="text-foreground font-body mb-2">أكملت تحدي تركيب الجمل!</p>
            <p className="font-pixel text-[0.6rem] text-xp mb-1">{score}/{challenges.length} صحيح</p>
            <p className="font-pixel text-[0.5rem] text-accent mb-6">+{score * 5 + 10} XP</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/')} className="pixel-btn">العودة للخريطة</button>
            </div>
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
          <Swords size={20} className="text-secondary" />
          <div>
            <h1 className="font-pixel text-[0.65rem] text-secondary">Sentence Forge</h1>
            <p className="text-muted-foreground font-body text-xs">رتب الكلمات لتكوين الجملة الصحيحة</p>
          </div>
          <span className="font-pixel text-[0.5rem] text-muted-foreground ml-auto">{round + 1}/{challenges.length}</span>
        </div>

        {/* Translation hint */}
        <div className="pixel-card p-4 mb-4 text-center">
          <p className="text-muted-foreground font-body text-xs mb-1">ترجم هذه الجملة:</p>
          <p className="text-foreground font-body text-lg font-bold">{current.translationAr}</p>
          <p className="text-muted-foreground font-body text-sm">({current.translation})</p>
        </div>

        {/* Selected words area */}
        <div className="pixel-card min-h-[60px] p-3 mb-4 flex flex-wrap gap-2 items-center justify-center">
          <AnimatePresence>
            {selectedWords.length === 0 ? (
              <p className="text-muted-foreground font-body text-xs">اضغط على الكلمات أدناه لترتيبها</p>
            ) : (
              selectedWords.map((word, idx) => (
                <motion.button
                  key={`selected-${idx}-${word}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  onClick={() => removeWord(idx)}
                  className={`px-3 py-2 font-pixel text-[0.55rem] border-2 transition-colors ${
                    result === 'correct' ? 'border-accent bg-accent/10 text-accent' :
                    result === 'wrong' ? 'border-destructive bg-destructive/10 text-destructive' :
                    'border-primary bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {word}
                </motion.button>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Available words */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {availableWords.map((word, idx) => (
            <motion.button
              key={`avail-${idx}-${word}`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => selectWord(word)}
              className="px-4 py-2 pixel-card font-pixel text-[0.55rem] text-foreground hover:border-primary transition-colors"
            >
              {word}
            </motion.button>
          ))}
        </div>

        {/* Result / Actions */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
            {result === 'correct' ? (
              <p className="font-pixel text-[0.65rem] text-accent">✅ ¡Correcto! صحيح!</p>
            ) : (
              <div>
                <p className="font-pixel text-[0.65rem] text-destructive mb-1">❌ ¡Incorrecto!</p>
                <p className="text-muted-foreground font-body text-sm">الجواب: {current.targetSentence}</p>
              </div>
            )}
          </motion.div>
        )}

        <div className="flex justify-center gap-3">
          {!result ? (
            <>
              <button onClick={resetRound} className="pixel-btn-secondary flex items-center gap-1">
                <RotateCcw size={12} /> إعادة
              </button>
              <button
                onClick={checkAnswer}
                disabled={selectedWords.length !== current.words.length}
                className="pixel-btn disabled:opacity-50"
              >
                تحقق ✓
              </button>
            </>
          ) : (
            <button onClick={nextRound} className="pixel-btn">
              {round >= challenges.length - 1 ? 'إنهاء اللعبة' : 'التالي →'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
