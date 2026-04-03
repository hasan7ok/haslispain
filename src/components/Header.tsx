import { Link, useLocation } from 'react-router-dom';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import PixelCharacter from './PixelCharacter';
import XPBar from './XPBar';
import { Map, User, MessageCircle, Trophy, Menu, X, LogOut, PenLine } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';
import ThemeSwitcher from './ThemeSwitcher';

const NAV_ITEMS = [
  { path: '/', label: 'الخريطة', labelEs: 'Mapa', icon: Map },
  { path: '/daily-challenge', label: 'التحدي', labelEs: 'Desafío', icon: Trophy },
  { path: '/profile', label: 'الملف', labelEs: 'Perfil', icon: User },
  { path: '/ai-chat', label: 'AI مساعد', labelEs: 'Chat AI', icon: MessageCircle },
  { path: '/achievements', label: 'الإنجازات', labelEs: 'Logros', icon: Trophy },
  { path: '/journal', label: 'التدوين', labelEs: 'Diario', icon: PenLine },
];

export default function Header() {
  const { state, xpToNextLevel, xpProgress } = useGameState();
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-primary/30 backdrop-blur-md"
      style={{
        background: 'rgba(9,0,20,0.92)',
        boxShadow: '0 0 20px rgba(255,0,255,0.1), 0 4px 30px rgba(0,0,0,0.5)',
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-3 py-2">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="PixÑol" className="h-8 md:h-10 w-auto" style={{ imageRendering: 'pixelated' }} />
        </Link>

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
                    ? 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-[0_0_8px_rgba(255,0,255,0.15)]'
                }`}
              >
                <Icon size={14} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 border border-accent/30"
            style={{ boxShadow: '0 0 8px rgba(255,153,0,0.15)' }}>
            <span className="font-pixel text-[0.5rem] text-accent">🔥 {state.streak}</span>
          </div>
          <XPBar xp={state.xp} xpToNext={xpToNextLevel} level={state.level} compact />
          <Link to="/profile" className="hover:animate-pixel-bounce">
            <PixelCharacter character={state.character} size={4} />
          </Link>
          <ThemeSwitcher />
          <button
            onClick={signOut}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-all border border-transparent hover:border-destructive/30 hover:shadow-[0_0_8px_rgba(255,0,0,0.2)]"
            title="تسجيل الخروج"
          >
            <LogOut size={14} />
          </button>
        </div>

        {/* Mobile: theme + menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeSwitcher />
          <span className="font-pixel text-[0.5rem] text-secondary" style={{ filter: 'drop-shadow(0 0 4px rgba(0,255,255,0.4))' }}>Lv.{state.level}</span>
          <span className="font-pixel text-[0.5rem] text-accent">🔥{state.streak}</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-foreground hover:text-secondary transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t-2 border-primary/30 animate-slide-up"
          style={{ background: 'rgba(9,0,20,0.97)' }}>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 font-pixel text-[0.6rem] border-b border-border transition-all ${
                  isActive ? 'text-secondary bg-secondary/5 shadow-[inset_2px_0_0_hsl(var(--secondary))]' : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
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
          <button
            onClick={signOut}
            className="w-full flex items-center gap-3 px-4 py-3 font-pixel text-[0.6rem] text-destructive border-t border-border hover:bg-destructive/5 transition-colors"
          >
            <LogOut size={16} /> تسجيل الخروج
          </button>
        </nav>
      )}
    </header>
  );
}
