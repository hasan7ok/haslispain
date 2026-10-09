import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, BookOpen, ArrowLeft, RotateCcw, Eye, Trash2, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LESSONS } from '@/data/vocabulary';
import { ZONES } from '@/data/zones';
import { useLearningTools } from '@/hooks/useLearningTools';
import { localDay, toggleItem } from '@/lib/learningTools';
import SpanishAudio from '@/components/SpanishAudio';

export default function ProfileLearningPanel() {
  const { tools, updateTools } = useLearningTools();
  const navigate = useNavigate();
  const [card, setCard] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const words = Object.values(LESSONS).flatMap(lesson => lesson.vocabulary).filter((word, index, all) => tools.words.includes(word.word) && all.findIndex(value => value.word === word.word) === index);
  const current = words[card % Math.max(1, words.length)];
  const dailyCount = tools.dailyDate === localDay() ? tools.dailyLessons.length : 0;
  const lessons = ZONES.flatMap(zone => zone.lessons);
  const resumeLesson = lessons.find(lesson => lesson.id === tools.resume?.lessonId);
  return <section className="border-b border-border py-10" dir="rtl">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><h2 className="font-heading text-2xl font-semibold">مساحة التعلّم</h2><span className="text-xs text-muted-foreground">Mi aprendizaje</span></div>
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-7">
        <div><div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 font-semibold"><Target className="size-4 text-accent" />هدفي اليومي</h3><span className="text-sm text-primary">{dailyCount} / {tools.goal} دروس</span></div>
          <div className="mt-4 flex gap-2" role="group" aria-label="الهدف اليومي">{[1, 2, 3].map(goal => <Button key={goal} variant={tools.goal === goal ? 'default' : 'outline'} className="flex-1" aria-pressed={tools.goal === goal} onClick={() => updateTools(previous => ({ ...previous, goal }))}>{goal === 1 ? 'درس واحد' : `${goal} دروس`}</Button>)}</div>
          <div className="mt-3 h-1.5 overflow-hidden bg-muted"><div className="h-full origin-right bg-accent" style={{ transform: `scaleX(${Math.min(dailyCount / tools.goal, 1)})` }} /></div>
          {dailyCount >= tools.goal && <p className="mt-2 text-sm text-accent">أتممت هدف اليوم، أحسنت!</p>}
        </div>
        {resumeLesson && <div className="border-y border-border py-5"><p className="mb-2 text-xs text-primary">آخر نقطة توقّف</p><Button variant="ghost" className="h-auto w-full justify-between whitespace-normal p-0 text-right hover:bg-transparent hover:text-primary" onClick={() => navigate(`/lesson/${resumeLesson.id}`)}><span><span className="block text-base font-semibold">{resumeLesson.titleAr}</span><span className="text-xs text-muted-foreground">البطاقة {(tools.resume?.card || 0) + 1} · {resumeLesson.title}</span></span><ArrowLeft /></Button></div>}
        <div><h3 className="mb-3 flex items-center gap-2 font-semibold"><Bookmark className="size-4 text-primary" />دروسي المفضّلة</h3>{tools.bookmarks.length ? <div className="divide-y divide-border">{tools.bookmarks.map(id => { const lesson = lessons.find(value => value.id === id); return lesson ? <div key={id} className="flex items-center gap-2 py-2"><Button variant="ghost" className="h-auto flex-1 justify-start whitespace-normal text-right" onClick={() => navigate(`/lesson/${id}`)}><BookOpen /><span>{lesson.titleAr}</span></Button><Button variant="ghost" size="icon" title="إزالة من المفضّلة" aria-label={`إزالة ${lesson.titleAr}`} onClick={() => updateTools(previous => ({ ...previous, bookmarks: toggleItem(previous.bookmarks, id) }))}><Trash2 /></Button></div> : null; })}</div> : <p className="text-sm text-muted-foreground">لم تحفظ دروسًا في المفضّلة بعد.</p>}</div>
      </div>
      <div><div className="mb-4 flex items-center justify-between gap-3"><h3 className="font-semibold">مراجعة مفرداتي</h3><span className="text-xs text-muted-foreground">{words.length} كلمة محفوظة</span></div>
        {current ? <div className="rounded-md border border-border bg-card/40 p-5 sm:p-7"><p className="mb-6 text-xs text-muted-foreground">{card % words.length + 1} / {words.length}</p><p dir="ltr" className="text-center font-heading text-3xl font-semibold leading-relaxed">{current.word}</p>
          <div className="my-5 flex min-h-20 flex-col items-center justify-center gap-2">{revealed ? <><p className="text-lg text-primary">{current.translationAr}</p><p dir="ltr" className="text-center text-sm text-muted-foreground">{current.example}</p></> : <Button variant="ghost" onClick={() => setRevealed(true)}><Eye />كشف المعنى</Button>}</div>
          <SpanishAudio texts={[current.word, current.example]} id={`review-${current.word}`} label="استمع للمفردة" />
          <div className="mt-4 flex justify-between gap-2"><Button variant="ghost" size="icon" title="حذف الكلمة" aria-label="حذف الكلمة" onClick={() => { updateTools(previous => ({ ...previous, words: toggleItem(previous.words, current.word) })); setRevealed(false); }}><Trash2 /></Button><Button variant="outline" onClick={() => { setCard(value => value + 1); setRevealed(false); }}><RotateCcw />الكلمة التالية</Button></div>
        </div> : <div className="border-y border-border py-10"><p className="text-muted-foreground">لا توجد مفردات محفوظة بعد.</p><Button variant="link" className="mt-3 px-0" onClick={() => navigate('/zone/pueblo')}>العودة إلى الدروس<ArrowLeft /></Button></div>}
      </div>
    </div>
  </section>;
}