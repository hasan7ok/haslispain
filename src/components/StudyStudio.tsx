import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Timer, CalendarDays, Sparkles, Lock, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SpanishAudio from '@/components/SpanishAudio';
import { useGameState } from '@/hooks/useGameState';
import { useLearningTools } from '@/hooks/useLearningTools';
import { dailyPhrase, remainingFocusSeconds, searchContent } from '@/lib/studyStudio';

const DAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

export default function StudyStudio() {
  const navigate = useNavigate();
  const { state } = useGameState();
  const { tools, updateTools } = useLearningTools();
  const [query, setQuery] = useState('');
  const [deadline, setDeadline] = useState<number | null>(null);
  const [left, setLeft] = useState(25 * 60);
  const phrase = dailyPhrase();
  const results = query.trim() ? searchContent(query, state.unlockedZones).slice(0, 6) : [];

  useEffect(() => {
    if (!deadline) return;
    const id = window.setInterval(() => {
      const rest = remainingFocusSeconds(deadline, Date.now());
      setLeft(rest);
      if (!rest) setDeadline(null);
    }, 500);
    return () => window.clearInterval(id);
  }, [deadline]);

  const card = 'glass-panel rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-xl';
  return <section dir="rtl" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <div className="mb-6 flex items-end justify-between gap-3"><h2 className="font-heading text-2xl font-semibold sm:text-3xl">استوديو الدراسة</h2><span className="text-xs text-muted-foreground">Estudio</span></div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className={`${card} lg:col-span-2`}>
        <h3 className="mb-3 flex items-center gap-2 font-semibold"><Search className="size-4 text-primary" />ابحث في الدروس والثقافة</h3>
        <Input value={query} onChange={event => setQuery(event.target.value)} placeholder="مثال: gracias، مطعم، الكلاسيكو" aria-label="بحث" />
        <div className="mt-3 divide-y divide-border">{results.map(item => <button key={item.path} disabled={item.locked} onClick={() => navigate(item.path)} className="flex w-full items-center justify-between gap-2 py-2 text-right text-sm disabled:opacity-50"><span><span className="block font-medium">{item.title}</span><span className="text-xs text-muted-foreground" dir="ltr">{item.subtitle}</span></span><span className="flex items-center gap-1 text-xs text-primary">{item.locked && <Lock className="size-3" />}{item.kind}</span></button>)}
          {query.trim() && !results.length && <p className="py-2 text-sm text-muted-foreground">لا نتائج.</p>}</div>
      </div>
      <div className={card}>
        <h3 className="mb-3 flex items-center gap-2 font-semibold"><Sparkles className="size-4 text-accent" />عبارة اليوم</h3>
        <p dir="ltr" className="font-heading text-2xl font-semibold">{phrase.word}</p>
        <p className="mt-1 text-primary">{phrase.translationAr}</p>
        <p dir="ltr" className="mt-2 text-sm text-muted-foreground">{phrase.example}</p>
        <div className="mt-3"><SpanishAudio texts={[phrase.word, phrase.example]} id="daily-phrase" label="استمع" /></div>
      </div>
      <div className={card}>
        <h3 className="mb-3 flex items-center gap-2 font-semibold"><Timer className="size-4 text-primary" />جلسة تركيز</h3>
        <p className="text-center font-heading text-4xl font-semibold tabular-nums" dir="ltr">{String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}</p>
        <div className="mt-4 flex gap-2">
          {deadline ? <Button className="flex-1" variant="outline" onClick={() => setDeadline(null)}><Pause />إيقاف</Button> : <Button className="flex-1" onClick={() => setDeadline(Date.now() + (left || 25 * 60) * 1000)}><Play />ابدأ</Button>}
          <Button variant="ghost" size="icon" aria-label="إعادة" onClick={() => { setDeadline(null); setLeft(25 * 60); }}><RotateCcw /></Button>
        </div>
      </div>
      <div className={`${card} md:col-span-2 lg:col-span-4`}>
        <h3 className="mb-3 flex items-center gap-2 font-semibold"><CalendarDays className="size-4 text-accent" />أيام الدراسة الأسبوعية</h3>
        <div className="grid grid-cols-7 gap-1.5">{DAYS.map((day, index) => { const on = tools.studyDays.includes(index); return <Button key={day} size="sm" variant={on ? 'default' : 'outline'} aria-pressed={on} className="px-0 text-xs" onClick={() => updateTools(previous => ({ ...previous, studyDays: on ? previous.studyDays.filter(value => value !== index) : [...previous.studyDays, index].sort() }))}>{day}</Button>; })}</div>
        <p className="mt-2 text-xs text-muted-foreground">{tools.studyDays.length} أيام في الأسبوع · {tools.studyDays.includes(new Date().getDay()) ? 'اليوم يوم دراسة' : 'اليوم يوم راحة'}</p>
      </div>
    </div>
  </section>;
}
