export interface LearningTools {
  bookmarks: string[];
  words: string[];
  goal: number;
  dailyDate: string;
  dailyLessons: string[];
  resume: { lessonId: string; card: number } | null;
  studyDays: number[];
  readingSize: 'standard' | 'large';
  reducedMotion: boolean;
}
export const defaultLearningTools: LearningTools = { bookmarks: [], words: [], goal: 2, dailyDate: '', dailyLessons: [], resume: null, studyDays: [0, 2, 4], readingSize: 'standard', reducedMotion: false };
export function toggleItem(items: string[], item: string) { return items.includes(item) ? items.filter(value => value !== item) : [...items, item]; }
export function localDay(date = new Date()) { return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; }
export function recordDailyLesson(state: LearningTools, lessonId: string, date: string): LearningTools {
  const lessons = state.dailyDate === date ? state.dailyLessons : [];
  return { ...state, dailyDate: date, dailyLessons: lessons.includes(lessonId) ? lessons : [...lessons, lessonId] };
}
export function readLearningTools(raw: string | null): LearningTools {
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
    return {
      bookmarks: strings(parsed.bookmarks), words: strings(parsed.words),
      goal: [1, 2, 3].includes(parsed.goal) ? parsed.goal : 2,
      dailyDate: typeof parsed.dailyDate === 'string' ? parsed.dailyDate : '', dailyLessons: strings(parsed.dailyLessons),
      resume: parsed.resume && typeof parsed.resume.lessonId === 'string' && Number.isInteger(parsed.resume.card) && parsed.resume.card >= 0 ? parsed.resume : null,
      studyDays: Array.isArray(parsed.studyDays) ? [...new Set(parsed.studyDays.filter((day: unknown): day is number => typeof day === 'number' && Number.isInteger(day) && day >= 0 && day <= 6))] as number[] : [0, 2, 4],
      readingSize: parsed.readingSize === 'large' ? 'large' : 'standard',
      reducedMotion: parsed.reducedMotion === true,
    };
  } catch { return { ...defaultLearningTools }; }
}