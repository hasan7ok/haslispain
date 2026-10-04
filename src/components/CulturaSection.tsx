import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { CULTURE_ARTICLES } from '@/data/cultureArticles';
import { Button } from '@/components/ui/button';

export default function CulturaSection() {
  const navigate = useNavigate();

  return (
    <section className="border-t border-border bg-card/30 py-16 md:py-24" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="mb-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-primary">
              <BookOpen className="size-4" /> CULTURA ESPAÑOLA
            </p>
            <h2 className="font-heading text-3xl font-semibold md:text-5xl">إسبانيا كما تُعاش</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
              مقالات بصرية عن الناس والفن والطعام وكرة القدم، مع مفردات تُستخدم في الحياة اليومية.
            </p>
          </div>
          <span className="text-sm text-muted-foreground">{CULTURE_ARTICLES.length} قصة ثقافية</span>
        </div>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-border bg-border md:grid-cols-2 lg:grid-cols-12">
          {CULTURE_ARTICLES.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              onClick={() => navigate(`/cultura/${article.id}`)}
              className={`group relative cursor-pointer overflow-hidden bg-background ${
                index === 0 ? 'min-h-[520px] lg:col-span-7 lg:row-span-2' : 'min-h-[360px] lg:col-span-5'
              }`}
            >
              <img
                src={article.heroImage}
                alt={article.titleEs}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-xs font-semibold text-primary">{article.titleEs}</p>
                <h3 className={`mt-2 font-heading font-semibold ${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>
                  {article.titleAr || article.titleEn}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-foreground/70 line-clamp-2">{article.snippet}</p>
                <div className="mt-5 flex items-center justify-between border-t border-foreground/15 pt-4 text-xs text-foreground/70">
                  <span>{article.vocab.length} مفردات</span>
                  <ArrowLeft className="size-4 text-primary transition-transform group-hover:-translate-x-1" />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" className="rounded-sm" onClick={() => navigate(`/cultura/${CULTURE_ARTICLES[0].id}`)}>
            اقرأ أحدث القصص <ArrowLeft />
          </Button>
        </div>
      </div>
    </section>
  );
}