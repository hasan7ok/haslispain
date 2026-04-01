import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { ZONES } from '@/data/zones';
import PixelCharacter from '@/components/PixelCharacter';
import XPBar from '@/components/XPBar';
import Header from '@/components/Header';
import rpgMapBg from '@/assets/rpg-map-bg.png';
import { Lock, Sparkles, ChevronRight, Flame, BookOpen, Swords } from 'lucide-react';
import CulturaSection from '@/components/CulturaSection';
import { useEffect, useRef } from 'react';

function ParallaxGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 30 });
  const translateX = useTransform(smoothX, [-1, 1], [-18, 18]);
  const translateY = useTransform(smoothY, [-1, 1], [-12, 12]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={gridRef}
      className="fixed inset-0 pointer-events-none opacity-25"
      style={{
        translateX,
        translateY,
        scale: 1.08,
        backgroundImage: 'linear-gradient(transparent 94%, hsl(var(--primary)/0.18) 94%), linear-gradient(90deg, transparent 94%, hsl(var(--primary)/0.18) 94%)',
        backgroundSize: '52px 52px',
      }}
    />
  );
}

export default function Index() {
  const { state, xpToNextLevel } = useGameState();
  const { playClick, playSuccess, playError } = usePixelSounds();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Parallax geometric grid */}
      <ParallaxGrid />
      {/* Floating sun */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--accent)), hsl(var(--primary)))' }}
      />

      <Header />
      <main className="container mx-auto px-3 py-6 relative z-10">
        {/* Hero section */}
        <div className="relative mb-6 overflow-hidden pixel-card-primary">
          <img
            src={rpgMapBg}
            alt="RPG World Map"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
            style={{ imageRendering: 'auto', mixBlendMode: 'screen' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <PixelCharacter character={state.character} size={8} animate />
            <div className="text-center md:text-right flex-1">
              <h1 className="font-pixel text-lg md:text-2xl mb-2 text-gradient-vapor">
                ¡Hola, {state.username}!
              </h1>
              <p className="text-foreground font-body mb-4">اختر منطقة على الخريطة لبدء مغامرتك</p>
              <div className="max-w-xs mx-auto md:mx-0">
                <XPBar xp={state.xp} xpToNext={xpToNextLevel} level={state.level} />
              </div>
              <div className="flex gap-4 mt-3 justify-center md:justify-start">
                <span className="font-pixel text-[0.55rem] text-accent" style={{ filter: 'drop-shadow(0 0 4px rgba(255,153,0,0.5))' }}>🔥 Streak: {state.streak} يوم</span>
                <span className="font-pixel text-[0.55rem] text-secondary" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))' }}>✅ {state.completedLessons.length} درس</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button
            whileHover={{ y: -4, boxShadow: '0 0 25px rgba(255,0,255,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); navigate('/daily-challenge'); }}
            className="pixel-card border-t-2 border-t-accent p-4 text-center group transition-all"
          >
            <Flame size={24} className="mx-auto text-accent mb-2" style={{ filter: 'drop-shadow(0 0 6px rgba(255,153,0,0.5))' }} />
            <p className="font-pixel text-[0.5rem] text-accent">التحدي اليومي</p>
            <p className="font-mono text-[0.5rem] text-muted-foreground mt-1 uppercase tracking-wider">Desafío Diario</p>
          </motion.button>
          <motion.button
            whileHover={{ y: -4, boxShadow: '0 0 25px rgba(0,255,255,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); navigate('/stories'); }}
            className="pixel-card border-t-2 border-t-secondary p-4 text-center group transition-all"
          >
            <BookOpen size={24} className="mx-auto text-secondary mb-2" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.5))' }} />
            <p className="font-pixel text-[0.5rem] text-secondary">القصص</p>
            <p className="font-mono text-[0.5rem] text-muted-foreground mt-1 uppercase tracking-wider">Historias</p>
          </motion.button>
          <motion.button
            whileHover={{ y: -4, boxShadow: '0 0 25px rgba(255,0,255,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); navigate('/boss-fights'); }}
            className="pixel-card border-t-2 border-t-destructive p-4 text-center group transition-all"
          >
            <Swords size={24} className="mx-auto text-destructive mb-2" style={{ filter: 'drop-shadow(0 0 6px rgba(255,80,80,0.5))' }} />
            <p className="font-pixel text-[0.5rem] text-destructive">Boss Fight</p>
            <p className="font-mono text-[0.5rem] text-muted-foreground mt-1 uppercase tracking-wider">معركة القواعد</p>
          </motion.button>
        </div>

        {/* Zone Grid */}
        <h2 className="font-pixel text-sm text-foreground mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-primary" style={{ filter: 'drop-shadow(0 0 6px rgba(255,0,255,0.5))' }} />
          <span className="text-gradient-vapor">خريطة العالم - Mapa del Mundo</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ZONES.map((zone, idx) => {
            const isUnlocked = state.unlockedZones.includes(zone.id);
            const completedCount = zone.lessons.filter(l => state.completedLessons.includes(l.id)).length;

            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => { if (isUnlocked) { playSuccess(); navigate(`/zone/${zone.id}`); } else { playError(); } }}
                className={`pixel-card relative cursor-pointer transition-all duration-200 group ${
                  isUnlocked
                    ? `hover:-translate-y-1 ${zone.glowClass}`
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 backdrop-blur-sm">
                    <div className="text-center">
                      <Lock size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="font-pixel text-[0.5rem] text-muted-foreground">
                        Level {zone.requiredLevel}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-3xl" style={{ filter: 'drop-shadow(0 0 8px rgba(255,0,255,0.3))' }}>{zone.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-pixel text-[0.65rem] text-secondary mb-1" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.5))' }}>{zone.name}</h3>
                    <p className="font-mono text-[0.55rem] text-muted-foreground mb-1 uppercase tracking-wider">{zone.nameEs}</p>
                    <p className="text-sm text-foreground font-body">{zone.descriptionAr}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-pixel text-[0.45rem] text-accent" style={{ filter: 'drop-shadow(0 0 3px rgba(255,153,0,0.5))' }}>
                        {completedCount}/{zone.lessons.length} دروس
                      </span>
                      <span className="font-mono text-[0.55rem] text-muted-foreground px-2 py-0.5 border border-border uppercase tracking-wider">
                        {zone.level}
                      </span>
                    </div>
                    {isUnlocked && completedCount < zone.lessons.length && (
                      <div className="mt-2 xp-bar-bg h-1.5 rounded-none overflow-hidden">
                        <div
                          className="xp-bar-fill h-full"
                          style={{ width: `${(completedCount / zone.lessons.length) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {isUnlocked && (
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-secondary transition-colors mt-1" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Cultura Section */}
        <CulturaSection />

      </main>
    </div>
  );
}
