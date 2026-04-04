import cultureFlamenco from '@/assets/culture-flamenco.jpg';
import cultureFlamencoDetail from '@/assets/culture-flamenco-detail.jpg';
import culturePaella from '@/assets/culture-paella.jpg';
import cultureTapas from '@/assets/culture-tapas.jpg';
import cultureSagrada from '@/assets/culture-sagrada.jpg';
import cultureSagradaInterior from '@/assets/culture-sagrada-interior.jpg';
import cultureFiesta from '@/assets/culture-fiesta.jpg';
import cultureTomatina from '@/assets/culture-tomatina.jpg';
import cultureAlhambra from '@/assets/culture-alhambra.jpg';
import cultureAlhambraInterior from '@/assets/culture-alhambra-interior.jpg';
import cultureSiesta from '@/assets/culture-siesta.jpg';
import cultureMercado from '@/assets/culture-mercado.jpg';
import cultureSobremesa from '@/assets/culture-sobremesa.jpg';
import cultureCorrida from '@/assets/culture-corrida.jpg';
import cultureFutbol from '@/assets/culture-futbol.jpg';
import cultureVino from '@/assets/culture-vino.jpg';
import cultureLiteratura from '@/assets/culture-literatura.jpg';
import cultureMusica from '@/assets/culture-musica.jpg';
import cultureBoda from '@/assets/culture-boda.jpg';
import cultureCamino from '@/assets/culture-camino.jpg';
import cultureCarnaval from '@/assets/culture-carnaval.jpg';

export interface VocabItem {
  es: string;
  ar: string;
  example?: string;
}

export interface CultureArticle {
  id: string;
  titleEs: string;
  titleEn: string;
  titleAr: string;
  snippet: string;
  heroImage: string;
  images: string[];
  vocab: VocabItem[];
  sections: { heading: string; headingEs: string; body: string }[];
  funFact: string;
}

export const CULTURE_ARTICLES: CultureArticle[] = [
  {
    id: 'flamenco',
    titleEs: 'El Flamenco',
    titleEn: 'Flamenco Dance',
    titleAr: 'فن الفلامنكو',
    snippet: 'اكتشف فن الفلامنكو — رقص العاطفة والإيقاع الأندلسي الأصيل',
    heroImage: cultureFlamenco,
    images: [cultureFlamencoDetail, cultureFlamenco],
    vocab: [
      { es: 'El baile', ar: 'الرقص', example: 'El baile flamenco es apasionante.' },
      { es: 'El ritmo', ar: 'الإيقاع', example: 'El ritmo del flamenco es único.' },
      { es: 'La guitarra', ar: 'القيثارة', example: 'Toca la guitarra española.' },
      { es: 'El cantaor', ar: 'المغني', example: 'El cantaor tiene una voz profunda.' },
      { es: 'Las palmas', ar: 'التصفيق', example: '¡Dale palmas al compás!' },
      { es: 'El tablao', ar: 'مسرح الفلامنكو', example: 'Fuimos a un tablao en Sevilla.' },
      { es: 'El duende', ar: 'الروح / السحر الفني', example: 'Esa bailaora tiene mucho duende.' },
      { es: 'El zapateado', ar: 'الضرب بالأقدام', example: 'El zapateado marca el compás.' },
    ],
    sections: [
      {
        heading: 'أصول الفلامنكو',
        headingEs: 'Orígenes del Flamenco',
        body: 'نشأ فن الفلامنكو في منطقة الأندلس جنوب إسبانيا، كنتاج لتلاقي ثقافات متعددة: العربية والغجرية واليهودية والإسبانية. يُعد الفلامنكو تعبيراً فنياً عميقاً يجمع بين الغناء (Cante) والرقص (Baile) والعزف على القيثارة (Toque). أُدرج ضمن قائمة التراث الثقافي غير المادي لليونسكو عام 2010.',
      },
      {
        heading: 'أنواع الفلامنكو',
        headingEs: 'Palos del Flamenco',
        body: 'يضم الفلامنكو أكثر من 50 نوعاً موسيقياً (Palo)، تتراوح بين الحزين العميق مثل "سوليا" (Soleá) و"سيغيريا" (Seguiriya)، والمرح الراقص مثل "بوليريا" (Bulería) و"أليغريا" (Alegrías). لكل نوع إيقاعه الخاص (Compás) ومقامه الموسيقي المميز.',
      },
      {
        heading: 'الفلامنكو اليوم',
        headingEs: 'El Flamenco Hoy',
        body: 'تطور الفلامنكو ليمزج بين الأصالة والحداثة. فنانون مثل باكو دي لوثيا (Paco de Lucía) وكامارون دي لا إيسلا (Camarón de la Isla) أحدثوا ثورة في هذا الفن. اليوم، تنتشر مدارس الفلامنكو حول العالم، ويمكنك حضور عروض حية في "التابلاوات" (Tablaos) الشهيرة في إشبيلية ومدريد وغرناطة.',
      },
    ],
    funFact: '💃 هل تعلم؟ كلمة "Olé" التي نسمعها في عروض الفلامنكو أصلها من الكلمة العربية "والله"!',
  },
  {
    id: 'gastronomia',
    titleEs: 'La Gastronomía',
    titleEn: 'Spanish Cuisine',
    titleAr: 'المطبخ الإسباني',
    snippet: 'من الباييلا إلى التاباس، تعرّف على أشهر الأطباق الإسبانية',
    heroImage: culturePaella,
    images: [cultureTapas, culturePaella],
    vocab: [
      { es: 'La paella', ar: 'الباييلا', example: 'La paella valenciana lleva azafrán.' },
      { es: 'Las tapas', ar: 'التاباس', example: 'Vamos a tomar unas tapas.' },
      { es: 'El aceite de oliva', ar: 'زيت الزيتون', example: 'España produce el mejor aceite de oliva.' },
      { es: 'El jamón', ar: 'لحم الخنزير المقدد', example: 'El jamón ibérico es un manjar.' },
      { es: 'La tortilla', ar: 'التورتيلا', example: 'La tortilla española lleva huevo y patata.' },
      { es: 'El gazpacho', ar: 'الجازباتشو (حساء بارد)', example: 'El gazpacho es perfecto en verano.' },
      { es: 'Las croquetas', ar: 'الكروكيتاس', example: 'Las croquetas de jamón son deliciosas.' },
      { es: 'La sangría', ar: 'السانغريا', example: 'La sangría es una bebida refrescante.' },
    ],
    sections: [
      {
        heading: 'ثقافة التاباس',
        headingEs: 'La Cultura de las Tapas',
        body: 'التاباس ليست مجرد طعام، بل أسلوب حياة إسباني أصيل. تعود التسمية إلى عادة تغطية (tapar) كأس النبيذ بقطعة خبز مع شريحة لحم لإبعاد الحشرات. اليوم، "الخروج للتاباس" (Ir de tapas) طقس اجتماعي يجمع الأصدقاء والعائلة للتنقل بين الحانات وتذوق أطباق صغيرة متنوعة.',
      },
      {
        heading: 'الباييلا الأصلية',
        headingEs: 'La Paella Original',
        body: 'نشأت الباييلا في منطقة بلنسية (Valencia) وكانت طبق الفلاحين البسيط. الوصفة الأصلية تحتوي على الأرز والزعفران (Azafrán) والفاصوليا الخضراء والدجاج والأرانب. انتشرت لاحقاً نسخ بحرية ومختلطة. يُطبخ الطبق في مقلاة واسعة مسطحة (Paellera) على نار الحطب.',
      },
      {
        heading: 'أطباق يجب تجربتها',
        headingEs: 'Platos Imprescindibles',
        body: 'المطبخ الإسباني غني بالتنوع: الجازباتشو الأندلسي (Gazpacho) وهو حساء طماطم بارد مثالي للصيف، والتورتيلا الإسبانية (Tortilla Española) وهي عجة البيض بالبطاطس، والكروكيتاس (Croquetas) المقرمشة، والتشوروس (Churros) مع الشوكولاتة الساخنة للإفطار.',
      },
    ],
    funFact: '🍳 هل تعلم؟ إسبانيا هي أكبر منتج لزيت الزيتون في العالم، وتنتج نحو 50% من الإنتاج العالمي!',
  },
  {
    id: 'arquitectura',
    titleEs: 'La Arquitectura',
    titleEn: 'Architecture',
    titleAr: 'العمارة الإسبانية',
    snippet: 'روائع غاودي والعمارة الإسبانية التي تأسر العالم',
    heroImage: cultureSagrada,
    images: [cultureSagradaInterior, cultureSagrada],
    vocab: [
      { es: 'La catedral', ar: 'الكاتدرائية', example: 'La catedral de Sevilla es impresionante.' },
      { es: 'El arco', ar: 'القوس', example: 'Los arcos árabes son hermosos.' },
      { es: 'El mosaico', ar: 'الفسيفساء', example: 'Gaudí usaba mosaicos de colores.' },
      { es: 'La torre', ar: 'البرج', example: 'La torre de la Giralda es famosa.' },
      { es: 'El palacio', ar: 'القصر', example: 'El palacio real es magnífico.' },
      { es: 'La bóveda', ar: 'القبة / السقف المقوس', example: 'La bóveda de la iglesia es impresionante.' },
      { es: 'El azulejo', ar: 'البلاط المزخرف', example: 'Los azulejos son de origen árabe.' },
      { es: 'La fachada', ar: 'الواجهة', example: 'La fachada de la Sagrada Familia es única.' },
    ],
    sections: [
      {
        heading: 'أنطوني غاودي — عبقري برشلونة',
        headingEs: 'Antoni Gaudí — El Genio de Barcelona',
        body: 'أنطوني غاودي (1852-1926) هو المعماري الأكثر شهرة في إسبانيا. تميز بأسلوبه الفريد المستوحى من الطبيعة، حيث تغيب الخطوط المستقيمة وتحل محلها أشكال عضوية متموجة. أشهر أعماله كنيسة "ساغرادا فاميليا" (La Sagrada Familia) التي بدأ بناءها عام 1882 ولا تزال قيد الإنشاء حتى اليوم!',
      },
      {
        heading: 'التأثير العربي في العمارة',
        headingEs: 'La Influencia Árabe',
        body: 'ترك المسلمون بصمة لا تُمحى في العمارة الإسبانية خلال 800 عام من الحضارة الأندلسية. قصر الحمراء (La Alhambra) في غرناطة يُعد من أروع الأمثلة بأقواسه المزخرفة ونوافيره وحدائقه. مسجد-كاتدرائية قرطبة (La Mezquita de Córdoba) يجمع بين العمارتين الإسلامية والمسيحية في تناغم مذهل.',
      },
      {
        heading: 'العمارة الحديثة',
        headingEs: 'Arquitectura Moderna',
        body: 'تستمر إسبانيا في الإبداع المعماري. متحف غوغنهايم بلباو (Guggenheim Bilbao) لفرانك غيري حوّل المدينة الصناعية إلى وجهة سياحية عالمية. مدينة الفنون والعلوم (Ciudad de las Artes y las Ciencias) في بلنسية بتصميم سانتياغو كالاترافا تُعد تحفة معمارية مستقبلية.',
      },
    ],
    funFact: '🏗️ هل تعلم؟ كنيسة ساغرادا فاميليا بُنيت لأكثر من 140 عاماً ومن المتوقع اكتمالها عام 2026!',
  },
  {
    id: 'fiestas',
    titleEs: 'Las Fiestas',
    titleEn: 'Spanish Festivals',
    titleAr: 'المهرجانات الإسبانية',
    snippet: 'لا توماتينا، سان فيرمين — مهرجانات لا مثيل لها',
    heroImage: cultureFiesta,
    images: [cultureTomatina, cultureFiesta],
    vocab: [
      { es: 'La fiesta', ar: 'الحفلة / المهرجان', example: '¡Vamos a la fiesta del pueblo!' },
      { es: 'Los fuegos artificiales', ar: 'الألعاب النارية', example: 'Los fuegos artificiales iluminan la noche.' },
      { es: 'El desfile', ar: 'الموكب / الاستعراض', example: 'El desfile pasa por la calle principal.' },
      { es: 'La música', ar: 'الموسيقى', example: 'La música suena en toda la plaza.' },
      { es: 'El traje típico', ar: 'الزي التقليدي', example: 'Lleva un traje típico andaluz.' },
      { es: 'La plaza', ar: 'الساحة', example: 'La plaza está llena de gente.' },
      { es: 'El toro', ar: 'الثور', example: 'Los toros corren por las calles.' },
      { es: 'La verbena', ar: 'الحفل الشعبي', example: 'La verbena dura toda la noche.' },
    ],
    sections: [
      {
        heading: 'لا توماتينا — حرب الطماطم',
        headingEs: 'La Tomatina',
        body: 'في آخر أربعاء من شهر أغسطس، تتحول بلدة بونيول (Buñol) الصغيرة قرب بلنسية إلى ساحة معركة حمراء! يشارك أكثر من 20,000 شخص في أكبر معركة طعام في العالم، حيث يُلقى أكثر من 150 طناً من الطماطم. بدأت هذه العادة بالصدفة عام 1945 حين نشبت مشاجرة طعام عفوية في السوق.',
      },
      {
        heading: 'سان فيرمين — جري الثيران',
        headingEs: 'San Fermín — Encierro',
        body: 'يُقام مهرجان سان فيرمين في مدينة بامبلونا (Pamplona) من 6 إلى 14 يوليو كل عام. أشهر فعالياته "الإنسييرو" (Encierro) حيث يركض المشاركون أمام الثيران في شوارع المدينة الضيقة لمسافة 875 متراً. يبدأ الجري في الثامنة صباحاً ويستمر حوالي 3 دقائق فقط!',
      },
      {
        heading: 'لاس فايّاس — مهرجان النار',
        headingEs: 'Las Fallas de Valencia',
        body: 'كل عام في مارس، تُقام في بلنسية "لاس فايّاس" (Las Fallas) حيث يصنع الفنانون تماثيل ضخمة من الورق المعجون والخشب، بعضها يصل ارتفاعه إلى 30 متراً. في الليلة الأخيرة "لا كريما" (La Cremà) تُحرق جميع التماثيل في مشهد مهيب وسط الألعاب النارية والموسيقى.',
      },
    ],
    funFact: '🍅 هل تعلم؟ في لا توماتينا، يجب سحق الطماطم قبل رميها حتى لا تؤذي أحداً! إنها قاعدة رسمية.',
  },
  {
    id: 'historia',
    titleEs: 'La Historia',
    titleEn: 'History & Heritage',
    titleAr: 'التاريخ والتراث',
    snippet: 'من قصر الحمراء إلى الأندلس، تاريخ عريق يروي قصصاً خالدة',
    heroImage: cultureAlhambra,
    images: [cultureAlhambraInterior, cultureAlhambra],
    vocab: [
      { es: 'La historia', ar: 'التاريخ', example: 'España tiene una historia rica.' },
      { es: 'El castillo', ar: 'القلعة', example: 'El castillo está en la colina.' },
      { es: 'La conquista', ar: 'الفتح', example: 'La conquista de Granada fue en 1492.' },
      { es: 'El rey', ar: 'الملك', example: 'El rey Fernando unificó España.' },
      { es: 'La mezquita', ar: 'المسجد', example: 'La mezquita de Córdoba es única.' },
      { es: 'El califato', ar: 'الخلافة', example: 'El califato de Córdoba fue poderoso.' },
      { es: 'La reconquista', ar: 'الاسترداد', example: 'La Reconquista duró casi 800 años.' },
      { es: 'El descubrimiento', ar: 'الاكتشاف', example: 'El descubrimiento de América fue en 1492.' },
    ],
    sections: [
      {
        heading: 'الأندلس — حضارة مزدهرة',
        headingEs: 'Al-Ándalus — Una Civilización Floreciente',
        body: 'في عام 711 م، عبر المسلمون مضيق جبل طارق (Gibraltar — من "جبل طارق") وأسسوا حضارة استمرت نحو 800 عام. ازدهرت العلوم والفنون والأدب في قرطبة التي كانت أكبر مدينة في أوروبا الغربية. مكتبة الحكم الثاني ضمّت أكثر من 400,000 مخطوطة!',
      },
      {
        heading: 'قصر الحمراء — جوهرة غرناطة',
        headingEs: 'La Alhambra — La Joya de Granada',
        body: 'بُني قصر الحمراء في القرنين الثالث والرابع عشر على تلة تطل على مدينة غرناطة. اسمه مشتق من "القلعة الحمراء" نسبة للون جدرانه. يضم القصر ساحات مزينة بنوافير وحدائق خلابة مثل ساحة الأسود (Patio de los Leones) بأقواسها الـ124 المزخرفة. يستقبل أكثر من 2.7 مليون زائر سنوياً.',
      },
      {
        heading: 'عام 1492 — نقطة تحول',
        headingEs: 'El Año 1492 — Un Punto de Inflexión',
        body: 'شهد عام 1492 ثلاثة أحداث غيّرت التاريخ: سقوط غرناطة آخر معاقل المسلمين في الأندلس، وإبحار كريستوفر كولومبوس (Cristóbal Colón) لاكتشاف الأمريكتين بدعم من الملكة إيزابيلا والملك فرناندو، ونشر أول قواعد للغة الإسبانية (Gramática Castellana) على يد أنطونيو دي نبريخا.',
      },
    ],
    funFact: '🏰 هل تعلم؟ كلمات إسبانية كثيرة أصلها عربي: Almohada (المخدة)، Azúcar (السكر)، Ojalá (إن شاء الله)!',
  },
  {
    id: 'siesta',
    titleEs: 'La Siesta',
    titleEn: 'The Spanish Siesta',
    titleAr: 'القيلولة الإسبانية',
    snippet: 'اكتشف تقليد الراحة بعد الظهر الأكثر شهرة في العالم',
    heroImage: cultureSiesta,
    images: [cultureSiesta, cultureMercado],
    vocab: [
      { es: 'El descanso', ar: 'الراحة', example: 'Necesito un descanso después del almuerzo.' },
      { es: 'El almuerzo', ar: 'الغداء', example: 'El almuerzo en España es a las dos.' },
      { es: 'La costumbre', ar: 'العادة / التقليد', example: 'La siesta es una costumbre española.' },
      { es: 'La tarde', ar: 'بعد الظهر', example: 'Por la tarde hace mucho calor.' },
      { es: 'Dormir', ar: 'ينام', example: 'Me gusta dormir una siesta corta.' },
    ],
    sections: [
      { heading: 'أصل القيلولة', headingEs: 'El Origen de la Siesta', body: 'كلمة "siesta" مشتقة من اللاتينية "hora sexta" أي الساعة السادسة، وهي وقت الذروة الحرارية. نشأت هذه العادة كحل عملي للحرارة الشديدة في جنوب إسبانيا، حيث يصعب العمل بين الثانية والخامسة مساءً.' },
      { heading: 'القيلولة اليوم', headingEs: 'La Siesta Hoy', body: 'رغم أن نمط الحياة الحديث قلّص من ممارسة القيلولة، إلا أنها لا تزال جزءاً من الثقافة الإسبانية. كثير من المتاجر تغلق أبوابها بين الثانية والخامسة. أثبتت الدراسات أن قيلولة قصيرة (20 دقيقة) تحسّن الإنتاجية والمزاج.' },
      { heading: 'نصائح للقيلولة المثالية', headingEs: 'Consejos para la Siesta Perfecta', body: 'القيلولة المثالية تتراوح بين 15-30 دقيقة. أطول من ذلك قد يسبب الخمول. أفضل وقت لها بعد الغداء مباشرة. في إسبانيا، يسمونها "cabezada" عندما تكون قصيرة جداً — مجرد إغماضة عين!' },
    ],
    funFact: '😴 هل تعلم؟ شركات إسبانية حديثة بدأت توفر غرف قيلولة لموظفيها لزيادة الإنتاجية!',
  },
  {
    id: 'mercado',
    titleEs: 'El Mercado',
    titleEn: 'The Spanish Market',
    titleAr: 'السوق الإسباني',
    snippet: 'تعرف على ثقافة الأسواق التقليدية في إسبانيا',
    heroImage: cultureMercado,
    images: [cultureMercado, cultureTapas],
    vocab: [
      { es: 'Regatear', ar: 'يفاوض / يساوم', example: 'En el mercadillo puedes regatear.' },
      { es: 'Fresco', ar: 'طازج', example: 'Las frutas están muy frescas.' },
      { es: 'El vendedor', ar: 'البائع', example: 'El vendedor es muy simpático.' },
      { es: 'La oferta', ar: 'العرض', example: 'Hay una oferta especial hoy.' },
      { es: 'El precio', ar: 'السعر', example: '¿Cuál es el precio de esto?' },
    ],
    sections: [
      { heading: 'أسواق إسبانيا التاريخية', headingEs: 'Los Mercados Históricos', body: 'تُعد الأسواق المركزية (Mercados Centrales) قلب المدن الإسبانية. سوق لا بوكيريا (La Boqueria) في برشلونة وسوق سان ميغيل (Mercado de San Miguel) في مدريد من أشهر الأسواق التي تجمع بين التاريخ والطعام الطازج.' },
      { heading: 'ثقافة التسوق', headingEs: 'La Cultura de Comprar', body: 'في إسبانيا، التسوق في السوق تجربة اجتماعية. الناس يعرفون البائعين بأسمائهم ويتبادلون الأحاديث. "¿Qué le pongo?" (ماذا أحضر لك؟) هي العبارة الأشهر التي ستسمعها عند كل بائع.' },
      { heading: 'المنتجات الموسمية', headingEs: 'Productos de Temporada', body: 'يفخر الإسبان بشراء المنتجات الموسمية المحلية. في الربيع الفراولة من هويلفا، في الصيف البطيخ، في الخريف الفطر والكستناء، وفي الشتاء البرتقال من بلنسية. كل موسم له نكهته الخاصة!' },
    ],
    funFact: '🛒 هل تعلم؟ سوق لا بوكيريا في برشلونة يستقبل أكثر من 45,000 زائر يومياً!',
  },
  {
    id: 'sobremesa',
    titleEs: 'La Sobremesa',
    titleEn: 'After-Dinner Chat',
    titleAr: 'السوبريميسا',
    snippet: 'تقليد الجلوس والحديث بعد الطعام — فن إسباني أصيل',
    heroImage: cultureSobremesa,
    images: [cultureSobremesa, cultureSiesta],
    vocab: [
      { es: 'La charla', ar: 'الدردشة', example: 'La charla después de comer es muy agradable.' },
      { es: 'La mesa', ar: 'الطاولة', example: 'Nos quedamos en la mesa hablando.' },
      { es: 'La familia', ar: 'العائلة', example: 'La familia se reúne los domingos.' },
      { es: 'Compartir', ar: 'يشارك', example: 'Me gusta compartir historias.' },
      { es: 'Disfrutar', ar: 'يستمتع', example: 'Hay que disfrutar del momento.' },
    ],
    sections: [
      { heading: 'ما هي السوبريميسا؟', headingEs: '¿Qué es la Sobremesa?', body: 'السوبريميسا هي الوقت الذي يقضيه الإسبان جالسين حول الطاولة بعد الانتهاء من الأكل. ليست مجرد وقت إضافي، بل تقليد ثقافي عميق يُقدَّر فيه الحوار والتواصل الإنساني. قد تستمر ساعة أو أكثر!' },
      { heading: 'لماذا السوبريميسا مهمة؟', headingEs: '¿Por Qué es Importante?', body: 'في عالم سريع، تُذكّرنا السوبريميسا بأهمية التوقف والاستمتاع بصحبة الآخرين. هي لحظات تتبادل فيها العائلة الأخبار والقصص والضحكات. كلمة لا مرادف لها في لغات أخرى!' },
      { heading: 'كيف تعيش السوبريميسا؟', headingEs: 'Cómo Vivir la Sobremesa', body: 'لتعيش السوبريميسا كالإسبان: اجلس بعد الطعام، اطلب قهوة أو حلوى، وابدأ بالحديث عن أي شيء — السياسة، كرة القدم، الذكريات. لا تنظر للساعة ولا تستعجل. الهدف هو الاستمتاع باللحظة.' },
    ],
    funFact: '☕ هل تعلم؟ كلمة "sobremesa" لا يوجد لها ترجمة في أي لغة أخرى! هي كلمة إسبانية فريدة.',
  },
  {
    id: 'corrida',
    titleEs: 'La Corrida de Toros',
    titleEn: 'Bullfighting Culture',
    titleAr: 'مصارعة الثيران',
    snippet: 'تقليد مثير للجدل يعكس جزءاً عميقاً من الهوية الإسبانية',
    heroImage: cultureCorrida,
    images: [cultureCorrida, cultureFiesta],
    vocab: [
      { es: 'El torero', ar: 'المصارع', example: 'El torero entró en la plaza con valentía.' },
      { es: 'La plaza de toros', ar: 'حلبة المصارعة', example: 'La plaza de toros de Madrid es famosa.' },
      { es: 'El capote', ar: 'الرداء', example: 'El torero usa el capote rojo.' },
      { es: 'La muleta', ar: 'القماشة الحمراء', example: 'La muleta se usa en el último tercio.' },
      { es: 'El traje de luces', ar: 'بذلة الأنوار', example: 'El traje de luces brilla bajo el sol.' },
      { es: 'La faena', ar: 'العرض / المهمة', example: 'La faena fue espectacular.' },
    ],
    sections: [
      { heading: 'تاريخ مصارعة الثيران', headingEs: 'Historia de la Corrida', body: 'تعود مصارعة الثيران إلى القرن الثامن عشر كطقس ثقافي إسباني. كانت في الأصل مخصصة للنبلاء على ظهور الخيل، ثم تحولت إلى فن شعبي يمارسه المصارعون على الأقدام. ساحة "لاس بينتاس" (Las Ventas) في مدريد هي الأشهر في العالم.' },
      { heading: 'فن أم قسوة؟', headingEs: '¿Arte o Crueldad?', body: 'تُعد مصارعة الثيران من أكثر التقاليد إثارة للجدل في إسبانيا. مؤيدوها يعتبرونها فناً وتراثاً ثقافياً لا يُقدَّر بثمن، بينما يراها المعارضون قسوة تجاه الحيوانات. حُظرت في كاتالونيا عام 2010 لكنها لا تزال تقام في معظم المناطق الإسبانية.' },
      { heading: 'مفردات الحلبة', headingEs: 'Vocabulario de la Plaza', body: 'العرض يُقسم إلى ثلاثة أجزاء (tercios): الأول "tercio de varas" حيث يُختبر الثور، والثاني "tercio de banderillas" حيث تُغرس الأعلام الملونة، والثالث "tercio de muleta" حيث يواجه المصارع الثور وجهاً لوجه في لحظات درامية مكثفة.' },
    ],
    funFact: '🐂 هل تعلم؟ الثور لا يتفاعل مع اللون الأحمر! هو مصاب بعمى الألوان ويتفاعل مع حركة القماش فقط.',
  },
  {
    id: 'futbol',
    titleEs: 'El Fútbol Español',
    titleEn: 'Spanish Football',
    titleAr: 'كرة القدم الإسبانية',
    snippet: 'أكثر من رياضة — ثقافة وشغف يوحّد ملايين الإسبان',
    heroImage: cultureFutbol,
    images: [cultureFutbol, cultureCorrida],
    vocab: [
      { es: 'El gol', ar: 'الهدف', example: '¡Gooool! ¡Qué golazo!' },
      { es: 'El estadio', ar: 'الملعب', example: 'El estadio está lleno de aficionados.' },
      { es: 'El partido', ar: 'المباراة', example: 'El partido empieza a las nueve.' },
      { es: 'El entrenador', ar: 'المدرب', example: 'El entrenador prepara la táctica.' },
      { es: 'La afición', ar: 'الجمهور', example: 'La afición anima al equipo.' },
      { es: 'El clásico', ar: 'الكلاسيكو', example: 'El Clásico es el partido más visto del mundo.' },
    ],
    sections: [
      { heading: 'لا ليغا — أقوى دوري', headingEs: 'La Liga — La Mejor Liga', body: 'الدوري الإسباني "لا ليغا" (La Liga) يُعد من أقوى دوريات كرة القدم في العالم. يضم أندية أسطورية مثل ريال مدريد وبرشلونة وأتلتيكو مدريد. الكلاسيكو (El Clásico) بين ريال مدريد وبرشلونة يشاهده أكثر من 650 مليون شخص حول العالم!' },
      { heading: 'ثقافة الكرة', headingEs: 'Cultura del Fútbol', body: 'كرة القدم في إسبانيا ليست مجرد رياضة بل هوية. كل حي له فريقه المفضل، وكل عائلة لها ولاؤها الكروي الذي يتوارثه الأجيال. المقاهي تمتلئ أيام المباريات والجميع يتحدث عن الكرة — في العمل والمدرسة والشارع.' },
      { heading: 'المنتخب الإسباني', headingEs: 'La Selección Española', body: 'حقق المنتخب الإسباني "لا روخا" (La Roja) إنجازات تاريخية: كأس العالم 2010 وكأس أوروبا 2008 و2012. أسلوب "تيكي-تاكا" (Tiki-Taka) القائم على التمرير السريع أصبح مدرسة عالمية في كرة القدم غيّرت مفاهيم اللعبة.' },
    ],
    funFact: '⚽ هل تعلم؟ ملعب سانتياغو برنابيو الجديد يحتوي سقفاً قابلاً للطي وأرضية قابلة للسحب!',
  },
  {
    id: 'vino',
    titleEs: 'El Vino Español',
    titleEn: 'Spanish Wine Culture',
    titleAr: 'ثقافة النبيذ الإسباني',
    snippet: 'من كروم لا ريوخا إلى موائد الأندلس — رحلة في عالم العنب',
    heroImage: cultureVino,
    images: [cultureVino, cultureSobremesa],
    vocab: [
      { es: 'La uva', ar: 'العنب', example: 'Las uvas están maduras en septiembre.' },
      { es: 'La bodega', ar: 'القبو / مصنع النبيذ', example: 'Visitamos una bodega en La Rioja.' },
      { es: 'El viñedo', ar: 'كرم العنب', example: 'El viñedo se extiende por la colina.' },
      { es: 'La cosecha', ar: 'الحصاد', example: 'La cosecha de este año fue excelente.' },
      { es: 'El brindis', ar: 'النخب', example: '¡Hagamos un brindis por la amistad!' },
      { es: 'La vendimia', ar: 'موسم القطاف', example: 'La vendimia es una fiesta en muchos pueblos.' },
    ],
    sections: [
      { heading: 'مناطق النبيذ', headingEs: 'Regiones Vinícolas', body: 'إسبانيا تملك أكبر مساحة مزروعة بالكروم في العالم. أشهر المناطق هي لا ريوخا (La Rioja) المعروفة بنبيذها الأحمر الفاخر، وريبيرا ديل دويرو (Ribera del Duero) ذات الطابع القوي، وخيريز (Jerez) في الأندلس الشهيرة بنبيذ الشيري.' },
      { heading: 'طقوس النبيذ', headingEs: 'Rituales del Vino', body: 'شرب النبيذ في إسبانيا طقس اجتماعي لا ينفصل عن الطعام والصحبة. "النخب" (El Brindis) تقليد أساسي في المناسبات. في ليلة رأس السنة، يأكل الإسبان 12 حبة عنب مع كل دقة ساعة — واحدة لكل شهر من السنة الجديدة.' },
      { heading: 'الفيندميا — موسم القطاف', headingEs: 'La Vendimia', body: 'موسم قطاف العنب (La Vendimia) في سبتمبر وأكتوبر يتحول إلى احتفال شعبي في كثير من المدن الإسبانية. أشهرها مهرجان الفيندميا في خيريز حيث يُداس العنب بالأقدام تقليدياً وتُقام عروض فلامنكو وسباقات خيل.' },
    ],
    funFact: '🍇 هل تعلم؟ إسبانيا فيها أكثر من 400 نوع محلي من العنب! أكثر من أي بلد آخر.',
  },
  {
    id: 'literatura',
    titleEs: 'La Literatura Española',
    titleEn: 'Spanish Literature',
    titleAr: 'الأدب الإسباني',
    snippet: 'من دون كيخوته إلى لوركا — أعظم الأعمال الأدبية الإسبانية',
    heroImage: cultureLiteratura,
    images: [cultureLiteratura, cultureAlhambra],
    vocab: [
      { es: 'El escritor', ar: 'الكاتب', example: 'Cervantes es el escritor más famoso de España.' },
      { es: 'La novela', ar: 'الرواية', example: 'Don Quijote es la primera novela moderna.' },
      { es: 'El poema', ar: 'القصيدة', example: 'Lorca escribió poemas hermosos.' },
      { es: 'La biblioteca', ar: 'المكتبة', example: 'La biblioteca tiene miles de libros.' },
      { es: 'El personaje', ar: 'الشخصية', example: 'Don Quijote es un personaje inolvidable.' },
      { es: 'La obra maestra', ar: 'التحفة الفنية', example: 'Don Quijote es una obra maestra universal.' },
    ],
    sections: [
      { heading: 'دون كيخوته — أول رواية حديثة', headingEs: 'Don Quijote — La Primera Novela Moderna', body: 'نشر ميغيل دي ثيربانتس (Miguel de Cervantes) رواية "دون كيخوته دي لا مانتشا" عام 1605، وتُعتبر أول رواية حديثة في التاريخ. تحكي قصة فارس حالم يقاتل طواحين الهواء ظناً أنها عمالقة. تُرجمت إلى أكثر من 140 لغة وهي ثاني أكثر كتاب تُرجم بعد الكتاب المقدس.' },
      { heading: 'العصر الذهبي', headingEs: 'El Siglo de Oro', body: 'شهدت إسبانيا في القرنين السادس والسابع عشر "العصر الذهبي" (El Siglo de Oro) حيث ازدهر الأدب والمسرح. كتّاب مثل لوبي دي بيغا (Lope de Vega) وكالديرون دي لا باركا (Calderón de la Barca) أنتجوا مئات المسرحيات التي لا تزال تُعرض حتى اليوم.' },
      { heading: 'جيل الـ 27 ولوركا', headingEs: 'La Generación del 27 y Lorca', body: 'في عشرينيات القرن العشرين، ظهرت مجموعة أدبية رائعة عُرفت بـ"جيل الـ 27" (Generación del 27). أبرزهم فيديريكو غارثيا لوركا (Federico García Lorca) الذي مزج الشعر بالموسيقى الشعبية والفلامنكو. قصائده مثل "Romancero Gitano" تُعد من أجمل ما كُتب بالإسبانية.' },
    ],
    funFact: '📚 هل تعلم؟ يوم الكتاب العالمي (23 أبريل) اختير لأنه يوم وفاة ثيربانتس وشكسبير في نفس العام 1616!',
  },
];
