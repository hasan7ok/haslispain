import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

interface QuizQuestion {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  options: { label: string; emoji: string; value: string }[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    emoji: '👋',
    title: 'أهلًا! خلّينا نبدأ بسرعة',
    subtitle: 'ليش حاب تتعلّم الإسبانية؟',
    options: [
      { label: 'للسفر', emoji: '✈️', value: 'travel' },
      { label: 'للشغل', emoji: '💼', value: 'work' },
      { label: 'للدراسة', emoji: '📚', value: 'study' },
      { label: 'للتسلية والفضول', emoji: '😄', value: 'fun' },
    ],
  },
  {
    id: 2,
    emoji: '📊',
    title: 'ممتاز!',
    subtitle: 'شنو علاقتك الحالية بالإسباني؟',
    options: [
      { label: 'ولا كلمة', emoji: '🆕', value: 'none' },
      { label: 'أعرف كلمات بسيطة', emoji: '💡', value: 'basic' },
      { label: 'أفهم بس ما أتكلم', emoji: '👂', value: 'passive' },
      { label: 'أتكلم شوي', emoji: '🗣️', value: 'speaking' },
    ],
  },
  {
    id: 3,
    emoji: '🌍',
    title: 'حلو!',
    subtitle: 'هل جربت تتعلم لغة ثانية قبل؟',
    options: [
      { label: 'إي', emoji: '✅', value: 'yes' },
      { label: 'لا', emoji: '❌', value: 'no' },
    ],
  },
  {
    id: 4,
    emoji: '🎯',
    title: 'يلا نركّز!',
    subtitle: 'شنو أكثر شي تحب تتعلمه بالبداية؟',
    options: [
      { label: 'أحچي بسرعة', emoji: '💬', value: 'speaking' },
      { label: 'أفهم الناس', emoji: '👂', value: 'listening' },
      { label: 'القواعد', emoji: '📖', value: 'grammar' },
      { label: 'كلشي شوي شوي', emoji: '🎯', value: 'balanced' },
    ],
  },
  {
    id: 5,
    emoji: '🎮',
    title: 'اختيار ذكي!',
    subtitle: 'شنو الطريقة اللي تحبها؟',
    options: [
      { label: 'دروس قصيرة وسريعة', emoji: '⚡', value: 'quick' },
      { label: 'محادثة وتمثيل', emoji: '🎭', value: 'conversation' },
      { label: 'تمارين وألعاب', emoji: '🎮', value: 'games' },
    ],
  },
  {
    id: 6,
    emoji: '⏰',
    title: 'تمام!',
    subtitle: 'كم وقت تقدر تخصص بالإسبوع؟',
    options: [
      { label: '5–10 دقايق باليوم', emoji: '⏱️', value: 'short' },
      { label: '20–30 دقيقة', emoji: '📅', value: 'medium' },
      { label: 'حسب المزاج', emoji: '😅', value: 'flexible' },
    ],
  },
  {
    id: 7,
    emoji: '💬',
    title: 'آخر سؤال!',
    subtitle: 'تحب الشرح يكون شلون؟',
    options: [
      { label: 'بسيط وخفيف', emoji: '😊', value: 'simple' },
      { label: 'رسمي شوي', emoji: '👔', value: 'formal' },
      { label: 'أمثلة من الحياة', emoji: '🌮', value: 'practical' },
    ],
  },
];

interface WelcomeQuizProps {
  onComplete: (results: Record<string, string>, level: string) => void;
}

export default function WelcomeQuiz({ onComplete }: WelcomeQuizProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  const determineLevel = (ans: Record<string, string>): string => {
    const q2 = ans['2'];
    if (q2 === 'none') return 'مبتدئ';
    if (q2 === 'basic') return 'مبتدئ متقدم';
    if (q2 === 'passive' || q2 === 'speaking') return 'متوسط';
    return 'مبتدئ';
  };

  const handleSelect = (value: string) => {
    setSelectedOption(value);
    const newAnswers = { ...answers, [question.id.toString()]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        setShowResult(true);
      }
    }, 400);
  };

  const level = determineLevel(answers);

  if (showResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="pixel-card-primary max-w-md w-full p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="font-pixel text-lg text-primary mb-3">!Excelente ممتاز</h2>
          <p className="font-body text-foreground mb-6">
            حسب إجاباتك، راح نبدأ وياك من:
          </p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="px-6 py-4 pixel-border-accent bg-accent/10 mb-6 inline-block"
          >
            <span className="font-pixel text-sm text-accent">{level}</span>
            <p className="font-pixel text-[0.4rem] text-muted-foreground mt-1">
              {level === 'مبتدئ' ? 'Principiante' : level === 'مبتدئ متقدم' ? 'Principiante Avanzado' : 'Intermedio'}
            </p>
          </motion.div>
          <p className="font-body text-muted-foreground text-sm mb-6">
            لا تقلق، تقدر تغيّر مستواك بأي وقت من الإعدادات 💪
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onComplete(answers, level)}
            className="pixel-btn w-full flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            يلا نبدأ المغامرة!
            <ChevronRight size={14} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="font-pixel text-[0.4rem] text-muted-foreground">
              {currentQ + 1} / {QUESTIONS.length}
            </span>
            <span className="font-pixel text-[0.4rem] text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="xp-bar-bg h-2 rounded-sm overflow-hidden">
            <motion.div
              className="xp-bar-fill h-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pixel-card-primary p-6"
          >
            <div className="text-center mb-6">
              <span className="text-4xl block mb-3">{question.emoji}</span>
              <h2 className="font-pixel text-[0.6rem] text-primary mb-2">{question.title}</h2>
              <p className="font-body text-foreground text-base">{question.subtitle}</p>
            </div>

            <div className="space-y-3">
              {question.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-right p-4 border-2 font-body text-sm flex items-center gap-3 transition-all ${
                    selectedOption === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card hover:border-muted-foreground text-foreground'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="flex-1">{opt.label}</span>
                  <ChevronRight size={14} className="text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
