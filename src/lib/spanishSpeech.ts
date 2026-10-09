export const DEFAULT_SPEECH_RATE = 0.85;
type SpeechState = { activeId: string | null; error: string | null };
let state: SpeechState = { activeId: null, error: null };
let generation = 0;
const listeners = new Set<() => void>();
function update(next: SpeechState) { state = next; listeners.forEach(listener => listener()); }
export const subscribeSpeech = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const getSpeechState = () => state;
export function stopSpanish() {
  generation++;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  update({ activeId: null, error: null });
}
export function playSpanish(texts: string[], id: string, rate = DEFAULT_SPEECH_RATE) {
  stopSpanish();
  if (!('speechSynthesis' in window)) {
    update({ activeId: null, error: 'متصفحك لا يدعم النطق الصوتي. جرّب متصفحًا يدعم صوتيات الجهاز.' });
    return;
  }
  const queue = texts.map(text => text.trim()).filter(Boolean);
  if (!queue.length) return;
  const token = generation;
  update({ activeId: id, error: null });
  const speakNext = (index: number) => {
    if (token !== generation) return;
    const text = queue[index];
    if (!text) { update({ activeId: null, error: null }); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = rate;
    utterance.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.toLowerCase() === 'es-es') || voices.find(v => v.lang.startsWith('es'));
    if (voice) utterance.voice = voice;
    utterance.onend = () => speakNext(index + 1);
    utterance.onerror = event => {
      if (token !== generation) return;
      generation++;
      window.speechSynthesis.cancel();
      update({ activeId: null, error: event.error === 'not-allowed' ? 'اسمح بتشغيل الصوت في المتصفح ثم اضغط تشغيل.' : 'تعذّر تشغيل الصوت الإسباني. تحقق من أصوات الجهاز وإعدادات المتصفح.' });
    };
    window.speechSynthesis.speak(utterance);
  };
  speakNext(0);
}