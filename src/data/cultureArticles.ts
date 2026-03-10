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
];
