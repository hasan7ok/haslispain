export interface Zone {
  id: string;
  name: string;
  nameEs: string;
  icon: string;
  description: string;
  descriptionAr: string;
  level: string;
  requiredLevel: number;
  glowClass: string;
  lessons: ZoneLesson[];
  games: GameInfo[];
}

export interface ZoneLesson {
  id: string;
  title: string;
  titleAr: string;
  type: 'vocabulary' | 'grammar' | 'culture' | 'conversation';
  xpReward: number;
  icon: string;
}

export interface GameInfo {
  id: string;
  title: string;
  titleAr: string;
  type: 'sentence-forge' | 'word-hunt';
  icon: string;
  xpReward: number;
}

export const ZONES: Zone[] = [
  {
    id: 'pueblo',
    name: 'Pueblo',
    nameEs: 'El Pueblo',
    icon: '🏡',
    description: 'Beginner (A1)',
    descriptionAr: 'مبتدئ - تعلم الأساسيات',
    level: 'A1',
    requiredLevel: 1,
    glowClass: 'zone-glow-green',
    lessons: [
      { id: 'pueblo-1', title: 'Saludos y Presentaciones', titleAr: 'التحيات والتعارف', type: 'vocabulary', xpReward: 25, icon: '👋' },
      { id: 'pueblo-2', title: 'Números y Colores', titleAr: 'الأرقام والألوان', type: 'vocabulary', xpReward: 25, icon: '🔢' },
      { id: 'pueblo-3', title: 'La Familia', titleAr: 'العائلة', type: 'vocabulary', xpReward: 30, icon: '👨‍👩‍👧‍👦' },
      { id: 'pueblo-4', title: 'En el Restaurante', titleAr: 'في المطعم', type: 'conversation', xpReward: 35, icon: '🍽️' },
      { id: 'pueblo-5', title: 'Artículos y Género', titleAr: 'أدوات التعريف والجنس', type: 'grammar', xpReward: 30, icon: '📝' },
    ],
    games: [
      { id: 'pueblo-sf', title: 'Sentence Forge', titleAr: 'تركيب الجمل', type: 'sentence-forge', icon: '⚔️', xpReward: 40 },
      { id: 'pueblo-wh', title: 'Word Hunt', titleAr: 'صيد الكلمات', type: 'word-hunt', icon: '🎯', xpReward: 35 },
    ],
  },
  {
    id: 'ciudad',
    name: 'Ciudad',
    nameEs: 'La Ciudad',
    icon: '🏙️',
    description: 'Intermediate (A2–B1)',
    descriptionAr: 'متوسط - وسّع مفرداتك',
    level: 'A2-B1',
    requiredLevel: 2,
    glowClass: 'zone-glow-gold',
    lessons: [
      { id: 'ciudad-1', title: 'Rutina Diaria', titleAr: 'الروتين اليومي', type: 'vocabulary', xpReward: 35, icon: '☀️' },
      { id: 'ciudad-2', title: 'De Compras', titleAr: 'التسوق', type: 'conversation', xpReward: 35, icon: '🛍️' },
      { id: 'ciudad-3', title: 'El Tiempo y Clima', titleAr: 'الطقس والمناخ', type: 'vocabulary', xpReward: 30, icon: '🌤️' },
      { id: 'ciudad-4', title: 'Ser vs Estar', titleAr: 'الفرق بين Ser و Estar', type: 'grammar', xpReward: 40, icon: '🧠' },
      { id: 'ciudad-5', title: 'Pretérito Perfecto', titleAr: 'الماضي التام', type: 'grammar', xpReward: 45, icon: '⏰' },
    ],
    games: [
      { id: 'ciudad-sf', title: 'Sentence Forge', titleAr: 'تركيب الجمل', type: 'sentence-forge', icon: '⚔️', xpReward: 50 },
      { id: 'ciudad-wh', title: 'Word Hunt', titleAr: 'صيد الكلمات', type: 'word-hunt', icon: '🎯', xpReward: 45 },
    ],
  },
  {
    id: 'historia',
    name: 'Historia',
    nameEs: 'La Historia',
    icon: '📜',
    description: 'Culture & History',
    descriptionAr: 'ثقافة وتاريخ إسبانيا',
    level: 'Culture',
    requiredLevel: 3,
    glowClass: 'zone-glow-orange',
    lessons: [
      { id: 'hist-1', title: 'Fiestas Españolas', titleAr: 'الأعياد الإسبانية', type: 'culture', xpReward: 30, icon: '🎉' },
      { id: 'hist-2', title: 'Comida y Tradiciones', titleAr: 'الطعام والتقاليد', type: 'culture', xpReward: 30, icon: '🥘' },
      { id: 'hist-3', title: 'Modales y Costumbres', titleAr: 'الآداب والعادات', type: 'culture', xpReward: 35, icon: '🤝' },
    ],
    games: [
      { id: 'hist-wh', title: 'Culture Quest', titleAr: 'مهمة ثقافية', type: 'word-hunt', icon: '🏛️', xpReward: 40 },
    ],
  },
  {
    id: 'latino',
    name: 'Latino World',
    nameEs: 'Mundo Latino',
    icon: '🌎',
    description: 'Latin America',
    descriptionAr: 'اكتشف أمريكا اللاتينية',
    level: 'B1-B2',
    requiredLevel: 4,
    glowClass: 'zone-glow-blue',
    lessons: [
      { id: 'lat-1', title: 'España vs Latinoamérica', titleAr: 'إسبانيا مقابل أمريكا اللاتينية', type: 'vocabulary', xpReward: 40, icon: '🗺️' },
      { id: 'lat-2', title: 'Modismos y Jerga', titleAr: 'التعبيرات الاصطلاحية', type: 'vocabulary', xpReward: 45, icon: '💬' },
      { id: 'lat-3', title: 'Voseo y Tuteo', titleAr: 'Voseo و Tuteo', type: 'grammar', xpReward: 40, icon: '🗣️' },
    ],
    games: [
      { id: 'lat-sf', title: 'Dialect Forge', titleAr: 'تحدي اللهجات', type: 'sentence-forge', icon: '🔥', xpReward: 55 },
    ],
  },
  {
    id: 'debate',
    name: 'Debate Zone',
    nameEs: 'Zona de Debate',
    icon: '🧠',
    description: 'Advanced (B2–C1)',
    descriptionAr: 'متقدم - النقاش والجدال',
    level: 'B2-C1',
    requiredLevel: 5,
    glowClass: 'zone-glow-purple',
    lessons: [
      { id: 'deb-1', title: 'Opiniones y Argumentos', titleAr: 'الآراء والحجج', type: 'conversation', xpReward: 50, icon: '💡' },
      { id: 'deb-2', title: 'El Subjuntivo', titleAr: 'صيغة الشك (Subjuntivo)', type: 'grammar', xpReward: 55, icon: '🎭' },
      { id: 'deb-3', title: 'Expresiones Formales', titleAr: 'التعبيرات الرسمية', type: 'vocabulary', xpReward: 50, icon: '🎩' },
    ],
    games: [
      { id: 'deb-sf', title: 'Boss Battle', titleAr: 'معركة الزعيم', type: 'sentence-forge', icon: '👹', xpReward: 60 },
    ],
  },
  {
    id: 'negocios',
    name: 'Negocios',
    nameEs: 'El Mundo de Negocios',
    icon: '💼',
    description: 'Business Spanish (C1)',
    descriptionAr: 'الإسبانية في عالم الأعمال',
    level: 'C1',
    requiredLevel: 6,
    glowClass: 'zone-glow-gold',
    lessons: [
      { id: 'neg-1', title: 'Vocabulario de Negocios', titleAr: 'مفردات الأعمال', type: 'vocabulary', xpReward: 55, icon: '📊' },
      { id: 'neg-2', title: 'Correos Electrónicos Formales', titleAr: 'البريد الإلكتروني الرسمي', type: 'conversation', xpReward: 50, icon: '📧' },
      { id: 'neg-3', title: 'Presentaciones Profesionales', titleAr: 'العروض التقديمية المهنية', type: 'conversation', xpReward: 55, icon: '🎤' },
      { id: 'neg-4', title: 'Condicional y Futuro Perfecto', titleAr: 'الشرطي والمستقبل التام', type: 'grammar', xpReward: 60, icon: '📐' },
      { id: 'neg-5', title: 'Negociación y Persuasión', titleAr: 'التفاوض والإقناع', type: 'conversation', xpReward: 60, icon: '🤝' },
    ],
    games: [
      { id: 'neg-sf', title: 'Business Forge', titleAr: 'تحدي الأعمال', type: 'sentence-forge', icon: '💰', xpReward: 65 },
      { id: 'neg-wh', title: 'Office Hunt', titleAr: 'صيد المكتب', type: 'word-hunt', icon: '🏢', xpReward: 55 },
    ],
  },
  {
    id: 'literatura',
    name: 'Literatura',
    nameEs: 'La Literatura',
    icon: '📚',
    description: 'Literature & Poetry (C1-C2)',
    descriptionAr: 'الأدب والشعر الإسباني',
    level: 'C1-C2',
    requiredLevel: 7,
    glowClass: 'zone-glow-orange',
    lessons: [
      { id: 'lit-1', title: 'Don Quijote — Fragmentos', titleAr: 'دون كيشوت — مقتطفات', type: 'culture', xpReward: 60, icon: '🗡️' },
      { id: 'lit-2', title: 'Poesía de Neruda y Lorca', titleAr: 'شعر نيرودا ولوركا', type: 'culture', xpReward: 55, icon: '🌹' },
      { id: 'lit-3', title: 'Refranes y Proverbios', titleAr: 'الأمثال والحكم', type: 'vocabulary', xpReward: 50, icon: '💎' },
      { id: 'lit-4', title: 'El Subjuntivo Imperfecto', titleAr: 'الماضي الناقص للشك', type: 'grammar', xpReward: 65, icon: '🎓' },
      { id: 'lit-5', title: 'Escritura Creativa', titleAr: 'الكتابة الإبداعية', type: 'conversation', xpReward: 60, icon: '✍️' },
    ],
    games: [
      { id: 'lit-sf', title: 'Literary Forge', titleAr: 'تحدي الأدب', type: 'sentence-forge', icon: '📜', xpReward: 70 },
      { id: 'lit-wh', title: 'Poetry Hunt', titleAr: 'صيد الشعر', type: 'word-hunt', icon: '🎭', xpReward: 60 },
    ],
  },
];
