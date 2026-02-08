import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { STORIES, StoryChoice } from '@/data/stories';
import Header from '@/components/Header';
import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function StoryPage() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { addXP } = useGameState();
  const { playSuccess, playError, playVictory } = usePixelSounds();
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const story = STORIES.find(s => s.id === storyId);
  if (!story) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <p className="font-pixel text-primary">القصة غير موجودة</p>
          <button onClick={() => navigate('/')} className="pixel-btn mt-4">العودة</button>
        </div>
      </div>
    );
  }

  const currentNode = story.nodes.find(n => n.id === currentNodeId);
  if (!currentNode) return null;

  const handleChoice = (choice: StoryChoice) => {
    // Show feedback
    if (choice.feedbackAr) {
      const isCorrect = choice.isCorrect !== false;
      setFeedback({
        text: choice.feedbackAr,
        isCorrect,
      });
      if (isCorrect) {
        playSuccess();
      } else {
        playError();
      }
    }

    setTimeout(() => {
      setFeedback(null);
      const nextNode = story.nodes.find(n => n.id === choice.nextId);
      setCurrentNodeId(choice.nextId);

      if (nextNode?.isEnd && nextNode.xpReward) {
        setXpEarned(nextNode.xpReward);
        addXP(nextNode.xpReward);
        setCompleted(true);
        playVictory();
      }
    }, choice.feedbackAr ? 2000 : 500);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-3 py-12 max-w-lg text-center">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="pixel-card-primary p-8">
            <div className="text-5xl mb-4 animate-victory">📖</div>
            <h2 className="font-pixel text-sm text-primary mb-2">¡Historia completada!</h2>
            <p className="text-foreground font-body mb-2">أكملت القصة بنجاح!</p>
            <p className="font-pixel text-[0.55rem] text-xp mb-6">+{xpEarned} XP</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/stories')} className="pixel-btn-secondary">القصص</button>
              <button onClick={() => navigate('/')} className="pixel-btn">الخريطة</button>
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
        <button onClick={() => navigate('/stories')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة للقصص
        </button>

        <div className="pixel-card-primary p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">{story.icon}</span>
          <div>
            <h1 className="font-pixel text-[0.65rem] text-primary">{story.title}</h1>
            <p className="text-muted-foreground font-body text-xs">{story.titleAr}</p>
          </div>
          <span className="font-pixel text-[0.4rem] text-muted-foreground border border-border px-2 py-0.5 ml-auto">{story.level}</span>
        </div>

        {/* Dialogue */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pixel-card p-6 mb-4"
          >
            {/* Speaker */}
            {currentNode.speaker && (
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                <span className="text-2xl">{currentNode.speakerIcon}</span>
                <span className="font-pixel text-[0.55rem] text-primary">{currentNode.speaker}</span>
              </div>
            )}

            {/* Text */}
            <p className="text-primary font-body text-base font-medium mb-2 leading-relaxed" dir="ltr">
              {currentNode.textEs}
            </p>
            <p className="text-foreground font-body text-sm leading-relaxed">
              {currentNode.textAr}
            </p>

            {/* End node */}
            {currentNode.isEnd && (
              <div className="mt-4 p-3 bg-accent/10 border border-accent/30 text-center">
                <p className="font-pixel text-[0.5rem] text-accent">🎉 نهاية القصة!</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`pixel-card p-4 mb-4 border-2 ${
                feedback.isCorrect ? 'border-accent bg-accent/5' : 'border-secondary bg-secondary/5'
              }`}
            >
              <p className="font-body text-sm text-foreground">{feedback.text}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Choices */}
        {currentNode.choices && !feedback && (
          <div className="space-y-2">
            {currentNode.choices.map((choice, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleChoice(choice)}
                className="w-full pixel-card p-4 text-right hover:border-primary hover:bg-primary/5 transition-all group flex items-center gap-3"
              >
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-body text-sm font-medium" dir="ltr">{choice.textEs}</p>
                  <p className="text-muted-foreground font-body text-xs mt-0.5">{choice.textAr}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
