import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Flame, Lock, Map, Swords } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { ZONES } from '@/data/zones';
import Header from '@/components/Header';
import CulturaSection from '@/components/CulturaSection';
import DonationModal from '@/components/DonationModal';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/premium-learning-hero.jpg';

const QUICK_ACTIONS = [
  { path: '/daily-challenge', label: 'التحدي اليومي', labelEs: 'Desafío diario', icon: Flame },
  { path: '/stories', label: 'القصص التفاعلية', labelEs: 'Historias', icon: BookOpen },
  { path: '/boss-fights', label: 'تحدي القواعد', labelEs: 'Gramática', icon: Swords },
];

export default function Index() {
  const { state, xpToNextLevel } = useGameState();
  const { playClick, playSuccess, playError } = usePixelSounds();
  const navigate = useNavigate();
  const progress = Math.min((state.xp / xpToNextLevel) * 100, 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main>
        <section className="relative min-h-[620px] overflow-hidden border-b border-border md:min-h-[690px]">
          <img
            src={heroImage}
            alt="متعلّمة إسبانية في أحد شوارع مدريد"
            width={1600}
            height={900}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/10" />

          <div className="container relative z-10 mx-auto flex min-h-[620px] items-end px-4 pb-12 pt-24 md:min-h-[690px] md:items-center md:pb-16 md:pt-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl text-right"
              dir="rtl"
            >
              <p className="mb-5 flex items-center justify-start gap-2 text-sm font-semibold text-primary">
                <span className="h-px w-10 bg-primary" />
                رحلة اليوم · Tu viaje de hoy
              </p>
              <h1 className="font-heading text-4xl font-semibold leading-[1.25] md:text-6xl">
                ¡Hola, {state.username}!
                <span className="mt-3 block text-foreground/80">ابدأ من حيث توقفت.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground md:text-lg">
                تعلّم الإسبانية من خلال مواقف حقيقية وثقافة أصيلة، بخطوات واضحة تناسب مستواك.
              </p>

              <div className="mt-8 max-w-lg border-y border-border/80 py-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-heading font-semibold">المستوى {state.level}</span>
                  <span dir="ltr" className="text-muted-foreground">{state.xp} / {xpToNextLevel} XP</span>
                </div>
                <div className="h-1.5 overflow-hidden bg-muted">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full origin-left bg-primary"
                  />
                </div>
                <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                  <span><strong className="text-foreground">{state.streak}</strong> يوم متتالٍ</span>
                  <span><strong className="text-foreground">{state.completedLessons.length}</strong> درس مكتمل</span>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-8 rounded-sm px-7 font-semibold"
                onClick={() => {
                  playClick();
                  navigate(`/zone/${state.unlockedZones[0] || ZONES[0].id}`);
                }}
              >
                تابع التعلّم <ArrowLeft className="size-4" />
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border bg-card/40">
          <div className="container mx-auto grid grid-cols-1 divide-y divide-border px-4 sm:grid-cols-3 sm:divide-x sm:divide-x-reverse sm:divide-y-0">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => { playClick(); navigate(action.path); }}
                  className="group flex min-h-32 items-center justify-between gap-4 px-5 py-7 text-right transition-colors hover:bg-muted/60"
                  dir="rtl"
                >
                  <span>
                    <span className="block font-heading text-base font-semibold">{action.label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{action.labelEs}</span>
                  </span>
                  <Icon className="size-5 text-primary transition-transform group-hover:-translate-x-1" />
                </button>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24" dir="rtl">
          <div className="mb-10 flex flex-col justify-between gap-5 border-b border-border pb-7 md:flex-row md:items-end">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
                <Map className="size-4" /> MAPA DEL MUNDO
              </p>
              <h2 className="font-heading text-3xl font-semibold md:text-5xl">مسارك في اللغة الإسبانية</h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-muted-foreground">
              سبع محطات مترابطة، من أساسيات الحديث إلى الأعمال والأدب المتقدم.
            </p>
          </div>

          <div className="grid grid-cols-1 border-l border-t border-border md:grid-cols-2 xl:grid-cols-4">
            {ZONES.map((zone, idx) => {
              const isUnlocked = state.unlockedZones.includes(zone.id);
              const completedCount = zone.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
              const zoneProgress = (completedCount / zone.lessons.length) * 100;

              return (
                <motion.button
                  key={zone.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => {
                    if (isUnlocked) {
                      playSuccess();
                      navigate(`/zone/${zone.id}`);
                    } else {
                      playError();
                    }
                  }}
                  className={`relative min-h-64 border-b border-r border-border p-6 text-right transition-colors ${
                    isUnlocked ? 'group hover:bg-card' : 'cursor-not-allowed bg-muted/20'
                  } ${idx === 0 ? 'md:col-span-2' : ''}`}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between">
                      <span className="font-heading text-4xl font-medium text-foreground/15">0{idx + 1}</span>
                      {isUnlocked ? (
                        <span className="border border-primary/40 px-2 py-1 text-[11px] font-semibold text-primary">{zone.level}</span>
                      ) : (
                        <Lock className="size-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="mt-auto pt-10">
                      <p className="text-xs font-semibold text-primary">{zone.nameEs}</p>
                      <h3 className="mt-2 font-heading text-xl font-semibold">{zone.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{zone.descriptionAr}</p>
                      <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
                        <span>{completedCount}/{zone.lessons.length} دروس</span>
                        <span>{isUnlocked ? 'متاح الآن' : `يفتح عند المستوى ${zone.requiredLevel}`}</span>
                      </div>
                      <div className="mt-3 h-px bg-muted">
                        <div className="h-full origin-right bg-primary" style={{ width: `${zoneProgress}%` }} />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>

        <CulturaSection />
      </main>

      <DonationModal />
    </div>
  );
}