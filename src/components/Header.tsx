import { Link, useLocation } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import PixelCharacter from './PixelCharacter';
import XPBar from './XPBar';
import { Map, User, MessageCircle, Trophy, Menu, X } from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/', label: 'الخريطة', labelEs: 'Mapa', icon: Map },
  { path: '/profile', label: 'الملف', labelEs: 'Perfil', icon: User },
  { path: '/ai-chat', label: 'AI مساعد', labelEs: 'Chat AI', icon: MessageCircle },
  { path: '/achievements', label: 'الإنجازات', labelEs: 'Logros', icon: Trophy },
];

export default function Header() {
  const { state, xpToNextLevel, xpProgress } = useGameState();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 pixel-card border-b-4 border-primary/30 bg-card/95 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-3 py-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-pixel text-sm md:text-base text-primary animate-pixel-glow group-hover:animate-pixel-bounce">
            PIXÑOL
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 font-pixel text-[0.55rem] transition-all duration-200 border-2 ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon size={14} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* XP & Character */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 pixel-border-muted">
            <span className="font-pixel text-[0.5rem] text-secondary">🔥 {state.streak}</span>
          </div>
          <XPBar xp={state.xp} xpToNext={xpToNextLevel} level={state.level} compact />
          <Link to="/profile" className="hover:animate-pixel-bounce">
            <PixelCharacter character={state.character} size={4} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <span className="font-pixel text-[0.5rem] text-primary">Lv.{state.level}</span>
          <span className="font-pixel text-[0.5rem] text-secondary">🔥{state.streak}</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t-2 border-border bg-card animate-slide-up">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-pixel text-[0.6rem] border-b border-border ${
                  isActive ? 'text-primary bg-primary/5' : 'text-muted-foreground'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
          <div className="p-3">
            <XPBar xp={state.xp} xpToNext={xpToNextLevel} level={state.level} />
          </div>
        </nav>
      )}
    </header>
  );
}
