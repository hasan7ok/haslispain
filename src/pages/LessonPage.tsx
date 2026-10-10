import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { LESSONS } from '@/data/vocabulary';
import Header from '@/components/Header';
import SpanishWord from '@/components/SpanishWord';
import SpanishAudio from '@/components/SpanishAudio';
import { Button } from '@/components/ui/button';
import { useLearningTools } from '@/hooks/useLearningTools';
import { localDay, recordDailyLesson, toggleItem } from '@/lib/learningTools';
import { Bookmark, Star } from 'lucide-react';
import { ZONES } from '@/data/zones';
import { ArrowLeft, ArrowRight, Check, Lightbulb, RotateCcw, Volume2 } from 'lucide-react';


export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { state, completeLesson } = useGameState();
  const { playClick, playSuccess, playVictory } = usePixelSounds();
  const [currentCard, setCurrentCard] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { tools, updateTools, ready } = useLearningTools();
  const [slow, setSlow] = useState(false);
  const restored = useRef(false);
  useEffect(() => {
    if (!ready || restored.current || !lessonId) return;
    restored.current = true;
    const saved = tools.resume;
    if (saved?.lessonId === lessonId) setCurrentCard(Math.min(saved.card, Math.max(0, (LESSONS[lessonId]?.vocabulary.length || 1) - 1)));
  }, [ready, lessonId, tools.resume]);
  useEffect(() => {
    if (!ready || !restored.current || !lessonId || !LESSONS[lessonId] || completed) return;
    updateTools(previous => ({ ...previous, resume: { lessonId, card: currentCard } }));
  }, [currentCard, lessonId, ready, completed, updateTools]);

  const lesson = lessonId ? LESSONS[lessonId] : undefined;
  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <p className="font-pixel text-primary">الدرس غير موجود</p>
          <button onClick={() => navigate('/')} className="pixel-btn mt-4">العودة</button>
        </div>
      </div>
    );
  }

  const vocab = lesson.vocabulary;
  const isAlreadyCompleted = state.completedLessons.includes(lesson.id);
  const zoneId = ZONES.find(zone => zone.lessons.some(item => item.id === lesson.id))?.id || 'pueblo';

  const handleComplete = () => {
    updateTools(previous => ({ ...recordDailyLesson(previous, lesson.id, localDay()), resume: null }));
    setCompleted(true);
    playVictory();
    if (!isAlreadyCompleted) {
      const zone = lesson.id.split('-')[0];
      const xp = zone === 'pueblo' ? 25 : zone === 'ciudad' ? 35 : 40;
      completeLesson(lesson.id, xp);
    }
  };

  const nextCard = () => {
    setShowTranslation(false);
    if (currentCard < vocab.length - 1) {
      playClick();
      setCurrentCard(c => c + 1);
    } else {
      handleComplete();
    }
  };

  const prevCard = () => {
    setShowTranslation(false);
    if (currentCard > 0) setCurrentCard(c => c - 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl" dir="rtl">
        <button onClick={() => navigate(`/zone/${zoneId}`)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>




        <div className="mb-6 flex items-center justify-between gap-3"><p className="text-xs text-primary">LECCIÓN · الدرس</p><Button variant="ghost" size="icon" title="حفظ الدرس في المفضّلة" aria-label="حفظ الدرس في المفضّلة" aria-pressed={tools.bookmarks.includes(lesson.id)} onClick={() => updateTools(previous => ({ ...previous, bookmarks: toggleItem(previous.bookmarks, lesson.id) }))}><Bookmark className={tools.bookmarks.includes(lesson.id) ? 'fill-primary text-primary' : ''} /></Button></div>
        <div className="border-b border-border pb-6 mb-6">
          <p className="text-foreground font-body text-sm">{lesson.introAr}</p>
          {lesson.tipAr && (
            <div className="mt-3 p-3 bg-primary/5 border-2 border-primary/20 flex gap-2">
              <Lightbulb size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <p className="text-foreground font-body text-xs">{lesson.tipAr}</p>
            </div>
          )}
        </div>

        <div className="mb-7 space-y-3"><SpanishAudio texts={vocab.flatMap(item => [item.word, item.example])} id={`lesson-${lesson.id}`} rate={slow ? 0.55 : 0.85} /><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">النطق الإسباني · Español</span><div className="flex gap-1" role="group" aria-label="سرعة النطق"><Button size="sm" variant={!slow ? 'default' : 'ghost'} aria-pressed={!slow} onClick={() => setSlow(false)}>عادي</Button><Button size="sm" variant={slow ? 'default' : 'ghost'} aria-pressed={slow} onClick={() => setSlow(true)}>بطيء</Button></div></div></div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <span className="font-pixel text-[0.5rem] text-muted-foreground">{currentCard + 1} / {vocab.length}</span>
          <div className="flex gap-1">
            {vocab.map((_, i) => (
              <div key={i} className={`w-2 h-2 ${i <= currentCard ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        {completed ? (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="pixel-card-primary p-8 text-center">
            <div className="text-5xl mb-4 animate-victory">🎉</div>
            <h2 className="font-pixel text-sm text-primary mb-2">¡Muy bien!</h2>
            <p className="text-foreground font-body mb-2">أكملت الدرس بنجاح!</p>
            {!isAlreadyCompleted && <p className="font-pixel text-[0.5rem] text-xp mb-6">+XP مكتسبة!</p>}
            <div className="flex gap-3 justify-center">
              <button onClick={() => { setCompleted(false); setCurrentCard(0); setShowTranslation(false); }} className="pixel-btn-secondary flex items-center gap-1">
                <RotateCcw size={12} /> إعادة
              </button>
              <button onClick={() => navigate(`/zone/${zoneId}`)} className="pixel-btn">التالي ←</button>
            </div>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCard}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="rounded-md border border-border bg-card/40 p-5 sm:p-8 min-h-[300px] flex flex-col items-center justify-center"
            >
              <div className="mb-5 flex w-full justify-end"><Button variant="ghost" size="icon" title="حفظ المفردة" aria-label="حفظ المفردة" aria-pressed={tools.words.includes(vocab[currentCard].word)} onClick={() => updateTools(previous => ({ ...previous, words: toggleItem(previous.words, vocab[currentCard].word) }))}><Star className={tools.words.includes(vocab[currentCard].word) ? 'fill-accent text-accent' : 'text-muted-foreground'} /></Button></div>
              <SpanishWord word={vocab[currentCard].word} size="lg" className="font-heading text-primary mb-2 max-w-full text-center" />
              <Button variant="ghost" className="mt-3" onClick={() => { playSuccess(); setShowTranslation(value => !value); }}>{showTranslation ? 'إخفاء المعنى' : 'كشف المعنى'}</Button>

              {showTranslation && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-3">
                  <p className="text-foreground font-body text-lg font-bold mb-1">{vocab[currentCard].translationAr}</p>
                  <p className="text-muted-foreground font-body text-sm mb-4">{vocab[currentCard].translation}</p>
                  <div className="p-3 bg-muted/50 border border-border mt-2">
                    <div className="flex items-center justify-center gap-2">
                      <p dir="ltr" className="text-primary font-body text-sm font-medium">{vocab[currentCard].example}</p>
                      <SpanishAudio compact texts={[vocab[currentCard].example]} id={`example-${lesson.id}-${currentCard}`} rate={slow ? 0.55 : 0.85} label="نطق المثال" />
                    </div>
                    <p dir="ltr" className="text-muted-foreground font-body text-xs mt-1">{vocab[currentCard].exampleTranslation}</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {!completed && (
          <div className="flex justify-between mt-4">
            <Button onClick={prevCard} disabled={currentCard === 0} variant="outline">
              <ArrowRight size={12} /> السابق
            </Button>
            <Button onClick={nextCard}>
              {currentCard === vocab.length - 1 ? (
                <><Check size={12} /> إنهاء</>
              ) : (
                <>التالي <ArrowLeft size={12} /></>
              )}
            </Button>
          </div>
        )}

        {/* Gender legend */}
        {!completed && (
          <div className="flex items-center justify-center gap-4 mt-4 opacity-50">
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-body text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-gender-m" /> مذكر (Masculino)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-body text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-gender-f" /> مؤنث (Femenino)
            </span>
          </div>
        )}
      </main>
    </div>
  );
}
