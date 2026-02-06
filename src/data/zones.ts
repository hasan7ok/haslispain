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
    requiredLevel: 3,
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
    requiredLevel: 5,
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
    requiredLevel: 7,
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
    requiredLevel: 10,
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
];
