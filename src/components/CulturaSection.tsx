import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Volume2 } from 'lucide-react';
import { speakSpanish } from '@/components/SpanishWord';
import cultureFlamenco from '@/assets/culture-flamenco.jpg';
import culturePaella from '@/assets/culture-paella.jpg';
import cultureSagrada from '@/assets/culture-sagrada.jpg';
import cultureFiesta from '@/assets/culture-fiesta.jpg';
import cultureAlhambra from '@/assets/culture-alhambra.jpg';

interface VocabItem {
  es: string;
  ar: string;
  example?: string;
}

const CULTURE_CARDS = [
  {
    id: 'flamenco',
    titleEs: 'El Flamenco',
    titleEn: 'Flamenco Dance',
    snippet: 'اكتشف فن الفلامنكو — رقص العاطفة والإيقاع الأندلسي الأصيل',
    image: cultureFlamenco,
    vocab: [
      { es: 'El baile', ar: 'الرقص', example: 'El baile flamenco es apasionante.' },
      { es: 'El ritmo', ar: 'الإيقاع', example: 'El ritmo del flamenco es único.' },
      { es: 'La guitarra', ar: 'القيثارة', example: 'Toca la guitarra española.' },
      { es: 'El cantaor', ar: 'المغني', example: 'El cantaor tiene una voz profunda.' },
      { es: 'Las palmas', ar: 'التصفيق', example: '¡Dale palmas al compás!' },
    ] as VocabItem[],
  },
  {
    id: 'gastronomia',
    titleEs: 'La Gastronomía',
    titleEn: 'Spanish Cuisine',
    snippet: 'من الباييلا إلى التاباس، تعرّف على أشهر الأطباق الإسبانية',
    image: culturePaella,
    vocab: [
      { es: 'La paella', ar: 'الباييلا', example: 'La paella valenciana lleva azafrán.' },
      { es: 'Las tapas', ar: 'التاباس', example: 'Vamos a tomar unas tapas.' },
      { es: 'El aceite de oliva', ar: 'زيت الزيتون', example: 'España produce el mejor aceite de oliva.' },
      { es: 'El jamón', ar: 'لحم الخنزير المقدد', example: 'El jamón ibérico es un manjar.' },
      { es: 'La tortilla', ar: 'التورتيلا', example: 'La tortilla española lleva huevo y patata.' },
    ] as VocabItem[],
  },
  {
    id: 'arquitectura',
    titleEs: 'La Arquitectura',
    titleEn: 'Architecture',
    snippet: 'روائع غاودي والعمارة الإسبانية التي تأسر العالم',
    image: cultureSagrada,
    vocab: [
      { es: 'La catedral', ar: 'الكاتدرائية', example: 'La catedral de Sevilla es impresionante.' },
      { es: 'El arco', ar: 'القوس', example: 'Los arcos árabes son hermosos.' },
      { es: 'El mosaico', ar: 'الفسيفساء', example: 'Gaudí usaba mosaicos de colores.' },
      { es: 'La torre', ar: 'البرج', example: 'La torre de la Giralda es famosa.' },
      { es: 'El palacio', ar: 'القصر', example: 'El palacio real es magnífico.' },
    ] as VocabItem[],
  },
  {
    id: 'fiestas',
    titleEs: 'Las Fiestas',
    titleEn: 'Spanish Festivals',
    snippet: 'لا توماتينا، سان فيرمين — مهرجانات لا مثيل لها',
    image: cultureFiesta,
    vocab: [
      { es: 'La fiesta', ar: 'الحفلة / المهرجان', example: '¡Vamos a la fiesta del pueblo!' },
      { es: 'Los fuegos artificiales', ar: 'الألعاب النارية', example: 'Los fuegos artificiales iluminan la noche.' },
      { es: 'El desfile', ar: 'الموكب / الاستعراض', example: 'El desfile pasa por la calle principal.' },
      { es: 'La música', ar: 'الموسيقى', example: 'La música suena en toda la plaza.' },
      { es: 'El traje típico', ar: 'الزي التقليدي', example: 'Lleva un traje típico andaluz.' },
    ] as VocabItem[],
  },
  {
    id: 'historia',
    titleEs: 'La Historia',
    titleEn: 'History & Heritage',
    snippet: 'من قصر الحمراء إلى الأندلس، تاريخ عريق يروي قصصاً خالدة',
    image: cultureAlhambra,
    vocab: [
      { es: 'La historia', ar: 'التاريخ', example: 'España tiene una historia rica.' },
      { es: 'El castillo', ar: 'القلعة', example: 'El castillo está en la colina.' },
      { es: 'La conquista', ar: 'الفتح', example: 'La conquista de Granada fue en 1492.' },
      { es: 'El rey', ar: 'الملك', example: 'El rey Fernando unificó España.' },
      { es: 'La mezquita', ar: 'المسجد', example: 'La mezquita de Córdoba es única.' },
    ] as VocabItem[],
  },
];

export default function CulturaSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <section className="mt-8">
      <h2 className="font-heading text-base md:text-lg text-foreground mb-5 flex items-center gap-2">
        <span className="text-2xl">🇪🇸</span>
        <span className="text-gradient-vapor">الثقافة الإسبانية — Cultura Española</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CULTURE_CARDS.map((card, idx) => {
          const isExpanded = expandedCard === card.id;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * idx, duration: 0.5 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{ willChange: 'transform' }}
            >
              {/* Image part */}
              <div
                className="relative aspect-[3/4] sm:aspect-[4/5]"
                onClick={() => setExpandedCard(isExpanded ? null : card.id)}
              >
                <img
                  src={card.image}
                  alt={card.titleEs}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-[inset_0_0_30px_rgba(255,0,255,0.1)]" />

                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <p className="font-heading text-xs uppercase tracking-widest text-secondary mb-1 opacity-80 group-hover:opacity-100 transition-opacity"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,255,0.6))' }}>
                    {card.titleEs}
                  </p>
                  <h3 className="font-body text-base font-bold text-white mb-1.5 drop-shadow-lg">
                    {card.titleEn}
                  </h3>
                  <p className="font-body text-xs text-white/70 leading-relaxed line-clamp-2 mb-3">
                    {card.snippet}
                  </p>
                  <div className="flex items-center justify-between">
                    <motion.span
                      className="inline-flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-wider text-accent"
                      style={{ filter: 'drop-shadow(0 0 4px rgba(255,153,0,0.5))' }}
                    >
                      📖 {card.vocab.length} مفردات
                    </motion.span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/60"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Vocab panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="overflow-hidden bg-card border-t border-primary/20"
                  >
                    <div className="p-3 space-y-2">
                      {card.vocab.map((v, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border hover:border-primary/30 transition-colors"
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); speakSpanish(v.es); }}
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
                              <p className="font-mono text-[0.65rem] text-muted-foreground mt-1 italic leading-relaxed">
                                "{v.example}"
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
