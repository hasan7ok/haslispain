import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, BookOpen, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';
import { CULTURE_ARTICLES } from '@/data/cultureArticles';
import { speakSpanish } from '@/components/SpanishWord';

export default function CultureDetailPage() {
  const { cultureId } = useParams();
  const navigate = useNavigate();
  const article = CULTURE_ARTICLES.find(a => a.id === cultureId);

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-3 py-10 text-center">
          <p className="text-muted-foreground font-body">المقال غير موجود</p>
          <button onClick={() => navigate('/')} className="mt-4 text-primary font-pixel text-xs underline">العودة للرئيسية</button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
        <img src={article.heroImage} alt={article.titleEs} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-white/70 hover:text-white font-body text-xs mb-3 transition-colors">
            <ArrowLeft size={14} /> العودة
          </button>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-pixel text-sm sm:text-base text-gradient-vapor mb-1"
          >
            {article.titleAr}
          </motion.h1>
          <p className="font-heading text-xs text-secondary uppercase tracking-widest"
            style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.5))' }}>
            {article.titleEs}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-3 py-6 max-w-3xl space-y-8">
        {/* Intro snippet */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-body text-sm text-foreground/90 leading-relaxed border-r-2 border-primary/50 pr-4"
        >
          {article.snippet}
        </motion.p>

        {/* Article sections with images */}
        {article.sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.15 }}
          >
            {/* Insert an image before the 2nd section */}
            {idx === 1 && article.images[0] && (
              <div className="mb-6 rounded-xl overflow-hidden aspect-video">
                <img
                  src={article.images[0]}
                  alt={article.titleEs}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="pixel-card p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-primary flex-shrink-0" style={{ filter: 'drop-shadow(0 0 4px rgba(255,0,255,0.4))' }} />
                <h2 className="font-body text-sm font-bold text-foreground">{section.heading}</h2>
              </div>
              <p className="font-mono text-[0.6rem] text-secondary/70 uppercase tracking-wider mb-3">{section.headingEs}</p>
              <p className="font-body text-xs text-foreground/80 leading-relaxed">{section.body}</p>
            </div>
          </motion.div>
        ))}

        {/* Second image */}
        {article.images[1] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-xl overflow-hidden aspect-video"
          >
            <img
              src={article.images[1]}
              alt={article.titleEs}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        )}

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="pixel-card-primary p-4 sm:p-5 border-r-4 border-accent"
        >
          <div className="flex items-start gap-2">
            <Lightbulb size={18} className="text-accent flex-shrink-0 mt-0.5" style={{ filter: 'drop-shadow(0 0 6px rgba(255,153,0,0.5))' }} />
            <p className="font-body text-xs text-foreground leading-relaxed">{article.funFact}</p>
          </div>
        </motion.div>

        {/* Vocabulary section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <h2 className="font-pixel text-[0.65rem] text-primary mb-4 flex items-center gap-2">
            <span className="text-lg">📖</span>
            <span className="text-gradient-vapor">مفردات ثقافية — Vocabulario Cultural</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {article.vocab.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.95 + i * 0.05 }}
                className="flex items-start gap-2 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() => speakSpanish(v.es)}
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                  title="نطق"
                >
                  <Volume2 size={14} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-body text-sm font-semibold text-secondary" style={{ filter: 'drop-shadow(0 0 3px rgba(0,255,255,0.3))' }}>
                      {v.es}
                    </span>
                    <span className="text-xs text-muted-foreground">—</span>
                    <span className="font-body text-sm text-foreground">{v.ar}</span>
                  </div>
                  {v.example && (
                    <p className="font-mono text-[0.6rem] text-muted-foreground mt-1 italic leading-relaxed">
                      "{v.example}"
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back button */}
        <div className="text-center pt-2 pb-8">
          <button
            onClick={() => navigate('/')}
            className="font-pixel text-[0.55rem] text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            ← العودة للخريطة — Volver al Mapa
          </button>
        </div>
      </main>
    </div>
  );
}
