import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Plus, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
interface Entry { id: string; title: string; text_content: string | null; updated_at: string }
export default function ProfileJournals({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setLoading(true); setError(false);
    supabase.from('journal_entries').select('id, title, text_content, updated_at').eq('user_id', userId).order('updated_at', { ascending: false }).limit(6).then(({ data, error: failure }) => {
      if (cancelled) return;
      setEntries(data || []); setError(Boolean(failure)); setLoading(false);
    });
    return () => { cancelled = true; };
  }, [userId, retry]);
  return <section className="border-b border-border py-10" dir="rtl">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="mb-2 text-xs text-accent">Mi cuaderno</p><h2 className="font-heading text-2xl font-semibold">تدويناتي المحفوظة</h2></div><Button variant="outline" onClick={() => navigate('/journal')}><Plus />تدوينة جديدة</Button></div>
    {loading ? <p role="status" className="py-8 text-muted-foreground">جارٍ تحميل التدوينات…</p> : error ? <div role="alert" className="flex flex-wrap items-center gap-3"><p className="text-destructive">تعذّر تحميل تدويناتك.</p><Button variant="outline" onClick={() => setRetry(value => value + 1)}><RefreshCw />إعادة المحاولة</Button></div> : !entries.length ? <div className="py-8 text-center"><FileText className="mx-auto mb-3 size-7 text-accent" /><p className="text-muted-foreground">لم تحفظ أي تدوينات بعد.</p><Button variant="link" onClick={() => navigate('/journal')}>ابدأ تدوينتك الأولى<ArrowLeft /></Button></div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{entries.map(entry => <Button key={entry.id} variant="ghost" onClick={() => navigate(`/journal?entry=${entry.id}`)} className="h-auto min-h-44 flex-col items-stretch justify-start gap-3 whitespace-normal rounded-md border border-border bg-card/40 p-5 text-right hover:bg-muted"><span className="flex items-center justify-between text-xs text-accent"><FileText /><span>{new Date(entry.updated_at).toLocaleDateString('ar', { day: 'numeric', month: 'short' })}</span></span><span className="line-clamp-1 font-heading text-base font-semibold">{entry.title}</span><span className="line-clamp-2 text-sm leading-7 text-muted-foreground">{entry.text_content?.replace(/[#*_`>]/g, '') || 'تدوينة مرسومة'}</span></Button>)}</div>}
    <Button variant="link" className="mt-5 px-0" onClick={() => navigate('/journal')}>جميع التدوينات<ArrowLeft /></Button>
  </section>;
}