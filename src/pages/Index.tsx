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
import puebloImage from '@/assets/culture-camino.jpg';
import ciudadImage from '@/assets/culture-sagrada.jpg';
import historiaImage from '@/assets/culture-alhambra.jpg';
import latinoImage from '@/assets/culture-carnaval.jpg';
import debateImage from '@/assets/culture-cine.jpg';
import negociosImage from '@/assets/culture-moda.jpg';
import literaturaImage from '@/assets/culture-literatura.jpg';

const QUICK_ACTIONS = [
  { path: '/daily-challenge', label: 'التحدي اليومي', labelEs: 'Desafío diario', icon: Flame },
  { path: '/stories', label: 'القصص التفاعلية', labelEs: 'Historias', icon: BookOpen },
  { path: '/boss-fights', label: 'تحدي القواعد', labelEs: 'Gramática', icon: Swords },
];

const ZONE_IMAGES: Record<string, string> = {
  pueblo: puebloImage,
  ciudad: ciudadImage,
  historia: historiaImage,
  latino: latinoImage,
  debate: debateImage,
  negocios: negociosImage,
  literatura: literaturaImage,
};

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

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
                  className={`relative min-h-[330px] overflow-hidden border border-border text-right ${
                    isUnlocked ? 'group cursor-pointer' : 'cursor-not-allowed'
                  } ${idx === 0 ? 'md:col-span-2 md:min-h-[380px]' : ''}`}
                >
                  <img
                    src={ZONE_IMAGES[zone.id]}
                    alt={`مشهد واقعي يمثل ${zone.nameEs}`}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-[1.03]' : 'grayscale'}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/10 ${isUnlocked ? '' : 'bg-background/55'}`} />
                  <div className="relative z-10 flex min-h-[330px] flex-col p-5 sm:p-6 md:min-h-full">
                    <div className="flex items-start justify-between">
                      <span className="font-heading text-5xl font-medium text-foreground/35">0{idx + 1}</span>
                      {isUnlocked ? (
                        <span className="border border-primary/60 bg-background/70 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-md">{zone.level}</span>
                      ) : (
                        <span className="grid size-9 place-items-center border border-border bg-background/70 backdrop-blur-md"><Lock className="size-4 text-muted-foreground" /></span>
                      )}
                    </div>
                    <div className="mt-auto pt-16">
                      <p className="text-xs font-semibold text-primary">{zone.nameEs}</p>
                      <h3 className={`mt-2 font-heading font-semibold ${idx === 0 ? 'text-3xl' : 'text-2xl'}`}>{zone.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-foreground/70">{zone.descriptionAr}</p>
                      <div className="mt-6 flex items-center justify-between gap-4 text-xs text-foreground/65">
                        <span>{completedCount}/{zone.lessons.length} دروس</span>
                        <span>{isUnlocked ? 'متاح الآن' : `يفتح عند المستوى ${zone.requiredLevel}`}</span>
                      </div>
                      <div className="mt-3 h-1 overflow-hidden bg-foreground/15">
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