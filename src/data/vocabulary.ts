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
      { word: 'Vestirse', translation: 'To get dressed', translationAr: 'يرتدي ملابسه', example: 'Me visto rápidamente.', exampleTranslation: 'I get dressed quickly.' },
      { word: 'Almorzar', translation: 'To have lunch', translationAr: 'يتناول الغداء', example: 'Almuerzo a las dos.', exampleTranslation: 'I have lunch at two.' },
      { word: 'Cenar', translation: 'To have dinner', translationAr: 'يتناول العشاء', example: 'Cenamos a las nueve.', exampleTranslation: 'We have dinner at nine.' },
    ],
  },
  'ciudad-2': {
    id: 'ciudad-2',
    intro: 'Let\'s go shopping! Learn useful phrases for stores and markets.',
    introAr: 'لنذهب للتسوق! تعلم عبارات مفيدة للمتاجر والأسواق.',
    tip: 'In Spain, shops often close from 2-5 PM for siesta. In Latin America, this varies by country.',
    tipAr: 'في إسبانيا، المحلات تغلق عادة من 2 إلى 5 مساءً للقيلولة. في أمريكا اللاتينية يختلف حسب البلد.',
    vocabulary: [
      { word: '¿Cuánto cuesta?', translation: 'How much does it cost?', translationAr: 'كم يكلف؟', example: '¿Cuánto cuesta esta camisa?', exampleTranslation: 'How much does this shirt cost?' },
      { word: 'Barato', translation: 'Cheap', translationAr: 'رخيص', example: 'Este mercado es muy barato.', exampleTranslation: 'This market is very cheap.' },
      { word: 'Caro', translation: 'Expensive', translationAr: 'غالي', example: 'El restaurante es caro.', exampleTranslation: 'The restaurant is expensive.' },
      { word: 'Talla', translation: 'Size', translationAr: 'مقاس', example: '¿Tiene talla mediana?', exampleTranslation: 'Do you have a medium size?' },
      { word: 'Probador', translation: 'Fitting room', translationAr: 'غرفة القياس', example: '¿Dónde está el probador?', exampleTranslation: 'Where is the fitting room?' },
      { word: 'Descuento', translation: 'Discount', translationAr: 'خصم', example: '¿Hay descuento para estudiantes?', exampleTranslation: 'Is there a student discount?' },
    ],
  },
  'ciudad-3': {
    id: 'ciudad-3',
    intro: 'Talk about the weather like a local!',
    introAr: 'تحدث عن الطقس مثل السكان المحليين!',
    vocabulary: [
      { word: 'Hace calor', translation: 'It\'s hot', translationAr: 'الجو حار', example: 'Hoy hace mucho calor.', exampleTranslation: 'It\'s very hot today.' },
      { word: 'Hace frío', translation: 'It\'s cold', translationAr: 'الجو بارد', example: 'En invierno hace mucho frío.', exampleTranslation: 'In winter it\'s very cold.' },
      { word: 'Llueve', translation: 'It\'s raining', translationAr: 'تمطر', example: 'Hoy llueve mucho.', exampleTranslation: 'It\'s raining a lot today.' },
      { word: 'Nieve', translation: 'Snow', translationAr: 'ثلج', example: 'Me encanta la nieve.', exampleTranslation: 'I love snow.' },
      { word: 'Soleado', translation: 'Sunny', translationAr: 'مشمس', example: 'El día está soleado.', exampleTranslation: 'The day is sunny.' },
      { word: 'Nublado', translation: 'Cloudy', translationAr: 'غائم', example: 'Está nublado hoy.', exampleTranslation: 'It\'s cloudy today.' },
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
      { word: 'Son', translation: 'They are (permanent)', translationAr: 'هم (دائم)', example: 'Ellos son mexicanos.', exampleTranslation: 'They are Mexican.' },
      { word: 'Están', translation: 'They are (temporary)', translationAr: 'هم (مؤقت)', example: 'Están ocupados.', exampleTranslation: 'They are busy.' },
    ],
  },
  'ciudad-5': {
    id: 'ciudad-5',
    intro: 'The past tense! Learn how to talk about completed actions.',
    introAr: 'صيغة الماضي! تعلم كيف تتحدث عن الأفعال المكتملة.',
    tip: 'The pretérito perfecto is formed with "haber" + past participle. Example: He comido = I have eaten.',
    tipAr: 'الماضي التام يُشكّل بـ "haber" + اسم المفعول. مثال: He comido = لقد أكلت.',
    vocabulary: [
      { word: 'He comido', translation: 'I have eaten', translationAr: 'لقد أكلت', example: 'Hoy he comido paella.', exampleTranslation: 'Today I have eaten paella.' },
      { word: 'Has viajado', translation: 'You have traveled', translationAr: 'لقد سافرت', example: '¿Has viajado a España?', exampleTranslation: 'Have you traveled to Spain?' },
      { word: 'Ha dicho', translation: 'He/She has said', translationAr: 'لقد قال/قالت', example: 'Ella ha dicho la verdad.', exampleTranslation: 'She has told the truth.' },
      { word: 'Hemos visto', translation: 'We have seen', translationAr: 'لقد رأينا', example: 'Hemos visto esa película.', exampleTranslation: 'We have seen that movie.' },
      { word: 'Han llegado', translation: 'They have arrived', translationAr: 'لقد وصلوا', example: 'Los invitados han llegado.', exampleTranslation: 'The guests have arrived.' },
    ],
  },
  'hist-1': {
    id: 'hist-1',
    intro: 'Spain has amazing festivals! Let\'s learn about the most important ones.',
    introAr: 'إسبانيا لديها مهرجانات مذهلة! لنتعلم عن أهمها.',
    tip: 'La Tomatina in Buñol is a giant tomato fight! Las Fallas in Valencia burns enormous sculptures.',
    tipAr: 'لا توماتينا في بونيول هي معركة طماطم عملاقة! لاس فاياس في فالنسيا تحرق منحوتات ضخمة.',
    vocabulary: [
      { word: 'La Tomatina', translation: 'Tomato Festival', translationAr: 'مهرجان الطماطم', example: 'La Tomatina es en agosto.', exampleTranslation: 'La Tomatina is in August.' },
      { word: 'San Fermín', translation: 'Running of the Bulls', translationAr: 'مهرجان الثيران', example: 'San Fermín es en Pamplona.', exampleTranslation: 'San Fermín is in Pamplona.' },
      { word: 'Semana Santa', translation: 'Holy Week', translationAr: 'الأسبوع المقدس', example: 'Semana Santa es muy importante.', exampleTranslation: 'Holy Week is very important.' },
      { word: 'Navidad', translation: 'Christmas', translationAr: 'عيد الميلاد', example: 'En Navidad comemos turrón.', exampleTranslation: 'At Christmas we eat turrón.' },
      { word: 'Fiesta', translation: 'Party/Festival', translationAr: 'حفلة/مهرجان', example: '¡Me encantan las fiestas!', exampleTranslation: 'I love parties!' },
    ],
  },
  'hist-2': {
    id: 'hist-2',
    intro: 'Spanish food culture is rich and diverse! Let\'s explore.',
    introAr: 'ثقافة الطعام الإسبانية غنية ومتنوعة! لنستكشف.',
    tip: 'Tapas are small dishes meant for sharing. In some cities in Spain, you get a free tapa with every drink!',
    tipAr: 'التاباس أطباق صغيرة للمشاركة. في بعض المدن الإسبانية تحصل على تابا مجاني مع كل مشروب!',
    vocabulary: [
      { word: 'Tapas', translation: 'Small shared dishes', translationAr: 'أطباق صغيرة مشتركة', example: 'Vamos a tomar unas tapas.', exampleTranslation: 'Let\'s have some tapas.' },
      { word: 'Paella', translation: 'Rice dish', translationAr: 'طبق أرز', example: 'La paella valenciana es famosa.', exampleTranslation: 'Valencian paella is famous.' },
      { word: 'Churros', translation: 'Fried dough pastry', translationAr: 'حلوى مقلية', example: 'Churros con chocolate, ¡delicioso!', exampleTranslation: 'Churros with chocolate, delicious!' },
      { word: 'Tortilla española', translation: 'Spanish omelette', translationAr: 'عجة إسبانية', example: 'La tortilla lleva patatas y huevos.', exampleTranslation: 'The tortilla has potatoes and eggs.' },
      { word: 'Gazpacho', translation: 'Cold tomato soup', translationAr: 'شوربة طماطم باردة', example: 'El gazpacho es perfecto en verano.', exampleTranslation: 'Gazpacho is perfect in summer.' },
    ],
  },
  'hist-3': {
    id: 'hist-3',
    intro: 'Learn about Spanish manners and customs!',
    introAr: 'تعلم عن الآداب والعادات الإسبانية!',
    tip: 'Spanish people are generally more physical in greetings - expect kisses on the cheek between friends!',
    tipAr: 'الإسبان عمومًا أكثر تواصلاً جسديًا في التحية - توقع قبلات على الخد بين الأصدقاء!',
    vocabulary: [
      { word: 'Beso en la mejilla', translation: 'Kiss on the cheek', translationAr: 'قبلة على الخد', example: 'En España saludamos con dos besos.', exampleTranslation: 'In Spain we greet with two kisses.' },
      { word: 'Sobremesa', translation: 'After-meal chat', translationAr: 'الدردشة بعد الأكل', example: 'La sobremesa puede durar horas.', exampleTranslation: 'The after-meal chat can last hours.' },
      { word: 'Siesta', translation: 'Afternoon nap', translationAr: 'قيلولة', example: 'Me encanta la siesta.', exampleTranslation: 'I love the siesta.' },
      { word: 'Puntualidad', translation: 'Punctuality', translationAr: 'الالتزام بالمواعيد', example: 'En España, ser puntual no es tan estricto.', exampleTranslation: 'In Spain, being punctual isn\'t so strict.' },
      { word: 'Propina', translation: 'Tip', translationAr: 'بقشيش', example: 'En España la propina no es obligatoria.', exampleTranslation: 'In Spain, tipping is not mandatory.' },
    ],
  },
  'lat-1': {
    id: 'lat-1',
    intro: 'Discover the differences between Spanish in Spain and Latin America!',
    introAr: 'اكتشف الفروق بين الإسبانية في إسبانيا وأمريكا اللاتينية!',
    tip: 'In Spain they say "vosotros" (you plural), in Latin America they say "ustedes". "Coger" means "to take" in Spain but has a vulgar meaning in Latin America!',
    tipAr: 'في إسبانيا يقولون "vosotros" (أنتم)، في أمريكا اللاتينية يقولون "ustedes". "Coger" تعني "يأخذ" في إسبانيا لكن لها معنى بذيء في أمريكا اللاتينية!',
    vocabulary: [
      { word: 'Coche / Carro', translation: 'Car (Spain / LatAm)', translationAr: 'سيارة', example: 'Tengo un coche nuevo. (España)', exampleTranslation: 'I have a new car. (Spain)' },
      { word: 'Ordenador / Computadora', translation: 'Computer (Spain / LatAm)', translationAr: 'حاسوب', example: 'Mi ordenador es rápido. (España)', exampleTranslation: 'My computer is fast. (Spain)' },
      { word: 'Móvil / Celular', translation: 'Cell phone (Spain / LatAm)', translationAr: 'هاتف محمول', example: 'Dame tu número de móvil. (España)', exampleTranslation: 'Give me your cell number. (Spain)' },
      { word: 'Guay / Chévere', translation: 'Cool (Spain / LatAm)', translationAr: 'رائع', example: '¡Qué guay! (España) / ¡Qué chévere! (LatAm)', exampleTranslation: 'How cool!' },
      { word: 'Vale / OK', translation: 'OK (Spain / LatAm)', translationAr: 'حسنًا', example: '¿Vamos al cine? —¡Vale!', exampleTranslation: 'Shall we go to the cinema? —OK!' },
    ],
  },
  'lat-2': {
    id: 'lat-2',
    intro: 'Slang and idioms make you sound like a native!',
    introAr: 'العامية والتعبيرات الاصطلاحية تجعلك تبدو كمتحدث أصلي!',
    vocabulary: [
      { word: 'Tío/Tía', translation: 'Dude/Girl (Spain)', translationAr: 'يا صاحبي/صاحبتي', example: '¡Tío, qué fuerte!', exampleTranslation: 'Dude, that\'s crazy!' },
      { word: 'Mola', translation: 'It\'s cool (Spain)', translationAr: 'رائع', example: '¡Eso mola mucho!', exampleTranslation: 'That\'s really cool!' },
      { word: 'Pata', translation: 'Friend (Peru)', translationAr: 'صديق', example: 'Él es mi pata.', exampleTranslation: 'He\'s my friend.' },
      { word: 'Chido', translation: 'Cool (Mexico)', translationAr: 'رائع', example: '¡Está bien chido!', exampleTranslation: 'It\'s really cool!' },
      { word: 'Bacano', translation: 'Awesome (Colombia)', translationAr: 'مذهل', example: '¡Qué bacano!', exampleTranslation: 'How awesome!' },
    ],
  },
  'lat-3': {
    id: 'lat-3',
    intro: 'Learn about Voseo - the way many Latin Americans say "you"!',
    introAr: 'تعلم عن Voseo - الطريقة التي يقول بها كثير من أمريكا اللاتينية "أنت"!',
    tip: 'In Argentina, Uruguay, and parts of Central America, "vos" is used instead of "tú". The verb forms change too!',
    tipAr: 'في الأرجنتين وأوروغواي وأجزاء من أمريكا الوسطى يُستخدم "vos" بدلاً من "tú". صيغ الأفعال تتغير أيضًا!',
    vocabulary: [
      { word: 'Vos sos', translation: 'You are (voseo)', translationAr: 'أنت (voseo)', example: 'Vos sos muy inteligente.', exampleTranslation: 'You are very smart.' },
      { word: 'Vos tenés', translation: 'You have (voseo)', translationAr: 'لديك (voseo)', example: '¿Vos tenés tiempo?', exampleTranslation: 'Do you have time?' },
      { word: 'Vos querés', translation: 'You want (voseo)', translationAr: 'تريد (voseo)', example: '¿Vos querés café?', exampleTranslation: 'Do you want coffee?' },
      { word: 'Vos hablás', translation: 'You speak (voseo)', translationAr: 'تتحدث (voseo)', example: '¿Vos hablás inglés?', exampleTranslation: 'Do you speak English?' },
    ],
  },
  'deb-1': {
    id: 'deb-1',
    intro: 'Learn to express opinions and argue in Spanish!',
    introAr: 'تعلم التعبير عن الآراء والنقاش بالإسبانية!',
    vocabulary: [
      { word: 'En mi opinión', translation: 'In my opinion', translationAr: 'في رأيي', example: 'En mi opinión, es importante.', exampleTranslation: 'In my opinion, it\'s important.' },
      { word: 'Estoy de acuerdo', translation: 'I agree', translationAr: 'أوافق', example: 'Estoy de acuerdo contigo.', exampleTranslation: 'I agree with you.' },
      { word: 'No estoy de acuerdo', translation: 'I disagree', translationAr: 'لا أوافق', example: 'No estoy de acuerdo con eso.', exampleTranslation: 'I disagree with that.' },
      { word: 'Sin embargo', translation: 'However', translationAr: 'ومع ذلك', example: 'Es difícil; sin embargo, es posible.', exampleTranslation: 'It\'s difficult; however, it\'s possible.' },
      { word: 'Por lo tanto', translation: 'Therefore', translationAr: 'لذلك', example: 'Estudié mucho, por lo tanto aprobé.', exampleTranslation: 'I studied a lot, therefore I passed.' },
    ],
  },
  'deb-2': {
    id: 'deb-2',
    intro: 'The Subjunctive mood - the most challenging topic in Spanish!',
    introAr: 'صيغة الشك (Subjuntivo) - أصعب موضوع في الإسبانية!',
    tip: 'Use subjunctive after: desires (quiero que), emotions (me alegra que), doubt (dudo que), and impersonal expressions (es importante que).',
    tipAr: 'استخدم صيغة الشك بعد: الرغبات (quiero que)، المشاعر (me alegra que)، الشك (dudo que)، والتعبيرات غير الشخصية (es importante que).',
    vocabulary: [
      { word: 'Quiero que vengas', translation: 'I want you to come', translationAr: 'أريدك أن تأتي', example: 'Quiero que vengas a mi fiesta.', exampleTranslation: 'I want you to come to my party.' },
      { word: 'Espero que llueva', translation: 'I hope it rains', translationAr: 'آمل أن تمطر', example: 'Espero que llueva mañana.', exampleTranslation: 'I hope it rains tomorrow.' },
      { word: 'Dudo que sepa', translation: 'I doubt he knows', translationAr: 'أشك أنه يعرف', example: 'Dudo que sepa la respuesta.', exampleTranslation: 'I doubt he knows the answer.' },
      { word: 'Es necesario que', translation: 'It\'s necessary that', translationAr: 'من الضروري أن', example: 'Es necesario que estudies.', exampleTranslation: 'It\'s necessary that you study.' },
    ],
  },
  'deb-3': {
    id: 'deb-3',
    intro: 'Formal expressions for professional and academic contexts.',
    introAr: 'تعبيرات رسمية للسياقات المهنية والأكاديمية.',
    vocabulary: [
      { word: 'Estimado/a', translation: 'Dear (formal)', translationAr: 'عزيزي/عزيزتي', example: 'Estimado señor García...', exampleTranslation: 'Dear Mr. García...' },
      { word: 'Le agradezco', translation: 'I thank you (formal)', translationAr: 'أشكرك (رسمي)', example: 'Le agradezco su atención.', exampleTranslation: 'I thank you for your attention.' },
      { word: 'Atentamente', translation: 'Sincerely', translationAr: 'مع خالص التقدير', example: 'Atentamente, Juan Pérez.', exampleTranslation: 'Sincerely, Juan Pérez.' },
      { word: 'Con respecto a', translation: 'Regarding', translationAr: 'بخصوص', example: 'Con respecto a su consulta...', exampleTranslation: 'Regarding your inquiry...' },
      { word: 'Me dirijo a usted', translation: 'I address you (formal)', translationAr: 'أتوجه إليكم', example: 'Me dirijo a usted para solicitar...', exampleTranslation: 'I address you to request...' },
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
  { targetSentence: 'He comido paella hoy', translation: 'I have eaten paella today', translationAr: 'أكلت بايلا اليوم', words: ['hoy', 'He', 'paella', 'comido'], level: 'B1' },
  { targetSentence: 'Quiero que vengas a la fiesta', translation: 'I want you to come to the party', translationAr: 'أريدك أن تأتي للحفلة', words: ['fiesta', 'vengas', 'la', 'Quiero', 'que', 'a'], level: 'B1' },
  { targetSentence: 'No creo que sea fácil', translation: 'I don\'t think it\'s easy', translationAr: 'لا أعتقد أنه سهل', words: ['fácil', 'No', 'sea', 'creo', 'que'], level: 'B2' },
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
  { sentence: 'Hoy ___ mucho calor.', sentenceAr: 'اليوم ___ حار جدًا.', blank: 'hace', options: ['hace', 'es', 'está', 'tiene'], correct: 'hace', level: 'A2' },
  { sentence: 'Espero que tú ___ bien.', sentenceAr: 'آمل أن تكون ___ بخير.', blank: 'estés', options: ['estés', 'estás', 'eres', 'seas'], correct: 'estés', level: 'B1' },
  { sentence: 'Yo ___ 25 años.', sentenceAr: 'عمري ___ 25 سنة.', blank: 'tengo', options: ['tengo', 'soy', 'estoy', 'hago'], correct: 'tengo', level: 'A1' },
  { sentence: 'No creo que ___ fácil.', sentenceAr: 'لا أعتقد أنه ___ سهل.', blank: 'sea', options: ['sea', 'es', 'está', 'fue'], correct: 'sea', level: 'B2' },
];
