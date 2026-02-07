export interface BossQuestion {
  questionEs: string;
  questionAr: string;
  options: string[];
  correctAnswer: string;
  explanationEs: string;
  explanationAr: string;
  damage: number; // damage dealt to boss if correct
}

export interface GrammarBoss {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  level: string;
  description: string;
  descriptionAr: string;
  maxHp: number;
  xpReward: number;
  topic: string;
  questions: BossQuestion[];
}

export const GRAMMAR_BOSSES: GrammarBoss[] = [
  {
    id: 'boss-ser-estar',
    name: 'El Dragón de Ser y Estar',
    nameAr: 'تنين Ser و Estar',
    icon: '🐉',
    level: 'A1-A2',
    description: 'Defeat the dragon by mastering Ser vs Estar!',
    descriptionAr: 'اهزم التنين بإتقان الفرق بين Ser و Estar!',
    maxHp: 100,
    xpReward: 80,
    topic: 'Ser vs Estar',
    questions: [
      {
        questionEs: 'Yo ___ estudiante.',
        questionAr: 'أنا ___ طالب.',
        options: ['soy', 'estoy', 'tengo', 'hago'],
        correctAnswer: 'soy',
        explanationEs: 'SER para identidad permanente: profesión, nacionalidad.',
        explanationAr: 'SER للهوية الدائمة: مهنة، جنسية.',
        damage: 20,
      },
      {
        questionEs: 'La fiesta ___ en mi casa.',
        questionAr: 'الحفلة ___ في بيتي.',
        options: ['es', 'está', 'tiene', 'hay'],
        correctAnswer: 'es',
        explanationEs: 'SER para eventos. Los eventos usan SER, no ESTAR.',
        explanationAr: 'SER للأحداث. الأحداث تستخدم SER وليس ESTAR.',
        damage: 20,
      },
      {
        questionEs: 'Mi hermana ___ cansada.',
        questionAr: 'أختي ___ متعبة.',
        options: ['es', 'está', 'tiene', 'son'],
        correctAnswer: 'está',
        explanationEs: 'ESTAR para estados temporales: cansada, feliz, enferma.',
        explanationAr: 'ESTAR للحالات المؤقتة: متعبة، سعيدة، مريضة.',
        damage: 20,
      },
      {
        questionEs: 'El libro ___ en la mesa.',
        questionAr: 'الكتاب ___ على الطاولة.',
        options: ['es', 'está', 'son', 'están'],
        correctAnswer: 'está',
        explanationEs: 'ESTAR para ubicación/localización.',
        explanationAr: 'ESTAR للموقع/المكان.',
        damage: 20,
      },
      {
        questionEs: 'Madrid ___ la capital de España.',
        questionAr: 'مدريد ___ عاصمة إسبانيا.',
        options: ['es', 'está', 'son', 'están'],
        correctAnswer: 'es',
        explanationEs: 'SER para definiciones y hechos permanentes.',
        explanationAr: 'SER للتعريفات والحقائق الدائمة.',
        damage: 20,
      },
      {
        questionEs: 'Nosotros ___ contentos con el resultado.',
        questionAr: 'نحن ___ سعداء بالنتيجة.',
        options: ['somos', 'estamos', 'tenemos', 'hacemos'],
        correctAnswer: 'estamos',
        explanationEs: 'ESTAR para emociones temporales.',
        explanationAr: 'ESTAR للمشاعر المؤقتة.',
        damage: 20,
      },
    ],
  },
  {
    id: 'boss-preterito',
    name: 'El Fantasma del Pretérito',
    nameAr: 'شبح الماضي البسيط',
    icon: '👻',
    level: 'A2-B1',
    description: 'Vanquish the ghost with past tense mastery!',
    descriptionAr: 'أبِد الشبح بإتقان صيغة الماضي!',
    maxHp: 120,
    xpReward: 100,
    topic: 'Pretérito Indefinido',
    questions: [
      {
        questionEs: 'Ayer yo ___ al cine. (ir)',
        questionAr: 'أمس أنا ___ إلى السينما. (ذهب)',
        options: ['fui', 'iba', 'voy', 'iré'],
        correctAnswer: 'fui',
        explanationEs: '"Ir" en pretérito indefinido: fui, fuiste, fue, fuimos, fuisteis, fueron.',
        explanationAr: '"Ir" في الماضي البسيط: fui, fuiste, fue, fuimos, fuisteis, fueron.',
        damage: 20,
      },
      {
        questionEs: 'Ella ___ la puerta. (abrir)',
        questionAr: 'هي ___ الباب. (فتح)',
        options: ['abrió', 'abría', 'abre', 'abrirá'],
        correctAnswer: 'abrió',
        explanationEs: 'Verbos -ir en pretérito: -í, -iste, -ió, -imos, -isteis, -ieron.',
        explanationAr: 'أفعال -ir في الماضي: -í, -iste, -ió, -imos, -isteis, -ieron.',
        damage: 20,
      },
      {
        questionEs: 'Nosotros ___ en un restaurante. (comer)',
        questionAr: 'نحن ___ في مطعم. (أكل)',
        options: ['comimos', 'comíamos', 'comemos', 'comeremos'],
        correctAnswer: 'comimos',
        explanationEs: 'Verbos -er en pretérito: -í, -iste, -ió, -imos, -isteis, -ieron.',
        explanationAr: 'أفعال -er في الماضي: -í, -iste, -ió, -imos, -isteis, -ieron.',
        damage: 20,
      },
      {
        questionEs: 'Tú ___ mucho ayer. (estudiar)',
        questionAr: 'أنت ___ كثيرًا أمس. (درس)',
        options: ['estudiaste', 'estudiabas', 'estudias', 'estudiarás'],
        correctAnswer: 'estudiaste',
        explanationEs: 'Verbos -ar en pretérito: -é, -aste, -ó, -amos, -asteis, -aron.',
        explanationAr: 'أفعال -ar في الماضي: -é, -aste, -ó, -amos, -asteis, -aron.',
        damage: 20,
      },
      {
        questionEs: 'Ellos ___ la verdad. (decir)',
        questionAr: 'هم ___ الحقيقة. (قال)',
        options: ['dijeron', 'decían', 'dicen', 'dirán'],
        correctAnswer: 'dijeron',
        explanationEs: '"Decir" es irregular en pretérito: dije, dijiste, dijo, dijimos, dijisteis, dijeron.',
        explanationAr: '"Decir" شاذ في الماضي: dije, dijiste, dijo, dijimos, dijisteis, dijeron.',
        damage: 20,
      },
      {
        questionEs: 'Yo ___ un regalo para ella. (hacer)',
        questionAr: 'أنا ___ هدية لها. (صنع)',
        options: ['hice', 'hacía', 'hago', 'haré'],
        correctAnswer: 'hice',
        explanationEs: '"Hacer" es irregular: hice, hiciste, hizo, hicimos, hicisteis, hicieron.',
        explanationAr: '"Hacer" شاذ: hice, hiciste, hizo, hicimos, hicisteis, hicieron.',
        damage: 20,
      },
    ],
  },
  {
    id: 'boss-subjuntivo',
    name: 'El Rey del Subjuntivo',
    nameAr: 'ملك صيغة الشك',
    icon: '👑',
    level: 'B1-B2',
    description: 'The hardest boss! Master the Subjunctive mood!',
    descriptionAr: 'أصعب زعيم! أتقن صيغة الشك (Subjuntivo)!',
    maxHp: 150,
    xpReward: 150,
    topic: 'Subjuntivo',
    questions: [
      {
        questionEs: 'Espero que tú ___ bien. (estar)',
        questionAr: 'آمل أن تكون ___ بخير. (يكون)',
        options: ['estés', 'estás', 'eres', 'seas'],
        correctAnswer: 'estés',
        explanationEs: 'Después de "esperar que" se usa el subjuntivo.',
        explanationAr: 'بعد "esperar que" (أتمنى أن) نستخدم صيغة الشك.',
        damage: 25,
      },
      {
        questionEs: 'Quiero que él ___ la verdad. (decir)',
        questionAr: 'أريد منه أن ___ الحقيقة. (يقول)',
        options: ['diga', 'dice', 'decir', 'dijo'],
        correctAnswer: 'diga',
        explanationEs: '"Querer que" + subjuntivo. "Decir" → diga.',
        explanationAr: '"Querer que" + صيغة الشك. "Decir" → diga.',
        damage: 25,
      },
      {
        questionEs: 'Es importante que nosotros ___ español. (hablar)',
        questionAr: 'من المهم أن ___ الإسبانية. (نتحدث)',
        options: ['hablemos', 'hablamos', 'hablar', 'hablábamos'],
        correctAnswer: 'hablemos',
        explanationEs: '"Es importante que" + subjuntivo.',
        explanationAr: '"Es importante que" + صيغة الشك.',
        damage: 25,
      },
      {
        questionEs: 'Dudo que ellos ___ la respuesta. (saber)',
        questionAr: 'أشك أنهم ___ الإجابة. (يعرفون)',
        options: ['sepan', 'saben', 'saber', 'sabían'],
        correctAnswer: 'sepan',
        explanationEs: '"Dudar que" + subjuntivo. "Saber" → sepa.',
        explanationAr: '"Dudar que" (أشك أن) + صيغة الشك. "Saber" → sepa.',
        damage: 25,
      },
      {
        questionEs: 'Cuando ___ a España, visitaré Barcelona. (ir)',
        questionAr: 'عندما ___ إلى إسبانيا، سأزور برشلونة. (أذهب)',
        options: ['vaya', 'voy', 'fui', 'iré'],
        correctAnswer: 'vaya',
        explanationEs: '"Cuando" + futuro requiere subjuntivo.',
        explanationAr: '"Cuando" مع المستقبل يتطلب صيغة الشك.',
        damage: 25,
      },
      {
        questionEs: 'No creo que ___ fácil. (ser)',
        questionAr: 'لا أعتقد أنه ___ سهل. (يكون)',
        options: ['sea', 'es', 'fue', 'será'],
        correctAnswer: 'sea',
        explanationEs: '"No creer que" + subjuntivo (negación + opinión).',
        explanationAr: '"No creer que" + صيغة الشك (نفي + رأي).',
        damage: 25,
      },
    ],
  },
];
