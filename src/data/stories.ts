export interface StoryNode {
  id: string;
  textEs: string;
  textAr: string;
  speaker?: string;
  speakerIcon?: string;
  choices?: StoryChoice[];
  isEnd?: boolean;
  xpReward?: number;
}

export interface StoryChoice {
  textEs: string;
  textAr: string;
  nextId: string;
  isCorrect?: boolean;
  feedbackEs?: string;
  feedbackAr?: string;
}

export interface Story {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  level: string;
  description: string;
  descriptionAr: string;
  xpReward: number;
  nodes: StoryNode[];
}

export const STORIES: Story[] = [
  {
    id: 'story-cafe',
    title: 'En la Cafetería',
    titleAr: 'في المقهى',
    icon: '☕',
    level: 'A1',
    description: 'Order your first coffee in Spanish!',
    descriptionAr: 'اطلب قهوتك الأولى بالإسبانية!',
    xpReward: 50,
    nodes: [
      {
        id: 'start',
        textEs: '¡Buenos días! Bienvenido a nuestra cafetería. ¿Qué desea?',
        textAr: 'صباح الخير! مرحبًا بك في مقهانا. ماذا تريد؟',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        choices: [
          { textEs: 'Buenos días. Quiero un café, por favor.', textAr: 'صباح الخير. أريد قهوة، من فضلك.', nextId: 'correct1', isCorrect: true, feedbackAr: '✅ ممتاز! استخدمت التحية والطلب بشكل صحيح.' },
          { textEs: 'Hola. Yo necesito café.', textAr: 'مرحبًا. أنا أحتاج قهوة.', nextId: 'ok1', feedbackAr: '⚠️ جيد، لكن الأفضل استخدام "Quiero" مع "por favor" عند الطلب.' },
          { textEs: 'Dame café ahora.', textAr: 'أعطني قهوة الآن.', nextId: 'rude1', isCorrect: false, feedbackAr: '❌ هذا غير مهذب! في إسبانيا يجب أن تكون مهذبًا. استخدم "por favor".' },
        ],
      },
      {
        id: 'correct1',
        textEs: '¡Muy bien! ¿Lo quiere solo o con leche?',
        textAr: 'جيد جدًا! تريده سادة أم بالحليب؟',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        choices: [
          { textEs: 'Con leche, por favor.', textAr: 'بالحليب، من فضلك.', nextId: 'milk', isCorrect: true, feedbackAr: '✅ رائع! "con leche" = بالحليب' },
          { textEs: 'Solo, por favor.', textAr: 'سادة، من فضلك.', nextId: 'black', isCorrect: true, feedbackAr: '✅ ممتاز! "solo" = سادة/بدون حليب' },
        ],
      },
      {
        id: 'ok1',
        textEs: 'Claro. ¿Con leche o solo?',
        textAr: 'بالتأكيد. بحليب أم سادة؟',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        choices: [
          { textEs: 'Con leche, por favor.', textAr: 'بالحليب، من فضلك.', nextId: 'milk', isCorrect: true },
          { textEs: 'Solo, por favor.', textAr: 'سادة، من فضلك.', nextId: 'black', isCorrect: true },
        ],
      },
      {
        id: 'rude1',
        textEs: 'Perdone, pero aquí tratamos con respeto. ¿Puede decirlo con "por favor"?',
        textAr: 'عفوًا، لكن هنا نتعامل باحترام. هل يمكنك قولها مع "من فضلك"؟',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        choices: [
          { textEs: 'Lo siento. Un café, por favor.', textAr: 'آسف. قهوة، من فضلك.', nextId: 'correct1', isCorrect: true, feedbackAr: '✅ أحسنت! الاعتذار و"por favor" مهمان جدًا.' },
        ],
      },
      {
        id: 'milk',
        textEs: 'Aquí tiene su café con leche. Son dos euros con cincuenta.',
        textAr: 'تفضل قهوتك بالحليب. الحساب يورو ونصف.',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        choices: [
          { textEs: 'Aquí tiene. ¡Muchas gracias!', textAr: 'تفضل. شكرًا جزيلاً!', nextId: 'end', isCorrect: true, feedbackAr: '✅ رائع! "Muchas gracias" تعبير مهذب للشكر.' },
        ],
      },
      {
        id: 'black',
        textEs: 'Aquí tiene su café solo. Son un euro con ochenta.',
        textAr: 'تفضل قهوتك السادة. الحساب يورو وثمانون سنتًا.',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        choices: [
          { textEs: 'Gracias. ¡Está muy bueno!', textAr: 'شكرًا. لذيذ جدًا!', nextId: 'end', isCorrect: true, feedbackAr: '✅ ممتاز! لاحظ استخدام "Está" لأن الطعم حالة مؤقتة.' },
        ],
      },
      {
        id: 'end',
        textEs: '¡De nada! ¡Que tenga un buen día!',
        textAr: 'عفوًا! أتمنى لك يومًا سعيدًا!',
        speaker: 'النادل',
        speakerIcon: '👨‍🍳',
        isEnd: true,
        xpReward: 50,
      },
    ],
  },
  {
    id: 'story-hotel',
    title: 'En el Hotel',
    titleAr: 'في الفندق',
    icon: '🏨',
    level: 'A2',
    description: 'Check in at a hotel in Madrid',
    descriptionAr: 'سجّل دخولك في فندق بمدريد',
    xpReward: 60,
    nodes: [
      {
        id: 'start',
        textEs: 'Buenas tardes. Bienvenido al Hotel Sol. ¿Tiene una reserva?',
        textAr: 'مساء الخير. مرحبًا في فندق سول. هل لديك حجز؟',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        choices: [
          { textEs: 'Sí, tengo una reserva a nombre de...', textAr: 'نعم، لدي حجز باسم...', nextId: 'reservation', isCorrect: true, feedbackAr: '✅ "a nombre de" = باسم. تعبير مهم عند الحجز.' },
          { textEs: 'No, no tengo reserva. ¿Tienen habitaciones disponibles?', textAr: 'لا، ليس لدي حجز. هل لديكم غرف متاحة؟', nextId: 'noReservation', isCorrect: true, feedbackAr: '✅ "habitaciones disponibles" = غرف متاحة. سؤال مفيد!' },
        ],
      },
      {
        id: 'reservation',
        textEs: 'Perfecto. Su habitación es la 305, en el tercer piso. Aquí tiene la llave.',
        textAr: 'ممتاز. غرفتك هي 305، في الطابق الثالث. تفضل المفتاح.',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        choices: [
          { textEs: '¿A qué hora es el desayuno?', textAr: 'في أي ساعة الفطور؟', nextId: 'breakfast', isCorrect: true, feedbackAr: '✅ "¿A qué hora...?" = في أي ساعة...؟ سؤال مفيد جدًا!' },
          { textEs: '¿Tienen wifi gratis?', textAr: 'هل لديكم واي فاي مجاني؟', nextId: 'wifi', isCorrect: true, feedbackAr: '✅ سؤال عملي! "gratis" = مجاني.' },
        ],
      },
      {
        id: 'noReservation',
        textEs: 'Sí, tenemos una habitación doble con vistas a la ciudad. ¿Le interesa?',
        textAr: 'نعم، لدينا غرفة مزدوجة مطلة على المدينة. هل تهمك؟',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        choices: [
          { textEs: '¡Sí! ¿Cuánto cuesta por noche?', textAr: 'نعم! كم تكلف الليلة الواحدة؟', nextId: 'price', isCorrect: true, feedbackAr: '✅ "¿Cuánto cuesta?" = كم التكلفة؟' },
        ],
      },
      {
        id: 'breakfast',
        textEs: 'El desayuno es de 7 a 10 de la mañana, en el restaurante del primer piso.',
        textAr: 'الفطور من 7 إلى 10 صباحًا، في مطعم الطابق الأول.',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        choices: [
          { textEs: 'Muchas gracias. ¡Hasta luego!', textAr: 'شكرًا جزيلاً. إلى اللقاء!', nextId: 'end', isCorrect: true },
        ],
      },
      {
        id: 'wifi',
        textEs: 'Sí, el wifi es gratis. La contraseña está en la tarjeta de la habitación.',
        textAr: 'نعم، الواي فاي مجاني. كلمة المرور على بطاقة الغرفة.',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        choices: [
          { textEs: '¡Perfecto! Muchas gracias.', textAr: 'ممتاز! شكرًا جزيلاً.', nextId: 'end', isCorrect: true },
        ],
      },
      {
        id: 'price',
        textEs: 'Son ochenta euros por noche, con desayuno incluido.',
        textAr: 'ثمانون يورو لليلة الواحدة، مع فطور مشمول.',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        choices: [
          { textEs: 'Está bien. La tomo, por favor.', textAr: 'جيد. سآخذها، من فضلك.', nextId: 'end', isCorrect: true, feedbackAr: '✅ "La tomo" = سآخذها. تعبير مفيد عند الشراء أو الحجز.' },
        ],
      },
      {
        id: 'end',
        textEs: '¡Que disfrute de su estancia! Si necesita algo, llame a recepción.',
        textAr: 'استمتع بإقامتك! إذا احتجت شيئًا، اتصل بالاستقبال.',
        speaker: 'موظف الاستقبال',
        speakerIcon: '🧑‍💼',
        isEnd: true,
        xpReward: 60,
      },
    ],
  },
  {
    id: 'story-market',
    title: 'En el Mercado',
    titleAr: 'في السوق',
    icon: '🛒',
    level: 'A1',
    description: 'Go shopping at a Spanish market',
    descriptionAr: 'تسوّق في سوق إسباني',
    xpReward: 45,
    nodes: [
      {
        id: 'start',
        textEs: '¡Hola! Tenemos frutas frescas hoy. ¿Qué le pongo?',
        textAr: 'مرحبًا! لدينا فواكه طازجة اليوم. ماذا أحضر لك؟',
        speaker: 'البائع',
        speakerIcon: '👩‍🌾',
        choices: [
          { textEs: 'Quiero un kilo de manzanas, por favor.', textAr: 'أريد كيلو تفاح، من فضلك.', nextId: 'apples', isCorrect: true, feedbackAr: '✅ "un kilo de..." = كيلو من... طريقة شراء الفواكه.' },
          { textEs: '¿Cuánto cuestan las naranjas?', textAr: 'كم سعر البرتقال؟', nextId: 'oranges', isCorrect: true, feedbackAr: '✅ "¿Cuánto cuestan?" = كم يكلفن؟ (للجمع)' },
        ],
      },
      {
        id: 'apples',
        textEs: '¡Estas manzanas están muy dulces! Un kilo, aquí tiene. ¿Algo más?',
        textAr: 'هذا التفاح حلو جدًا! كيلو واحد، تفضل. شيء آخر؟',
        speaker: 'البائع',
        speakerIcon: '👩‍🌾',
        choices: [
          { textEs: 'Sí, también quiero medio kilo de tomates.', textAr: 'نعم، أريد أيضًا نصف كيلو طماطم.', nextId: 'total', isCorrect: true, feedbackAr: '✅ "medio kilo" = نصف كيلو. "también" = أيضًا.' },
          { textEs: 'No, eso es todo. Gracias.', textAr: 'لا، هذا كل شيء. شكرًا.', nextId: 'end', isCorrect: true, feedbackAr: '✅ "eso es todo" = هذا كل شيء.' },
        ],
      },
      {
        id: 'oranges',
        textEs: 'Las naranjas están a dos euros el kilo. ¡Están riquísimas!',
        textAr: 'البرتقال بيورو للكيلو. لذيذ جدًا!',
        speaker: 'البائع',
        speakerIcon: '👩‍🌾',
        choices: [
          { textEs: 'Póngame dos kilos, por favor.', textAr: 'ضع لي كيلوين، من فضلك.', nextId: 'total', isCorrect: true, feedbackAr: '✅ "Póngame" = ضع لي. تعبير شائع في الأسواق الإسبانية.' },
        ],
      },
      {
        id: 'total',
        textEs: 'Muy bien. Son tres euros con cincuenta en total.',
        textAr: 'جيد جدًا. المجموع ثلاثة يورو ونصف.',
        speaker: 'البائع',
        speakerIcon: '👩‍🌾',
        choices: [
          { textEs: 'Aquí tiene. ¡Muchas gracias!', textAr: 'تفضل. شكرًا جزيلاً!', nextId: 'end', isCorrect: true },
        ],
      },
      {
        id: 'end',
        textEs: '¡Gracias a usted! ¡Que tenga un buen día!',
        textAr: 'شكرًا لك! أتمنى لك يومًا سعيدًا!',
        speaker: 'البائع',
        speakerIcon: '👩‍🌾',
        isEnd: true,
        xpReward: 45,
      },
    ],
  },
];
