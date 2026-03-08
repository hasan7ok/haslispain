import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, ArrowLeft, ArrowRight, RotateCcw, Brain, Check, ChevronRight } from 'lucide-react';
import { VocabItem } from '@/data/vocabulary';
import { detectGender, speakSpanish } from '@/components/SpanishWord';
import { usePixelSounds } from '@/hooks/usePixelSounds';

interface Props {
  vocabulary: VocabItem[];
  lessonTitle: string;
  onClose: () => void;
  onComplete: () => void;
}

type Phase = 'flashcards' | 'quiz' | 'results';

interface QuizQuestion {
  word: string;
  correctAnswer: string;
  options: string[];
}

function generateQuiz(vocab: VocabItem[], count = 3): QuizQuestion[] {
  const shuffled = [...vocab].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, vocab.length));

  return selected.map((item) => {
    const wrong = vocab
      .filter((v) => v.word !== item.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((v) => v.translationAr);

    const options = [item.translationAr, ...wrong].slice(0, 4).sort(() => Math.random() - 0.5);
    return { word: item.word, correctAnswer: item.translationAr, options };
  });
}

export default function ImmersiveFlashcard({ vocabulary, lessonTitle, onClose, onComplete }: Props) {
  const { playClick, playSuccess, playVictory } = usePixelSounds();
  const [phase, setPhase] = useState<Phase>('flashcards');
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(0);

  // Quiz state
  const quiz = useMemo(() => generateQuiz(vocabulary), [vocabulary]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const item = vocabulary[current];
  const gender = detectGender(item?.word || '');
  const progress = phase === 'flashcards'
    ? ((current + 1) / vocabulary.length) * 100
    : phase === 'quiz'
    ? ((quizIndex + 1) / quiz.length) * 100
    : 100;

  const flip = useCallback(() => {
    setFlipped((f) => !f);
    playClick();
    if (!flipped) speakSpanish(item.word);
  }, [flipped, item, playClick]);

  const goNext = useCallback(() => {
    if (current < vocabulary.length - 1) {
      setDirection(1);
      setFlipped(false);
      setCurrent((c) => c + 1);
      playClick();
    } else {
      setPhase('quiz');
      playSuccess();
    }
  }, [current, vocabulary.length, playClick, playSuccess]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1);
      setFlipped(false);
      setCurrent((c) => c - 1);
      playClick();
    }
  }, [current, playClick]);

  const handleQuizAnswer = useCallback(
    (answer: string) => {
      if (answered) return;
      setSelectedAnswer(answer);
      setAnswered(true);
      if (answer === quiz[quizIndex].correctAnswer) {
        setScore((s) => s + 1);
        playSuccess();
      } else {
        playClick();
      }
    },
    [answered, quiz, quizIndex, playSuccess, playClick]
  );

  const nextQuestion = useCallback(() => {
    if (quizIndex < quiz.length - 1) {
      setQuizIndex((i) => i + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setPhase('results');
      playVictory();
      onComplete();
    }
  }, [quizIndex, quiz.length, playVictory, onComplete]);

  const genderBorder =
    gender === 'm'
      ? 'border-gender-m/30 shadow-[0_0_40px_hsl(var(--gender-masculine)/0.15)]'
      : gender === 'f'
      ? 'border-gender-f/30 shadow-[0_0_40px_hsl(var(--gender-feminine)/0.15)]'
      : 'border-border';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50">
          <X size={20} />
        </button>
        <span className="font-pixel text-[0.5rem] text-muted-foreground">
          {phase === 'flashcards' ? `${current + 1}/${vocabulary.length}` : phase === 'quiz' ? `سؤال ${quizIndex + 1}/${quiz.length}` : 'النتائج'}
        </span>
        <div className="w-9" />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted/30">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-hidden">
        {/* FLASHCARDS PHASE */}
        {phase === 'flashcards' && (
          <>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full max-w-md"
              >
                {/* Card container with perspective */}
                <div className="relative w-full" style={{ perspective: '1200px' }}>
                  <motion.div
                    className="w-full cursor-pointer"
                    onClick={flip}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Front face */}
                    <div
                      className={`w-full min-h-[320px] rounded-2xl border-2 ${genderBorder} bg-card/80 backdrop-blur-md p-8 flex flex-col items-center justify-center`}
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <p className="font-pixel text-[0.45rem] text-muted-foreground mb-6 tracking-wider">اضغط للقلب</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); speakSpanish(item.word); }}
                        className="mb-4 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        <Volume2 size={20} />
                      </button>
                      <h2 className="font-pixel text-lg text-primary mb-3">{item.word}</h2>
                      {gender && (
                        <span className={`inline-flex items-center gap-1.5 text-[0.55rem] font-body ${gender === 'm' ? 'text-gender-m' : 'text-gender-f'}`}>
                          <span className={`w-2 h-2 rounded-full ${gender === 'm' ? 'bg-gender-m' : 'bg-gender-f'}`} />
                          {gender === 'm' ? 'Masculino' : 'Femenino'}
                        </span>
                      )}
                    </div>

                    {/* Back face */}
                    <div
                      className={`absolute inset-0 w-full min-h-[320px] rounded-2xl border-2 ${genderBorder} bg-card/80 backdrop-blur-md p-8 flex flex-col items-center justify-center`}
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      <h2 className="font-body text-2xl font-bold text-foreground mb-2">{item.translationAr}</h2>
                      <p className="text-muted-foreground font-body text-sm mb-6">{item.translation}</p>
                      <div className="w-full p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <p className="text-primary font-body text-sm">{item.example}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); speakSpanish(item.example); }}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Volume2 size={14} />
                          </button>
                        </div>
                        <p className="text-muted-foreground font-body text-xs text-center">{item.exampleTranslation}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={goPrev}
                disabled={current === 0}
                className="p-3 rounded-xl border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 transition-all"
              >
                <ArrowRight size={18} />
              </button>
              <span className="font-pixel text-[0.45rem] text-muted-foreground min-w-[60px] text-center">
                {current + 1} / {vocabulary.length}
              </span>
              <button
                onClick={goNext}
                className="p-3 rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all"
              >
                {current === vocabulary.length - 1 ? <Brain size={18} /> : <ArrowLeft size={18} />}
              </button>
            </div>
            {current === vocabulary.length - 1 && (
              <p className="font-pixel text-[0.4rem] text-primary/70 mt-2">→ انتقل للاختبار السريع</p>
            )}
          </>
        )}

        {/* QUIZ PHASE */}
        {phase === 'quiz' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={quizIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md"
            >
              <div className="text-center mb-6">
                <Brain size={28} className="mx-auto text-primary mb-3" />
                <h3 className="font-pixel text-[0.6rem] text-primary mb-1">اختبار سريع</h3>
                <p className="text-muted-foreground font-body text-xs">ما معنى هذه الكلمة؟</p>
              </div>

              <div className="rounded-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-md p-6 mb-6 text-center">
                <button
                  onClick={() => speakSpanish(quiz[quizIndex].word)}
                  className="mb-3 p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors mx-auto block"
                >
                  <Volume2 size={18} />
                </button>
                <h2 className="font-pixel text-base text-primary">{quiz[quizIndex].word}</h2>
              </div>

              <div className="space-y-3">
                {quiz[quizIndex].options.map((option, i) => {
                  const isCorrect = option === quiz[quizIndex].correctAnswer;
                  const isSelected = option === selectedAnswer;
                  let optionStyle = 'border-border/50 bg-card/50 hover:bg-muted/50 text-foreground';

                  if (answered) {
                    if (isCorrect) optionStyle = 'border-green-500/50 bg-green-500/10 text-green-400';
                    else if (isSelected && !isCorrect) optionStyle = 'border-red-500/50 bg-red-500/10 text-red-400';
                    else optionStyle = 'border-border/30 bg-card/30 text-muted-foreground opacity-50';
                  }

                  return (
                    <motion.button
                      key={i}
                      whileHover={!answered ? { scale: 1.02 } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                      onClick={() => handleQuizAnswer(option)}
                      disabled={answered}
                      className={`w-full p-4 rounded-xl border-2 ${optionStyle} font-body text-sm text-right transition-all flex items-center justify-between`}
                    >
                      <span className="font-pixel text-[0.4rem] text-muted-foreground/50">{i + 1}</span>
                      <span>{option}</span>
                    </motion.button>
                  );
                })}
              </div>

              {answered && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
                  <p className={`font-body text-sm mb-4 ${selectedAnswer === quiz[quizIndex].correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAnswer === quiz[quizIndex].correctAnswer ? '¡Correcto! 🎉' : `الإجابة الصحيحة: ${quiz[quizIndex].correctAnswer}`}
                  </p>
                  <button onClick={nextQuestion} className="pixel-btn flex items-center gap-2 mx-auto">
                    {quizIndex === quiz.length - 1 ? <><Check size={14} /> عرض النتائج</> : <>التالي <ChevronRight size={14} /></>}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md text-center">
            <div className="text-6xl mb-6">{score === quiz.length ? '🏆' : score >= 2 ? '⭐' : '💪'}</div>
            <h2 className="font-pixel text-sm text-primary mb-2">
              {score === quiz.length ? '¡Perfecto!' : score >= 2 ? '¡Muy bien!' : '¡Sigue practicando!'}
            </h2>
            <p className="text-foreground font-body mb-2">
              أجبت <span className="text-primary font-bold">{score}</span> من <span className="font-bold">{quiz.length}</span> بشكل صحيح
            </p>
            <div className="flex gap-1 justify-center my-6">
              {quiz.map((_, i) => (
                <div key={i} className={`w-8 h-2 rounded-full ${i < score ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setPhase('flashcards');
                  setCurrent(0);
                  setFlipped(false);
                  setQuizIndex(0);
                  setSelectedAnswer(null);
                  setAnswered(false);
                  setScore(0);
                }}
                className="pixel-btn-secondary flex items-center gap-2"
              >
                <RotateCcw size={14} /> إعادة
              </button>
              <button onClick={onClose} className="pixel-btn flex items-center gap-2">
                <Check size={14} /> إنهاء
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
