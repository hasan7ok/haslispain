export interface VocabItem {
  word: string;
  translation: string;
  translationAr: string;
  example: string;
  exampleTranslation: string;
}

export interface LessonContent {
  id: string;
  intro: string;
  introAr: string;
  tip?: string;
  tipAr?: string;
  vocabulary: VocabItem[];
}

export interface SentenceChallenge {
  targetSentence: string;
  translation: string;
  translationAr: string;
  words: string[];
  level: string;
}

export interface WordHuntChallenge {
  sentence: string;
  sentenceAr: string;
  blank: string;
  options: string[];
  correct: string;
  level: string;
}

export const LESSONS: Record<string, LessonContent> = {
  'pueblo-1': {
    id: 'pueblo-1',
    intro: '¡Hola! Let\'s learn Spanish greetings — the first step to connecting with people!',
    introAr: 'مرحبًا! لنتعلم التحيات الإسبانية — الخطوة الأولى للتواصل مع الناس!',
    tip: 'In Spain, people often greet with two kisses on the cheek. In Latin America, it\'s usually one.',
    tipAr: 'في إسبانيا، يحيّي الناس بقبلتين على الخد. في أمريكا اللاتينية، عادةً واحدة فقط.',
    vocabulary: [
      { word: 'Hola', translation: 'Hello', translationAr: 'مرحبًا', example: '¡Hola! ¿Cómo estás?', exampleTranslation: 'Hello! How are you?' },
      { word: 'Buenos días', translation: 'Good morning', translationAr: 'صباح الخير', example: 'Buenos días, señor García.', exampleTranslation: 'Good morning, Mr. García.' },
      { word: 'Buenas tardes', translation: 'Good afternoon', translationAr: 'مساء الخير', example: 'Buenas tardes, ¿cómo está usted?', exampleTranslation: 'Good afternoon, how are you?' },
      { word: 'Buenas noches', translation: 'Good night', translationAr: 'تصبح على خير', example: 'Buenas noches, hasta mañana.', exampleTranslation: 'Good night, see you tomorrow.' },
      { word: 'Adiós', translation: 'Goodbye', translationAr: 'وداعًا', example: '¡Adiós, amigo!', exampleTranslation: 'Goodbye, friend!' },
      { word: 'Por favor', translation: 'Please', translationAr: 'من فضلك', example: 'Un café, por favor.', exampleTranslation: 'A coffee, please.' },
      { word: 'Gracias', translation: 'Thank you', translationAr: 'شكرًا', example: '¡Muchas gracias por tu ayuda!', exampleTranslation: 'Thank you very much for your help!' },
      { word: 'De nada', translation: 'You\'re welcome', translationAr: 'عفوًا', example: '—Gracias. —De nada.', exampleTranslation: '—Thank you. —You\'re welcome.' },
      { word: 'Me llamo', translation: 'My name is', translationAr: 'اسمي', example: 'Me llamo Carlos. ¿Y tú?', exampleTranslation: 'My name is Carlos. And you?' },
      { word: 'Mucho gusto', translation: 'Nice to meet you', translationAr: 'تشرفت بمعرفتك', example: '¡Mucho gusto! Soy María.', exampleTranslation: 'Nice to meet you! I\'m María.' },
    ],
  },
  'pueblo-2': {
    id: 'pueblo-2',
    intro: 'Numbers and colors are everywhere! Let\'s master them in Spanish.',
    introAr: 'الأرقام والألوان في كل مكان! لنتقنها بالإسبانية.',
    vocabulary: [
      { word: 'Uno', translation: 'One', translationAr: 'واحد', example: 'Tengo un gato.', exampleTranslation: 'I have one cat.' },
      { word: 'Dos', translation: 'Two', translationAr: 'اثنان', example: 'Dos cafés, por favor.', exampleTranslation: 'Two coffees, please.' },
      { word: 'Tres', translation: 'Three', translationAr: 'ثلاثة', example: 'Hay tres libros en la mesa.', exampleTranslation: 'There are three books on the table.' },
      { word: 'Rojo', translation: 'Red', translationAr: 'أحمر', example: 'El coche es rojo.', exampleTranslation: 'The car is red.' },
      { word: 'Azul', translation: 'Blue', translationAr: 'أزرق', example: 'El cielo es azul.', exampleTranslation: 'The sky is blue.' },
      { word: 'Verde', translation: 'Green', translationAr: 'أخضر', example: 'Me gusta el color verde.', exampleTranslation: 'I like the color green.' },
      { word: 'Amarillo', translation: 'Yellow', translationAr: 'أصفر', example: 'Las flores son amarillas.', exampleTranslation: 'The flowers are yellow.' },
      { word: 'Negro', translation: 'Black', translationAr: 'أسود', example: 'Llevo una camisa negra.', exampleTranslation: 'I\'m wearing a black shirt.' },
      { word: 'Blanco', translation: 'White', translationAr: 'أبيض', example: 'La nieve es blanca.', exampleTranslation: 'The snow is white.' },
      { word: 'Diez', translation: 'Ten', translationAr: 'عشرة', example: 'Tengo diez años.', exampleTranslation: 'I am ten years old.' },
    ],
  },
  'pueblo-3': {
    id: 'pueblo-3',
    intro: 'Family is everything in Spanish culture! Learn the family members.',
    introAr: 'العائلة هي كل شيء في الثقافة الإسبانية! تعلم أفراد العائلة.',
    tip: 'In Spain, children take both parents\' surnames. So "María García López" takes García from her father and López from her mother.',
    tipAr: 'في إسبانيا، يأخذ الأطفال لقب كلا الوالدين. مثلاً "ماريا غارسيا لوبيز" تأخذ غارسيا من أبيها ولوبيز من أمها.',
    vocabulary: [
      { word: 'Madre / Mamá', translation: 'Mother / Mom', translationAr: 'أم / ماما', example: 'Mi madre cocina muy bien.', exampleTranslation: 'My mother cooks very well.' },
      { word: 'Padre / Papá', translation: 'Father / Dad', translationAr: 'أب / بابا', example: 'Mi padre trabaja en un hospital.', exampleTranslation: 'My father works in a hospital.' },
      { word: 'Hermano', translation: 'Brother', translationAr: 'أخ', example: 'Tengo un hermano mayor.', exampleTranslation: 'I have an older brother.' },
      { word: 'Hermana', translation: 'Sister', translationAr: 'أخت', example: 'Mi hermana estudia medicina.', exampleTranslation: 'My sister studies medicine.' },
      { word: 'Abuelo', translation: 'Grandfather', translationAr: 'جد', example: 'Mi abuelo tiene 80 años.', exampleTranslation: 'My grandfather is 80 years old.' },
      { word: 'Abuela', translation: 'Grandmother', translationAr: 'جدة', example: 'Mi abuela hace el mejor pastel.', exampleTranslation: 'My grandmother makes the best cake.' },
      { word: 'Hijo', translation: 'Son', translationAr: 'ابن', example: 'Él es mi hijo menor.', exampleTranslation: 'He is my youngest son.' },
      { word: 'Hija', translation: 'Daughter', translationAr: 'ابنة', example: 'Mi hija tiene cinco años.', exampleTranslation: 'My daughter is five years old.' },
    ],
  },
  'pueblo-4': {
    id: 'pueblo-4',
    intro: '¡Bienvenido al restaurante! Learn useful phrases for dining out.',
    introAr: 'مرحبًا بك في المطعم! تعلم عبارات مفيدة لتناول الطعام بالخارج.',
    tip: 'In Spain, lunch (la comida) is the main meal, usually from 2-4 PM. Dinner (la cena) is light, around 9-10 PM.',
    tipAr: 'في إسبانيا، الغداء هو الوجبة الرئيسية من 2 إلى 4 مساءً. العشاء خفيف حوالي 9-10 مساءً.',
    vocabulary: [
      { word: 'La cuenta', translation: 'The bill', translationAr: 'الحساب', example: 'La cuenta, por favor.', exampleTranslation: 'The bill, please.' },
      { word: 'Menú', translation: 'Menu', translationAr: 'قائمة الطعام', example: '¿Puedo ver el menú?', exampleTranslation: 'Can I see the menu?' },
      { word: 'Agua', translation: 'Water', translationAr: 'ماء', example: 'Un vaso de agua, por favor.', exampleTranslation: 'A glass of water, please.' },
      { word: 'Cerveza', translation: 'Beer', translationAr: 'بيرة', example: 'Una cerveza fría, por favor.', exampleTranslation: 'A cold beer, please.' },
      { word: 'Delicioso', translation: 'Delicious', translationAr: 'لذيذ', example: '¡La paella está deliciosa!', exampleTranslation: 'The paella is delicious!' },
      { word: 'Camarero', translation: 'Waiter', translationAr: 'نادل', example: '¡Camarero! ¿Puede ayudarme?', exampleTranslation: 'Waiter! Can you help me?' },
    ],
  },
  'pueblo-5': {
    id: 'pueblo-5',
    intro: 'Spanish nouns have gender! Every noun is either masculine or feminine.',
    introAr: 'الأسماء الإسبانية لها جنس! كل اسم إما مذكر أو مؤنث.',
    tip: 'General rule: words ending in -o are masculine (el libro), words ending in -a are feminine (la mesa). But there are exceptions like "el día" (day) and "la mano" (hand)!',
    tipAr: 'القاعدة العامة: الكلمات المنتهية بـ o مذكرة (el libro)، والمنتهية بـ a مؤنثة (la mesa). لكن هناك استثناءات مثل el día (اليوم) و la mano (اليد)!',
    vocabulary: [
      { word: 'El (artículo)', translation: 'The (masc.)', translationAr: 'أداة التعريف (مذكر)', example: 'El gato duerme.', exampleTranslation: 'The cat sleeps.' },
      { word: 'La (artículo)', translation: 'The (fem.)', translationAr: 'أداة التعريف (مؤنث)', example: 'La casa es grande.', exampleTranslation: 'The house is big.' },
      { word: 'Los (artículo)', translation: 'The (masc. pl.)', translationAr: 'أداة التعريف (مذكر جمع)', example: 'Los niños juegan.', exampleTranslation: 'The children play.' },
      { word: 'Las (artículo)', translation: 'The (fem. pl.)', translationAr: 'أداة التعريف (مؤنث جمع)', example: 'Las flores son bonitas.', exampleTranslation: 'The flowers are pretty.' },
      { word: 'Un / Una', translation: 'A / An', translationAr: 'أداة نكرة', example: 'Tengo un perro y una gata.', exampleTranslation: 'I have a dog and a cat.' },
    ],
  },
  'ciudad-1': {
    id: 'ciudad-1',
    intro: 'Let\'s learn about daily routines in Spanish!',
    introAr: 'لنتعلم عن الروتين اليومي بالإسبانية!',
    vocabulary: [
      { word: 'Despertarse', translation: 'To wake up', translationAr: 'يستيقظ', example: 'Me despierto a las siete.', exampleTranslation: 'I wake up at seven.' },
      { word: 'Ducharse', translation: 'To shower', translationAr: 'يستحم', example: 'Me ducho por la mañana.', exampleTranslation: 'I shower in the morning.' },
      { word: 'Desayunar', translation: 'To have breakfast', translationAr: 'يتناول الفطور', example: 'Desayuno café con tostadas.', exampleTranslation: 'I have coffee with toast for breakfast.' },
      { word: 'Trabajar', translation: 'To work', translationAr: 'يعمل', example: 'Trabajo de lunes a viernes.', exampleTranslation: 'I work Monday to Friday.' },
      { word: 'Acostarse', translation: 'To go to bed', translationAr: 'يذهب للنوم', example: 'Me acuesto a las once.', exampleTranslation: 'I go to bed at eleven.' },
    ],
  },
  'ciudad-4': {
    id: 'ciudad-4',
    intro: 'The famous Ser vs Estar! Both mean "to be" but they\'re used differently.',
    introAr: 'الشهيران Ser و Estar! كلاهما يعني "يكون" لكن يُستخدمان بشكل مختلف.',
    tip: 'SER = permanent/identity (nationality, profession, personality). ESTAR = temporary/state (mood, location, health).',
    tipAr: 'SER = دائم/هوية (جنسية، مهنة، شخصية). ESTAR = مؤقت/حالة (مزاج، موقع، صحة).',
    vocabulary: [
      { word: 'Soy', translation: 'I am (permanent)', translationAr: 'أنا (دائم)', example: 'Soy español.', exampleTranslation: 'I am Spanish.' },
      { word: 'Estoy', translation: 'I am (temporary)', translationAr: 'أنا (مؤقت)', example: 'Estoy cansado.', exampleTranslation: 'I am tired.' },
      { word: 'Es', translation: 'He/She is (permanent)', translationAr: 'هو/هي (دائم)', example: 'Ella es doctora.', exampleTranslation: 'She is a doctor.' },
      { word: 'Está', translation: 'He/She is (temporary)', translationAr: 'هو/هي (مؤقت)', example: 'Él está enfermo.', exampleTranslation: 'He is sick.' },
    ],
  },
};

export const SENTENCE_CHALLENGES: SentenceChallenge[] = [
  { targetSentence: 'Yo como una manzana', translation: 'I eat an apple', translationAr: 'أنا آكل تفاحة', words: ['una', 'Yo', 'manzana', 'como'], level: 'A1' },
  { targetSentence: 'Ella tiene un gato', translation: 'She has a cat', translationAr: 'هي تملك قطة', words: ['gato', 'tiene', 'un', 'Ella'], level: 'A1' },
  { targetSentence: 'Me llamo Carlos', translation: 'My name is Carlos', translationAr: 'اسمي كارلوس', words: ['Carlos', 'llamo', 'Me'], level: 'A1' },
  { targetSentence: 'Nosotros vivimos en Madrid', translation: 'We live in Madrid', translationAr: 'نحن نعيش في مدريد', words: ['Madrid', 'vivimos', 'en', 'Nosotros'], level: 'A1' },
  { targetSentence: 'Me gusta el café', translation: 'I like coffee', translationAr: 'أحب القهوة', words: ['café', 'gusta', 'el', 'Me'], level: 'A1' },
  { targetSentence: 'Buenos días señor', translation: 'Good morning sir', translationAr: 'صباح الخير سيدي', words: ['señor', 'días', 'Buenos'], level: 'A1' },
  { targetSentence: 'La casa es grande', translation: 'The house is big', translationAr: 'البيت كبير', words: ['grande', 'La', 'es', 'casa'], level: 'A1' },
  { targetSentence: 'Quiero un vaso de agua', translation: 'I want a glass of water', translationAr: 'أريد كوب ماء', words: ['agua', 'un', 'de', 'vaso', 'Quiero'], level: 'A1' },
  { targetSentence: 'Ella es muy inteligente', translation: 'She is very smart', translationAr: 'هي ذكية جدًا', words: ['inteligente', 'es', 'Ella', 'muy'], level: 'A2' },
  { targetSentence: 'Nosotros estudiamos español', translation: 'We study Spanish', translationAr: 'نحن ندرس الإسبانية', words: ['español', 'Nosotros', 'estudiamos'], level: 'A2' },
  { targetSentence: 'El restaurante está cerrado', translation: 'The restaurant is closed', translationAr: 'المطعم مغلق', words: ['cerrado', 'El', 'está', 'restaurante'], level: 'A2' },
  { targetSentence: 'Me despierto a las siete', translation: 'I wake up at seven', translationAr: 'أستيقظ الساعة السابعة', words: ['siete', 'a', 'Me', 'las', 'despierto'], level: 'A2' },
];

export const WORD_HUNT_CHALLENGES: WordHuntChallenge[] = [
  { sentence: 'Yo ___ español.', sentenceAr: 'أنا ___ الإسبانية.', blank: 'hablo', options: ['hablo', 'como', 'vivo', 'duermo'], correct: 'hablo', level: 'A1' },
  { sentence: 'Ella ___ muy bonita.', sentenceAr: 'هي ___ جميلة جدًا.', blank: 'es', options: ['es', 'está', 'tiene', 'hace'], correct: 'es', level: 'A1' },
  { sentence: 'Nosotros ___ en casa.', sentenceAr: 'نحن ___ في البيت.', blank: 'estamos', options: ['estamos', 'somos', 'tenemos', 'vamos'], correct: 'estamos', level: 'A1' },
  { sentence: '¿Cómo te ___?', sentenceAr: 'ما ___؟', blank: 'llamas', options: ['llamas', 'comes', 'vives', 'duermes'], correct: 'llamas', level: 'A1' },
  { sentence: 'Tengo mucha ___.', sentenceAr: 'لديّ ___ كثير.', blank: 'hambre', options: ['hambre', 'casa', 'libro', 'gato'], correct: 'hambre', level: 'A1' },
  { sentence: 'El libro ___ en la mesa.', sentenceAr: 'الكتاب ___ على الطاولة.', blank: 'está', options: ['está', 'es', 'tiene', 'come'], correct: 'está', level: 'A1' },
  { sentence: 'Me ___ la música.', sentenceAr: '___ الموسيقى.', blank: 'gusta', options: ['gusta', 'gusto', 'gustan', 'gustas'], correct: 'gusta', level: 'A2' },
  { sentence: 'Ayer ___ al cine.', sentenceAr: 'أمس ___ إلى السينما.', blank: 'fui', options: ['fui', 'voy', 'iba', 'iré'], correct: 'fui', level: 'A2' },
  { sentence: 'Ella ___ cansada hoy.', sentenceAr: 'هي ___ متعبة اليوم.', blank: 'está', options: ['está', 'es', 'tiene', 'hace'], correct: 'está', level: 'A2' },
  { sentence: 'Necesito ___ un taxi.', sentenceAr: 'أحتاج ___ سيارة أجرة.', blank: 'tomar', options: ['tomar', 'comer', 'beber', 'leer'], correct: 'tomar', level: 'A2' },
];
