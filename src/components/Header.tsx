import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { BookOpen, LogOut, Map, Menu, MessageCircle, PenLine, Trophy, User, X } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { useAuth } from '@/hooks/useAuth';
import PixelCharacter from './PixelCharacter';
import ThemeSwitcher from './ThemeSwitcher';
import { Button } from '@/components/ui/button';
import logo from '@/assets/pixnol-logo.png';

const NAV_ITEMS = [
  { path: '/', label: 'الخريطة', labelEs: 'Mapa', icon: Map },
  { path: '/daily-challenge', label: 'التحدي', labelEs: 'Desafío', icon: Trophy },
  { path: '/stories', label: 'القصص', labelEs: 'Historias', icon: BookOpen },
  { path: '/ai-chat', label: 'المحادثة', labelEs: 'Chat', icon: MessageCircle },
  { path: '/journal', label: 'التدوين', labelEs: 'Diario', icon: PenLine },
];

export default function Header() {
  const { state } = useGameState();
  const { signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="PIXÑOL">
          <img src={logo} alt="PIXÑOL" width={48} height={48} className="h-12 w-12 object-contain" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" dir="rtl">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-6 text-sm font-semibold transition-colors ${
                  isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {isActive && <span className="absolute inset-x-0 bottom-0 h-px bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="border-l border-border pl-4 text-xs text-muted-foreground">
            <strong className="font-semibold text-foreground">Lv. {state.level}</strong> · {state.streak} أيام
          </span>
          <ThemeSwitcher />
          <Link to="/profile" aria-label="الملف الشخصي">
            <PixelCharacter character={state.character} size={4} />
          </Link>
          <Button variant="ghost" size="icon" onClick={signOut} title="تسجيل الخروج" aria-label="تسجيل الخروج">
            <LogOut />
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher />
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen((open) => !open)} aria-label="القائمة">
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-border bg-background px-4 py-3 lg:hidden" dir="rtl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 border-b border-border/60 py-4 text-sm font-semibold text-muted-foreground last:border-0 hover:text-foreground"
              >
                <Icon className="size-4 text-primary" /> {item.label}
              </Link>
            );
          })}
          <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 py-4 text-sm font-semibold text-muted-foreground">
            <User className="size-4 text-primary" /> الملف الشخصي
          </Link>
          <Button variant="outline" className="mt-2 w-full rounded-sm" onClick={signOut}>
            <LogOut /> تسجيل الخروج
          </Button>
        </nav>
      )}
    </header>
  );
}