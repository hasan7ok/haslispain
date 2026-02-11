import { motion } from 'framer-motion';
import { ArrowLeft, Map, Swords, BookOpen, MessageCircle, Trophy, Flame, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FEATURES = [
  {
    icon: Map,
    emoji: '🗺️',
    title: 'خريطة تفاعلية',
    titleEs: 'Mapa Interactivo',
    desc: 'استكشف مناطق مختلفة، كل منطقة تحتوي على دروس ومهام تناسب مستواك.',
    color: 'text-secondary',
    glow: 'rgba(0,255,255,0.4)',
  },
  {
    icon: BookOpen,
    emoji: '📖',
    title: 'دروس تفاعلية',
    titleEs: 'Lecciones Interactivas',
    desc: 'تعلّم المفردات والقواعد من خلال دروس قصيرة وممتعة بأسلوب الألعاب.',
    color: 'text-primary',
    glow: 'rgba(255,0,255,0.4)',
  },
  {
    icon: Swords,
    emoji: '⚔️',
    title: 'معارك القواعد',
    titleEs: 'Boss Fights',
    desc: 'واجه "بوسات" القواعد في تحديات مثيرة لاختبار ما تعلمته!',
    color: 'text-destructive',
    glow: 'rgba(255,80,80,0.4)',
  },
  {
    icon: Flame,
    emoji: '🔥',
    title: 'التحدي اليومي',
    titleEs: 'Desafío Diario',
    desc: 'تحدٍّ جديد كل يوم للحفاظ على سلسلة إنجازاتك وكسب XP إضافية.',
    color: 'text-accent',
    glow: 'rgba(255,153,0,0.4)',
  },
  {
    icon: MessageCircle,
    emoji: '🤖',
    title: 'مساعد AI ذكي',
    titleEs: 'Chat AI',
    desc: 'تحدّث مع مساعد ذكي يساعدك بالترجمة والشرح والتمارين.',
    color: 'text-secondary',
    glow: 'rgba(0,255,255,0.4)',
  },
  {
    icon: Trophy,
    emoji: '🏆',
    title: 'إنجازات و NFTs',
    titleEs: 'Logros y NFTs',
    desc: 'اجمع شارات وبطاقات NFT فريدة كلما تقدمت في رحلتك.',
    color: 'text-accent',
    glow: 'rgba(255,153,0,0.4)',
  },
];

export default function HowItWorksPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(transparent 95%, rgba(255,0,255,0.15) 95%), linear-gradient(90deg, transparent 95%, rgba(255,0,255,0.15) 95%)',
          backgroundSize: '50px 50px',
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #FF9900, #FF00FF)' }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 font-pixel text-[0.55rem] text-muted-foreground hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft size={16} /> رجوع
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-pixel text-lg md:text-xl text-gradient-vapor mb-3 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-primary" />
            كيف يعمل PIXÑOL؟
          </h1>
          <p className="font-mono text-[0.6rem] text-secondary/60 uppercase tracking-widest mb-2">¿Cómo funciona?</p>
          <p className="font-body text-foreground text-sm">تعلّم الإسبانية بأسلوب ألعاب البكسل — من الصفر حتى المحادثة!</p>
        </motion.div>

        <div className="space-y-4">
          {FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="pixel-card p-5 flex items-start gap-4 group hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 20px ${feat.glow}`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 0 rgba(0,0,0,0)`)}
              >
                <div className="shrink-0 mt-1">
                  <Icon size={24} className={feat.color} style={{ filter: `drop-shadow(0 0 6px ${feat.glow})` }} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-pixel text-[0.6rem] ${feat.color} mb-1`}>{feat.title}</h3>
                  <p className="font-mono text-[0.5rem] text-muted-foreground uppercase tracking-wider mb-1">{feat.titleEs}</p>
                  <p className="font-body text-foreground text-sm">{feat.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mt-10"
        >
          <p className="font-body text-muted-foreground text-sm mb-4">جاهز تبدأ مغامرتك؟ 🚀</p>
          <button
            onClick={() => navigate(-1)}
            className="pixel-btn-secondary font-pixel text-[0.55rem] px-8 py-3"
          >
            يلا نبدأ! - ¡Vamos!
          </button>
        </motion.div>
      </div>
    </div>
  );
}
