// Curated starter content for the five learning tools, shown before the learner saves their own items.
export const RECOMMENDED_LESSONS = [
  { id: 'pueblo-1', why: 'أساس كل محادثة: التحية والتعارف' },
  { id: 'pueblo-4', why: 'اطلب طعامك في مطعم إسباني بثقة' },
  { id: 'ciudad-1', why: 'اسأل عن الاتجاهات وتنقّل في المدينة' },
  { id: 'hist-1', why: 'تحدّث عن الماضي بأفعال شائعة' },
];

export const STARTER_DECKS = [
  { id: 'survival', title: 'عبارات النجاة', subtitle: 'Supervivencia', words: ['Hola', 'Por favor', 'Gracias', 'De nada', 'Me llamo', 'Mucho gusto'] },
  { id: 'restaurant', title: 'في المطعم', subtitle: 'En el restaurante', words: ['La cuenta', 'Menú', 'Buenos días', 'Dos'] },
  { id: 'family', title: 'العائلة', subtitle: 'La familia', words: ['Madre / Mamá', 'Padre / Papá', 'Hermano', 'Hermana', 'Abuelo', 'Abuela'] },
];

export const GOAL_PLANS: Record<number, { title: string; minutes: number; steps: string[] }> = {
  1: { title: 'خفيف', minutes: 10, steps: ['درس واحد كامل مع الاستماع', 'راجع 5 مفردات محفوظة'] },
  2: { title: 'منتظم', minutes: 20, steps: ['درس جديد + مراجعة درس سابق', 'اكتب 3 جمل في المفكرة', 'راجع 10 مفردات'] },
  3: { title: 'مكثّف', minutes: 35, steps: ['ثلاثة دروس متتالية', 'لعبة واحدة في المنطقة', 'جلسة تركيز 25 دقيقة'] },
};

export const REVIEW_TIPS = [
  'قل الكلمة بصوت عالٍ قبل كشف المعنى.',
  'كوّن جملة جديدة بالكلمة من حياتك اليومية.',
  'إذا أخطأت، احتفظ بالكلمة وراجعها غدًا.',
];
