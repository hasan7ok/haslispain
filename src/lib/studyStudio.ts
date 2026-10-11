import { ZONES } from '@/data/zones';
import { LESSONS } from '@/data/vocabulary';
import { CULTURE_ARTICLES } from '@/data/cultureArticles';

export function searchContent(query: string, unlockedZones: string[]) {
  const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const term = normalize(query);
  const items = [
    ...ZONES.flatMap(zone => zone.lessons.map(lesson => ({ id: lesson.id, title: lesson.titleAr, subtitle: lesson.title, path: `/lesson/${lesson.id}`, kind: 'درس', locked: !unlockedZones.includes(zone.id), search: `${lesson.titleAr} ${lesson.title} ${zone.nameEs} ${LESSONS[lesson.id]?.vocabulary.map(word => `${word.word} ${word.translationAr}`).join(' ') || ''}` }))),
    ...CULTURE_ARTICLES.map(article => ({ id: article.id, title: article.titleAr || article.titleEn, subtitle: article.titleEs, path: `/cultura/${article.id}`, kind: 'ثقافة', locked: false, search: `${article.titleAr} ${article.titleEs} ${article.titleEn} ${article.snippet}` })),
  ];
  return items.filter(item => !term || normalize(item.search).includes(term)).slice(0, 30);
}

export function dailyPhrase(date = new Date()) {
  const phrases = LESSONS['pueblo-1'].vocabulary;
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return phrases[day % phrases.length];
}

export function remainingFocusSeconds(deadline: number, now: number) {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}