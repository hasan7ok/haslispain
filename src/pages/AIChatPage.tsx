import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import AIChat from '@/components/AIChat';
import { ArrowLeft } from 'lucide-react';

export default function AIChatPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col container mx-auto max-w-2xl">
        <div className="px-3 pt-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-2">
            <ArrowLeft size={16} /> العودة
          </button>
          <div className="pixel-card-primary p-3 mb-3 flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h1 className="font-pixel text-[0.65rem] text-primary">PIXÑOL AI</h1>
              <p className="text-muted-foreground font-body text-xs">مساعدك الذكي لتعلم الإسبانية</p>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <AIChat />
        </div>
      </main>
    </div>
  );
}
