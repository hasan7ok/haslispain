import { motion } from 'framer-motion';
import cultureFlamenco from '@/assets/culture-flamenco.jpg';
import culturePaella from '@/assets/culture-paella.jpg';
import cultureSagrada from '@/assets/culture-sagrada.jpg';
import cultureFiesta from '@/assets/culture-fiesta.jpg';
import cultureAlhambra from '@/assets/culture-alhambra.jpg';

const CULTURE_CARDS = [
  {
    id: 'flamenco',
    titleEs: 'El Flamenco',
    titleEn: 'Flamenco Dance',
    snippet: 'اكتشف فن الفلامنكو — رقص العاطفة والإيقاع الأندلسي الأصيل',
    image: cultureFlamenco,
  },
  {
    id: 'gastronomia',
    titleEs: 'La Gastronomía',
    titleEn: 'Spanish Cuisine',
    snippet: 'من الباييلا إلى التاباس، تعرّف على أشهر الأطباق الإسبانية',
    image: culturePaella,
  },
  {
    id: 'arquitectura',
    titleEs: 'La Arquitectura',
    titleEn: 'Architecture',
    snippet: 'روائع غاودي والعمارة الإسبانية التي تأسر العالم',
    image: cultureSagrada,
  },
  {
    id: 'fiestas',
    titleEs: 'Las Fiestas',
    titleEn: 'Spanish Festivals',
    snippet: 'لا توماتينا، سان فيرمين — مهرجانات لا مثيل لها',
    image: cultureFiesta,
  },
  {
    id: 'historia',
    titleEs: 'La Historia',
    titleEn: 'History & Heritage',
    snippet: 'من قصر الحمراء إلى الأندلس، تاريخ عريق يروي قصصاً خالدة',
    image: cultureAlhambra,
  },
];

export default function CulturaSection() {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-base md:text-lg text-foreground mb-5 flex items-center gap-2">
        <span className="text-2xl">🇪🇸</span>
        <span className="text-gradient-vapor">الثقافة الإسبانية — Cultura Española</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CULTURE_CARDS.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * idx, duration: 0.5 }}
            className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] sm:aspect-[4/5]"
            style={{ willChange: 'transform' }}
          >
            {/* Background image */}
            <img
              src={card.image}
              alt={card.titleEs}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300" />

            {/* Hover glow border */}
            <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/40 transition-all duration-300 group-hover:shadow-[inset_0_0_30px_rgba(255,0,255,0.1)]" />

            {/* Content */}
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
              <motion.span
                className="inline-flex items-center gap-1 font-mono text-[0.6rem] uppercase tracking-wider text-accent opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,153,0,0.5))' }}
              >
                Explorar →
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
