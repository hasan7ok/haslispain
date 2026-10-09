import { describe, expect, it } from 'vitest';
import { defaultLearningTools, readLearningTools, recordDailyLesson, toggleItem } from '@/lib/learningTools';
import { DEFAULT_SPEECH_RATE, getSpeechState, playSpanish, stopSpanish } from '@/lib/spanishSpeech';
import { vi } from 'vitest';
import { LESSONS } from '@/data/vocabulary';
import { ZONES } from '@/data/zones';

describe('learning tools', () => {
  it('bookmarks toggle without duplicates', () => { expect(toggleItem(['pueblo-1'], 'pueblo-1')).toEqual([]); expect(toggleItem([], 'pueblo-1')).toEqual(['pueblo-1']); });
  it('saved words can be added and removed', () => { expect(toggleItem(['Hola'], 'Gracias')).toEqual(['Hola', 'Gracias']); expect(toggleItem(['Hola'], 'Hola')).toEqual([]); });
  it('daily goal counts a lesson once and resets on a new day', () => {
    const once = recordDailyLesson(defaultLearningTools, 'pueblo-1', '2026-10-9');
    expect(recordDailyLesson(once, 'pueblo-1', '2026-10-9').dailyLessons).toEqual(['pueblo-1']);
    expect(recordDailyLesson(once, 'pueblo-2', '2026-10-10').dailyLessons).toEqual(['pueblo-2']);
  });
  it('retains a valid resume position', () => { expect(readLearningTools(JSON.stringify({ resume: { lessonId: 'pueblo-1', card: 3 } })).resume).toEqual({ lessonId: 'pueblo-1', card: 3 }); });
  it('rejects malformed stored settings', () => { expect(readLearningTools('{')).toEqual(defaultLearningTools); expect(readLearningTools('{"goal":99}').goal).toBe(2); });
  it('every lesson in all seven regions has Spanish audio material', () => {
    expect(ZONES).toHaveLength(7);
    for (const zone of ZONES) for (const lesson of zone.lessons) { expect(LESSONS[lesson.id]?.vocabulary.length).toBeGreaterThan(0); }
  });
  it('plays all Spanish sentences in order and stops', () => {
    const spoken: { text: string; lang: string; rate: number; onend: () => void }[] = [];
    vi.stubGlobal('SpeechSynthesisUtterance', class { text: string; constructor(text: string) { this.text = text; } });
    vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), getVoices: () => [], speak: (value: typeof spoken[number]) => spoken.push(value) });
    playSpanish(['Hola', 'Buenos días'], 'lesson');
    expect(spoken[0].text).toBe('Hola'); expect(spoken[0].lang).toBe('es-ES'); expect(spoken[0].rate).toBe(DEFAULT_SPEECH_RATE);
    spoken[0].onend(); expect(spoken[1].text).toBe('Buenos días');
    stopSpanish(); expect(getSpeechState().activeId).toBeNull();
    vi.unstubAllGlobals();
  });
});