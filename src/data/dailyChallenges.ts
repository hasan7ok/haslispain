export interface DailyChallenge {
  id: string;
  type: 'translate' | 'fill-blank' | 'correct-sentence' | 'match';
  questionEs: string;
  questionAr: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  explanationAr: string;
  xpReward: number;
  level: string;
}

// Rotating daily challenges pool
export const DAILY_CHALLENGES_POOL: DailyChallenge[] = [
  {
    id: 'dc-1',
    type: 'translate',
    questionEs: '¿Cómo se dice "أنا سعيد" en español?',
    questionAr: 'كيف تقول "أنا سعيد" بالإسبانية؟',
    options: ['Estoy feliz', 'Soy feliz', 'Tengo feliz', 'Hago feliz'],
    correctAnswer: 'Estoy feliz',
    explanation: '"Estoy feliz" because happiness is a temporary state (ESTAR).',
    explanationAr: '"Estoy feliz" لأن السعادة حالة مؤقتة (ESTAR).',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-2',
    type: 'fill-blank',
    questionEs: 'Yo ___ estudiante. (ser)',
    questionAr: 'أنا ___ طالب. (يكون - دائم)',
    options: ['soy', 'estoy', 'tengo', 'hago'],
    correctAnswer: 'soy',
    explanation: '"Soy" because being a student is a permanent identity (SER).',
    explanationAr: '"Soy" لأن كونك طالب هوية دائمة (SER).',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-3',
    type: 'correct-sentence',
    questionEs: '¿Cuál es la oración correcta?',
    questionAr: 'ما هي الجملة الصحيحة؟',
    options: ['Me gusta los gatos', 'Me gustan los gatos', 'Me gusto los gatos', 'Yo gusto los gatos'],
    correctAnswer: 'Me gustan los gatos',
    explanation: '"Gustan" (plural) because "los gatos" is plural. The verb agrees with what is liked.',
    explanationAr: '"gustan" (جمع) لأن "los gatos" جمع. الفعل يتوافق مع الشيء المحبوب.',
    xpReward: 20,
    level: 'A2',
  },
  {
    id: 'dc-4',
    type: 'translate',
    questionEs: '¿Cómo se dice "أين الحمام؟" en español?',
    questionAr: 'كيف تقول "أين الحمام؟" بالإسبانية؟',
    options: ['¿Dónde está el baño?', '¿Qué es el baño?', '¿Cómo está el baño?', '¿Cuándo es el baño?'],
    correctAnswer: '¿Dónde está el baño?',
    explanation: '"¿Dónde está...?" = Where is...? Essential travel phrase!',
    explanationAr: '"¿Dónde está...?" = أين...؟ عبارة أساسية للسفر!',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-5',
    type: 'fill-blank',
    questionEs: 'Ayer yo ___ al cine. (ir - pasado)',
    questionAr: 'أمس أنا ___ إلى السينما. (ذهب - ماضي)',
    options: ['fui', 'iba', 'voy', 'iré'],
    correctAnswer: 'fui',
    explanation: '"Fui" is the preterite (past) form of "ir" (to go) for "yo".',
    explanationAr: '"Fui" هو صيغة الماضي البسيط للفعل "ir" (يذهب) مع "yo".',
    xpReward: 20,
    level: 'A2',
  },
  {
    id: 'dc-6',
    type: 'correct-sentence',
    questionEs: '¿Cuál es la traducción correcta de "الكتاب على الطاولة"?',
    questionAr: 'ما هي الترجمة الصحيحة لـ "الكتاب على الطاولة"؟',
    options: ['El libro es en la mesa', 'El libro está en la mesa', 'El libro tiene la mesa', 'El libro hay la mesa'],
    correctAnswer: 'El libro está en la mesa',
    explanation: '"Está" for location (temporary position). "Es" would be wrong here.',
    explanationAr: '"Está" للموقع (مكان مؤقت). "Es" ستكون خاطئة هنا.',
    xpReward: 20,
    level: 'A1',
  },
  {
    id: 'dc-7',
    type: 'translate',
    questionEs: '¿Qué significa "Tengo hambre"?',
    questionAr: 'ما معنى "Tengo hambre"؟',
    options: ['أنا جائع', 'أنا حزين', 'أنا متعب', 'أنا مريض'],
    correctAnswer: 'أنا جائع',
    explanation: '"Tener hambre" = to be hungry. In Spanish you "have hunger" not "are hungry"!',
    explanationAr: '"Tener hambre" = أن تكون جائعًا. بالإسبانية "تملك الجوع" وليس "أنت جائع"!',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-8',
    type: 'fill-blank',
    questionEs: 'Ella ___ muy cansada hoy. (estar)',
    questionAr: 'هي ___ متعبة جدًا اليوم. (يكون - مؤقت)',
    options: ['está', 'es', 'tiene', 'hace'],
    correctAnswer: 'está',
    explanation: '"Está" because tiredness is a temporary state (ESTAR, not SER).',
    explanationAr: '"Está" لأن التعب حالة مؤقتة (ESTAR وليس SER).',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-9',
    type: 'correct-sentence',
    questionEs: 'Elige la forma correcta del verbo:',
    questionAr: 'اختر الشكل الصحيح للفعل:',
    options: ['Nosotros hablamos español', 'Nosotros hablan español', 'Nosotros hablas español', 'Nosotros hablo español'],
    correctAnswer: 'Nosotros hablamos español',
    explanation: '"Hablamos" is the correct conjugation for "nosotros" (we).',
    explanationAr: '"Hablamos" هو التصريف الصحيح لـ "nosotros" (نحن).',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-10',
    type: 'translate',
    questionEs: '¿Cómo se dice "كم الساعة؟" en español?',
    questionAr: 'كيف تقول "كم الساعة؟" بالإسبانية؟',
    options: ['¿Qué hora es?', '¿Cuánto hora es?', '¿Dónde hora es?', '¿Cómo hora es?'],
    correctAnswer: '¿Qué hora es?',
    explanation: '"¿Qué hora es?" literally = What hour is it? Standard way to ask time.',
    explanationAr: '"¿Qué hora es?" حرفيًا = ما هي الساعة؟ الطريقة القياسية لسؤال الوقت.',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-11',
    type: 'fill-blank',
    questionEs: 'El niño ___ jugando en el parque. (estar)',
    questionAr: 'الطفل ___ يلعب في الحديقة. (يكون)',
    options: ['está', 'es', 'hay', 'tiene'],
    correctAnswer: 'está',
    explanation: '"Está" with gerund (-ando/-iendo) forms the present continuous.',
    explanationAr: '"Está" مع صيغة الجيروند (-ando/-iendo) يشكل المضارع المستمر.',
    xpReward: 20,
    level: 'A2',
  },
  {
    id: 'dc-12',
    type: 'translate',
    questionEs: '¿Qué significa "hace frío"?',
    questionAr: 'ما معنى "hace frío"؟',
    options: ['الجو بارد', 'الجو حار', 'أنا بارد', 'يصنع بارد'],
    correctAnswer: 'الجو بارد',
    explanation: '"Hacer" is used for weather. "Hace frío" = It\'s cold. "Hace calor" = It\'s hot.',
    explanationAr: '"Hacer" يُستخدم للطقس. "Hace frío" = الجو بارد. "Hace calor" = الجو حار.',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-13',
    type: 'correct-sentence',
    questionEs: '¿Cuál es correcta?',
    questionAr: 'أيها الصحيحة؟',
    options: ['Yo tengo 25 años', 'Yo soy 25 años', 'Yo estoy 25 años', 'Yo hago 25 años'],
    correctAnswer: 'Yo tengo 25 años',
    explanation: 'In Spanish, you "have" years (tener años), not "are" years!',
    explanationAr: 'بالإسبانية "تملك" سنوات (tener años) وليس "أنت" سنوات!',
    xpReward: 15,
    level: 'A1',
  },
  {
    id: 'dc-14',
    type: 'fill-blank',
    questionEs: '¿___ hablas inglés? — Sí, un poco.',
    questionAr: 'هل ___ الإنجليزية؟ — نعم، قليلاً.',
    options: ['Tú', 'Él', 'Nosotros', 'Ellos'],
    correctAnswer: 'Tú',
    explanation: '"Hablas" ends in -as, which is the "tú" (you informal) conjugation.',
    explanationAr: '"Hablas" ينتهي بـ -as، وهو تصريف "tú" (أنت غير رسمي).',
    xpReward: 15,
    level: 'A1',
  },
];

export function getDailyChallenge(): DailyChallenge[] {
  // Use date as seed to get consistent daily challenges
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const challenges: DailyChallenge[] = [];
  const pool = [...DAILY_CHALLENGES_POOL];
  
  // Pick 3 challenges for today based on day of year
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = (dayOfYear * 7 + i * 13) % pool.length;
    challenges.push(pool[idx]);
    pool.splice(idx, 1);
  }
  
  return challenges;
}
