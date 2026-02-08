import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { usePixelSounds } from '@/hooks/usePixelSounds';
import { ZONES } from '@/data/zones';
import PixelCharacter from '@/components/PixelCharacter';
import XPBar from '@/components/XPBar';
import Header from '@/components/Header';
import rpgMapBg from '@/assets/rpg-map-bg.png';
import { Lock, Sparkles, ChevronRight, Flame, BookOpen, Swords } from 'lucide-react';

export default function Index() {
  const { state, xpToNextLevel } = useGameState();
  const { playClick, playSuccess, playError } = usePixelSounds();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6">
        {/* Hero section */}
        <div className="relative mb-6 overflow-hidden pixel-card-primary">
          <img
            src={rpgMapBg}
            alt="RPG World Map"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            style={{ imageRendering: 'auto' }}
          />
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
            <PixelCharacter character={state.character} size={8} animate />
            <div className="text-center md:text-right flex-1">
              <h1 className="font-pixel text-lg md:text-2xl text-primary mb-2">
                ¡Hola, {state.username}!
              </h1>
              <p className="text-foreground font-body mb-4">اختر منطقة على الخريطة لبدء مغامرتك</p>
              <div className="max-w-xs mx-auto md:mx-0">
                <XPBar xp={state.xp} xpToNext={xpToNextLevel} level={state.level} />
              </div>
              <div className="flex gap-4 mt-3 justify-center md:justify-start">
                <span className="font-pixel text-[0.55rem] text-secondary">🔥 Streak: {state.streak} يوم</span>
                <span className="font-pixel text-[0.55rem] text-accent">✅ {state.completedLessons.length} درس</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); navigate('/daily-challenge'); }}
            className="pixel-card pixel-border-secondary p-4 text-center group hover:translate-y-[-2px] transition-all"
          >
            <Flame size={24} className="mx-auto text-secondary mb-2" />
            <p className="font-pixel text-[0.5rem] text-secondary">التحدي اليومي</p>
            <p className="font-pixel text-[0.35rem] text-muted-foreground mt-1">Desafío Diario</p>
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); navigate('/stories'); }}
            className="pixel-card pixel-border-accent p-4 text-center group hover:translate-y-[-2px] transition-all"
          >
            <BookOpen size={24} className="mx-auto text-accent mb-2" />
            <p className="font-pixel text-[0.5rem] text-accent">القصص</p>
            <p className="font-pixel text-[0.35rem] text-muted-foreground mt-1">Historias</p>
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { playClick(); navigate('/boss-fights'); }}
            className="pixel-card p-4 text-center group hover:translate-y-[-2px] transition-all"
            style={{ border: '3px solid hsl(0, 75%, 55%)', boxShadow: '4px 4px 0 0 hsl(0 75% 55% / 0.4)' }}
          >
            <Swords size={24} className="mx-auto text-destructive mb-2" />
            <p className="font-pixel text-[0.5rem] text-destructive">Boss Fight</p>
            <p className="font-pixel text-[0.35rem] text-muted-foreground mt-1">معركة القواعد</p>
          </motion.button>
        </div>

        {/* Zone Grid */}
        <h2 className="font-pixel text-sm text-foreground mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          خريطة العالم - Mapa del Mundo
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
                className={`pixel-card relative cursor-pointer transition-all duration-300 group ${
                  isUnlocked
                    ? `hover:translate-y-[-2px] ${zone.glowClass}`
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/70 z-10">
                    <div className="text-center">
                      <Lock size={24} className="mx-auto text-muted-foreground mb-2" />
                      <p className="font-pixel text-[0.5rem] text-muted-foreground">
                        Level {zone.requiredLevel}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{zone.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-pixel text-[0.65rem] text-primary mb-1">{zone.name}</h3>
                    <p className="font-pixel text-[0.45rem] text-muted-foreground mb-1">{zone.nameEs}</p>
                    <p className="text-sm text-foreground font-body">{zone.descriptionAr}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-pixel text-[0.45rem] text-accent">
                        {completedCount}/{zone.lessons.length} دروس
                      </span>
                      <span className="font-pixel text-[0.4rem] text-muted-foreground px-2 py-0.5 border border-border">
                        {zone.level}
                      </span>
                    </div>
                    {isUnlocked && completedCount < zone.lessons.length && (
                      <div className="mt-2 xp-bar-bg h-1.5 rounded-sm overflow-hidden">
                        <div
                          className="xp-bar-fill h-full"
                          style={{ width: `${(completedCount / zone.lessons.length) * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                  {isUnlocked && (
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
