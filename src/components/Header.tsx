import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Map, MessageCircle, PenLine, Trophy, User } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import ThemeSwitcher from './ThemeSwitcher';
import logo from '@/assets/pixnol-logo.png';

const NAV_ITEMS = [
  { path: '/', label: 'الخريطة', labelEs: 'Mapa', icon: Map },
  { path: '/daily-challenge', label: 'التحدي', labelEs: 'Desafío', icon: Trophy },
  { path: '/stories', label: 'القصص', labelEs: 'Historias', icon: BookOpen },
  { path: '/ai-chat', label: 'المحادثة', labelEs: 'Chat', icon: MessageCircle },
  { path: '/journal', label: 'التدوين', labelEs: 'Diario', icon: PenLine },
  { path: '/profile', label: 'الملف الشخصي', labelEs: 'Perfil', icon: User },
];

export default function Header() {
  const { state } = useGameState();
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-[72px] items-center gap-2 px-3 sm:px-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="PIXÑOL">
          <img src={logo} alt="PIXÑOL" width={48} height={48} className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
        </Link>

        <span className="hidden shrink-0 border-l border-border pl-4 text-xs text-muted-foreground xl:inline">
          <strong className="font-semibold text-foreground">Lv. {state.level}</strong> · {state.streak} أيام
        </span>

        <nav className="flex min-w-0 flex-1 items-center justify-end gap-1" dir="rtl" aria-label="التنقل الرئيسي">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/profile' && location.pathname === '/settings');
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.label}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-md px-2 text-sm font-semibold transition-colors lg:px-3 ${
                  isActive ? 'bg-primary/15 text-foreground' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <Icon className={`size-4 ${isActive ? 'text-primary' : ''}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0"><ThemeSwitcher /></div>
      </div>
    </header>
  );
}
