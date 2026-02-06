import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { ZONES } from '@/data/zones';
import Header from '@/components/Header';
import { ArrowLeft, Check, BookOpen, Gamepad2, ChevronRight } from 'lucide-react';

export default function ZonePage() {
  const { zoneId } = useParams<{ zoneId: string }>();
  const navigate = useNavigate();
  const { state } = useGameState();

  const zone = ZONES.find(z => z.id === zoneId);
  if (!zone) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto p-8 text-center">
          <p className="font-pixel text-primary">المنطقة غير موجودة</p>
          <button onClick={() => navigate('/')} className="pixel-btn mt-4">العودة للخريطة</button>
        </div>
      </div>
    );
  }

  const isUnlocked = state.unlockedZones.includes(zone.id);
  if (!isUnlocked) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-3xl">
        {/* Back button */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> العودة للخريطة
        </button>

        {/* Zone header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`pixel-card-primary p-6 mb-6 ${zone.glowClass}`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{zone.icon}</span>
            <div>
              <h1 className="font-pixel text-sm text-primary">{zone.name}</h1>
              <p className="font-pixel text-[0.5rem] text-muted-foreground mt-1">{zone.nameEs}</p>
              <p className="text-foreground font-body text-sm mt-1">{zone.descriptionAr}</p>
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <h2 className="font-pixel text-[0.65rem] text-foreground mb-3 flex items-center gap-2">
          <BookOpen size={14} className="text-primary" /> الدروس - Lecciones
        </h2>
        <div className="space-y-2 mb-8">
          {zone.lessons.map((lesson, idx) => {
            const isCompleted = state.completedLessons.includes(lesson.id);
            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/lesson/${lesson.id}`}
                  className={`pixel-card flex items-center gap-3 p-4 group hover:translate-y-[-1px] transition-all ${
                    isCompleted ? 'border-accent/50' : ''
                  }`}
                >
                  <span className="text-xl">{lesson.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-pixel text-[0.55rem] text-foreground">{lesson.title}</h3>
                    <p className="text-muted-foreground font-body text-xs mt-0.5">{lesson.titleAr}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[0.4rem] text-xp">+{lesson.xpReward} XP</span>
                    {isCompleted ? (
                      <div className="w-5 h-5 flex items-center justify-center bg-accent/20 border border-accent"><Check size={12} className="text-accent" /></div>
                    ) : (
                      <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary" />
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Games */}
        <h2 className="font-pixel text-[0.65rem] text-foreground mb-3 flex items-center gap-2">
          <Gamepad2 size={14} className="text-secondary" /> الألعاب - Juegos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {zone.games.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Link
                to={`/game/${game.type}?zone=${zone.id}`}
                className="pixel-card pixel-border-secondary flex items-center gap-3 p-4 hover:translate-y-[-2px] transition-all group"
              >
                <span className="text-2xl">{game.icon}</span>
                <div className="flex-1">
                  <h3 className="font-pixel text-[0.55rem] text-secondary">{game.title}</h3>
                  <p className="text-muted-foreground font-body text-xs">{game.titleAr}</p>
                </div>
                <span className="font-pixel text-[0.4rem] text-xp">+{game.xpReward} XP</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
