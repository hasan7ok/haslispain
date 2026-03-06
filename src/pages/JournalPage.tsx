import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Pen, Eraser, Type, Image as ImageIcon, Trash2, Download, Palette, Undo2, Redo2, Circle, Save, FolderOpen, Plus, Loader2, Brush, Pencil, Highlighter, BookOpen, FileText, Bold, Italic, List, AlignRight, AlignLeft, AlignCenter } from 'lucide-react';
import { toast } from 'sonner';

interface DrawPoint { x: number; y: number; }

interface DrawAction {
  type: 'path' | 'image';
  points?: DrawPoint[];
  color?: string;
  lineWidth?: number;
  eraser?: boolean;
  penType?: string;
  imageData?: string;
  x?: number; y?: number; width?: number; height?: number;
}

interface JournalEntry {
  id: string;
  title: string;
  text_content: string;
  canvas_data: string;
  created_at: string;
  updated_at: string;
}

const PEN_COLORS = [
  '#ffffff', '#ff00ff', '#00ffff', '#ff9900', '#ff5050',
  '#39ff14', '#ffff00', '#8b5cf6', '#3b82f6', '#000000',
  '#f472b6', '#a78bfa', '#34d399', '#fbbf24', '#ef4444',
];

const PEN_TYPES = [
  { id: 'fine', name: 'دقيق', icon: Pencil, size: 2, opacity: 1 },
  { id: 'normal', name: 'عادي', icon: Pen, size: 4, opacity: 1 },
  { id: 'thick', name: 'سميك', icon: Brush, size: 10, opacity: 1 },
  { id: 'marker', name: 'ماركر', icon: Highlighter, size: 20, opacity: 0.5 },
  { id: 'brush-xl', name: 'فرشاة كبيرة', icon: Brush, size: 32, opacity: 0.7 },
];

const ERASER_SIZES = [8, 16, 32, 48];

type ActiveTab = 'write' | 'draw';

export default function JournalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('write');
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState('#ffffff');
  const [selectedPen, setSelectedPen] = useState('normal');
  const [eraserSize, setEraserSize] = useState(16);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showPenTypes, setShowPenTypes] = useState(false);
  const [showEraserSizes, setShowEraserSizes] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<DrawAction[]>([]);
  const currentPath = useRef<DrawPoint[]>([]);

  // Journal list
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [entryTitle, setEntryTitle] = useState(() => new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [saving, setSaving] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');

  const currentPen = PEN_TYPES.find(p => p.id === selectedPen) || PEN_TYPES[1];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from('journal_entries')
        .select('id, title, text_content, canvas_data, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (data) setEntries(data);
      setLoading(false);
    };
    load();
  }, [user]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth - 8;
    canvas.height = 600;
    clearCanvasBackground(canvas);
    setCanvasReady(true);
  }, [activeTab]);

  const clearCanvasBackground = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Notebook paper style
    ctx.fillStyle = '#12121e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ruled lines
    ctx.strokeStyle = 'rgba(255,0,255,0.06)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 32) {
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(canvas.width - 10, y); ctx.stroke();
    }
    // Left margin line
    ctx.strokeStyle = 'rgba(0,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(36, 0); ctx.lineTo(36, canvas.height); ctx.stroke();

    // Subtle dots grid
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    for (let x = 40; x < canvas.width; x += 32) {
      for (let y = 30; y < canvas.height; y += 32) {
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }
  };

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearCanvasBackground(canvas);

    const drawPath = (action: DrawAction) => {
      if (!action.points || action.points.length < 2) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (action.eraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = action.lineWidth || 16;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        const pen = PEN_TYPES.find(p => p.id === action.penType) || PEN_TYPES[1];
        ctx.globalAlpha = pen.opacity;
        ctx.strokeStyle = action.color || '#fff';
        ctx.lineWidth = action.lineWidth || pen.size;
      }

      ctx.beginPath();
      ctx.moveTo(action.points[0].x, action.points[0].y);
      for (let i = 1; i < action.points.length; i++) {
        ctx.lineTo(action.points[i].x, action.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawImages: DrawAction[] = [];
    actions.forEach(action => {
      if (action.type === 'path') drawPath(action);
      else if (action.type === 'image') drawImages.push(action);
    });

    drawImages.forEach(action => {
      if (!action.imageData) return;
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, action.x || 0, action.y || 0, action.width || 200, action.height || 200);
        actions.forEach(a => { if (a.type === 'path') drawPath(a); });
      };
      img.src = action.imageData;
    });
  }, [actions]);

  useEffect(() => {
    if (canvasReady && activeTab === 'draw') redrawCanvas();
  }, [actions, canvasReady, redrawCanvas, activeTab]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    currentPath.current = [pos];
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    currentPath.current.push(pos);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || currentPath.current.length < 2) return;

    const pts = currentPath.current;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = 'rgba(0,0,0,1)';
      ctx.lineWidth = eraserSize;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = currentPen.opacity;
      ctx.strokeStyle = penColor;
      ctx.lineWidth = currentPen.size;
    }

    ctx.beginPath();
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
    ctx.restore();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPath.current.length > 1) {
      const newAction: DrawAction = {
        type: 'path',
        points: [...currentPath.current],
        color: penColor,
        lineWidth: tool === 'eraser' ? eraserSize : currentPen.size,
        eraser: tool === 'eraser',
        penType: selectedPen,
      };
      setActions(prev => [...prev, newAction]);
      setUndoneActions([]);
    }
    currentPath.current = [];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const maxW = canvas.width * 0.7;
        const ratio = img.width / img.height;
        const w = Math.min(img.width, maxW);
        const h = w / ratio;
        const x = (canvas.width - w) / 2;
        const y = 20;
        setActions(prev => [...prev, { type: 'image', imageData: dataUrl, x, y, width: w, height: h }]);
        setUndoneActions([]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const undo = () => {
    if (actions.length === 0) return;
    setUndoneActions(prev => [...prev, actions[actions.length - 1]]);
    setActions(prev => prev.slice(0, -1));
  };

  const redo = () => {
    if (undoneActions.length === 0) return;
    setActions(prev => [...prev, undoneActions[undoneActions.length - 1]]);
    setUndoneActions(prev => prev.slice(0, -1));
  };

  const clearAll = () => {
    if (confirm('هل تريد مسح كل الرسم؟')) {
      setActions([]);
      setUndoneActions([]);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `journal-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveEntry = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const canvasData = JSON.stringify(actions);
      if (currentEntryId) {
        await supabase.from('journal_entries').update({
          title: entryTitle,
          text_content: textContent,
          canvas_data: canvasData,
        }).eq('id', currentEntryId).eq('user_id', user.id);
      } else {
        const { data } = await supabase.from('journal_entries').insert({
          user_id: user.id,
          title: entryTitle,
          text_content: textContent,
          canvas_data: canvasData,
        }).select('id').single();
        if (data) setCurrentEntryId(data.id);
      }
      const { data: all } = await supabase
        .from('journal_entries')
        .select('id, title, text_content, canvas_data, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      if (all) setEntries(all);
      toast.success('تم الحفظ بنجاح! ✅');
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  };

  const loadEntry = (entry: JournalEntry) => {
    setCurrentEntryId(entry.id);
    setEntryTitle(entry.title);
    setTextContent(entry.text_content || '');
    try {
      const parsed = JSON.parse(entry.canvas_data || '[]');
      setActions(parsed);
    } catch {
      setActions([]);
    }
    setUndoneActions([]);
    setShowEntries(false);
  };

  const newEntry = () => {
    setCurrentEntryId(null);
    setEntryTitle(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
    setTextContent('');
    setActions([]);
    setUndoneActions([]);
    setShowEntries(false);
  };

  const renameEntry = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    await supabase.from('journal_entries').update({ title: newTitle.trim() }).eq('id', id);
    setEntries(prev => prev.map(e => e.id === id ? { ...e, title: newTitle.trim() } : e));
    if (currentEntryId === id) setEntryTitle(newTitle.trim());
    setEditingTitleId(null);
    toast.success('تم تغيير العنوان');
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('هل تريد حذف هذه التدوينة؟')) return;
    await supabase.from('journal_entries').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
    if (currentEntryId === id) newEntry();
    toast.success('تم الحذف');
  };

  const insertTextFormatting = (prefix: string, suffix: string = '') => {
    const area = textAreaRef.current;
    if (!area) return;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const selected = textContent.substring(start, end);
    const newText = textContent.substring(0, start) + prefix + selected + (suffix || prefix) + textContent.substring(end);
    setTextContent(newText);
    setTimeout(() => {
      area.focus();
      area.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-4xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        {/* Notebook header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="relative p-6 mb-4 border-2 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5"
          style={{ boxShadow: '0 4px 20px rgba(255,0,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
          {/* Notebook binding dots */}
          <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col justify-around items-center py-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/30" />
            ))}
          </div>

          <div className="pl-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BookOpen size={22} className="text-primary" />
              <div>
                <h1 className="font-pixel text-sm text-primary mb-0.5">📓 المفكرة - Cuaderno</h1>
                <p className="font-body text-xs text-muted-foreground">مفكرتك الشخصية — اكتب، ارسم، أبدع!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={newEntry} className="p-2 border-2 border-accent/50 text-accent hover:bg-accent/10 transition-all" title="تدوينة جديدة">
                <Plus size={18} />
              </button>
              <button onClick={() => setShowEntries(!showEntries)} className="p-2 border-2 border-secondary/50 text-secondary hover:bg-secondary/10 transition-all relative" title="التدوينات المحفوظة">
                <FolderOpen size={18} />
                {entries.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[0.5rem] font-pixel flex items-center justify-center rounded-full">
                    {entries.length}
                  </span>
                )}
              </button>
              <button onClick={saveEntry} disabled={saving}
                className="px-4 py-2 border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all font-pixel text-[0.45rem] flex items-center gap-1.5">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                حفظ
              </button>
            </div>
          </div>
        </motion.div>

        {/* Saved entries panel */}
        {showEntries && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="border-2 border-border bg-card p-4 mb-4 max-h-64 overflow-y-auto">
            <h3 className="font-pixel text-[0.5rem] text-secondary mb-3 flex items-center gap-2">
              <FileText size={14} /> التدوينات المحفوظة ({entries.length})
            </h3>
            {loading ? (
              <div className="text-center py-4"><Loader2 size={20} className="animate-spin text-muted-foreground mx-auto" /></div>
            ) : entries.length === 0 ? (
              <p className="text-muted-foreground font-body text-xs text-center py-4">لا توجد تدوينات محفوظة بعد</p>
            ) : (
              <div className="space-y-2">
                {entries.map(entry => (
                  <div key={entry.id} className={`flex items-center justify-between p-3 border-2 transition-all cursor-pointer hover:shadow-[0_0_8px_rgba(255,0,255,0.1)] ${currentEntryId === entry.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'}`}>
                    <button onClick={() => loadEntry(entry)} className="flex-1 text-right">
                      <p className="font-pixel text-[0.45rem] text-foreground">{entry.title}</p>
                      <p className="font-body text-[0.6rem] text-muted-foreground">{new Date(entry.updated_at).toLocaleDateString('ar')} — {entry.text_content?.slice(0, 40) || 'رسم فقط'}...</p>
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1 text-destructive/50 hover:text-destructive ml-2"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Title input — notebook style */}
        <div className="border-2 border-border border-b-0 bg-card p-4">
          <input
            value={entryTitle}
            onChange={e => setEntryTitle(e.target.value)}
            className="w-full bg-transparent font-pixel text-[0.7rem] text-foreground focus:outline-none placeholder:text-muted-foreground/50 border-b-2 border-dashed border-primary/20 pb-2"
            placeholder="✏️ عنوان التدوينة..."
            dir="auto"
          />
        </div>

        {/* Tab switcher */}
        <div className="flex border-2 border-border border-t-0 border-b-0 bg-card">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-pixel text-[0.5rem] transition-all border-b-2 ${
              activeTab === 'write'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Type size={16} /> الكتابة
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-pixel text-[0.5rem] transition-all border-b-2 ${
              activeTab === 'draw'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Pen size={16} /> الرسم
          </button>
        </div>

        {/* Writing tab */}
        {activeTab === 'write' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="border-2 border-border border-t-0 bg-card mb-6 flex">
            {/* Sidebar toggle & archive */}
            <div className={`border-l border-border transition-all overflow-hidden ${showSidebar ? 'w-56 min-w-[14rem]' : 'w-10 min-w-[2.5rem]'}`}>
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="w-full p-2 text-muted-foreground hover:text-secondary transition-colors border-b border-border flex items-center justify-center"
                title="الأرشيف"
              >
                <FolderOpen size={16} />
              </button>
              {showSidebar && (
                <div className="p-2 space-y-1.5 max-h-[400px] overflow-y-auto">
                  <button onClick={newEntry} className="w-full flex items-center gap-1.5 p-2 text-accent hover:bg-accent/10 border border-accent/30 transition-all font-pixel text-[0.4rem]">
                    <Plus size={12} /> تدوينة جديدة
                  </button>
                  {entries.map(entry => (
                    <div key={entry.id} className={`p-2 border transition-all cursor-pointer ${currentEntryId === entry.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'}`}>
                      {editingTitleId === entry.id ? (
                        <div className="flex gap-1">
                          <input value={editingTitleValue} onChange={e => setEditingTitleValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && renameEntry(entry.id, editingTitleValue)}
                            className="flex-1 bg-background px-1 py-0.5 text-[0.55rem] font-body text-foreground border border-primary focus:outline-none" dir="auto" autoFocus />
                          <button onClick={() => renameEntry(entry.id, editingTitleValue)} className="text-accent"><Save size={10} /></button>
                        </div>
                      ) : (
                        <button onClick={() => loadEntry(entry)} className="w-full text-right">
                          <p className="font-pixel text-[0.4rem] text-foreground truncate">{entry.title}</p>
                          <p className="font-mono text-[0.45rem] text-muted-foreground">{new Date(entry.created_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}</p>
                        </button>
                      )}
                      <div className="flex gap-1 mt-1">
                        <button onClick={() => { setEditingTitleId(entry.id); setEditingTitleValue(entry.title); }} className="text-muted-foreground hover:text-secondary" title="إعادة تسمية">
                          <Edit3 size={10} />
                        </button>
                        <button onClick={() => deleteEntry(entry.id)} className="text-muted-foreground hover:text-destructive" title="حذف">
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Writing area */}
            <div className="flex-1 p-4">
              {/* Formatting toolbar */}
              <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-border">
                <button onClick={() => insertTextFormatting('**')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="غامق">
                  <Bold size={14} />
                </button>
                <button onClick={() => insertTextFormatting('*')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="مائل">
                  <Italic size={14} />
                </button>
                <button onClick={() => insertTextFormatting('• ', '')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="قائمة">
                  <List size={14} />
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button onClick={() => { if (textAreaRef.current) textAreaRef.current.style.textAlign = 'right'; }} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all">
                  <AlignRight size={14} />
                </button>
                <button onClick={() => { if (textAreaRef.current) textAreaRef.current.style.textAlign = 'center'; }} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all">
                  <AlignCenter size={14} />
                </button>
                <button onClick={() => { if (textAreaRef.current) textAreaRef.current.style.textAlign = 'left'; }} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all">
                  <AlignLeft size={14} />
                </button>
                <div className="flex-1" />
                <button onClick={saveEntry} disabled={saving}
                  className="flex items-center gap-1 px-2 py-1 border border-primary/50 text-primary hover:bg-primary/10 transition-all font-pixel text-[0.4rem]">
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  حفظ
                </button>
                <span className="font-mono text-[0.55rem] text-muted-foreground">{textContent.length} حرف</span>
              </div>

              <textarea
                ref={textAreaRef}
                value={textContent}
                onChange={e => setTextContent(e.target.value)}
                placeholder="ابدأ الكتابة هنا... اكتب ملاحظاتك، أفكارك، أو ما تعلمته اليوم ✍️"
                className="w-full min-h-[300px] bg-transparent text-foreground font-body text-sm resize-y focus:outline-none placeholder:text-muted-foreground/40 leading-8"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255,0,255,0.05) 31px, rgba(255,0,255,0.05) 32px)',
                  backgroundSize: '100% 32px',
                  paddingTop: '8px',
                }}
                dir="auto"
              />
            </div>
          </motion.div>
        )}

        {/* Drawing tab */}
        {activeTab === 'draw' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Drawing toolbar */}
            <div className="border-2 border-border border-t-0 bg-card p-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {/* Pen types */}
                <div className="relative">
                  <button onClick={() => { setTool('pen'); setShowPenTypes(!showPenTypes); setShowColorPicker(false); setShowEraserSizes(false); }}
                    className={`p-2 border-2 transition-all flex items-center gap-1 ${tool === 'pen' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                    {(() => { const Icon = currentPen.icon; return <Icon size={18} />; })()}
                    <span className="font-pixel text-[0.35rem] hidden sm:inline">{currentPen.name}</span>
                  </button>
                  {showPenTypes && (
                    <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-30 space-y-1 min-w-[120px]">
                      {PEN_TYPES.map(pen => {
                        const Icon = pen.icon;
                        return (
                          <button key={pen.id} onClick={() => { setSelectedPen(pen.id); setTool('pen'); setShowPenTypes(false); }}
                            className={`w-full flex items-center gap-2 p-1.5 border-2 transition-all ${selectedPen === pen.id ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}`}>
                            <Icon size={16} />
                            <span className="font-pixel text-[0.4rem]">{pen.name}</span>
                            <div className="ml-auto rounded-full bg-foreground" style={{ width: Math.min(pen.size, 12), height: Math.min(pen.size, 12), opacity: pen.opacity }} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Eraser */}
                <div className="relative">
                  <button onClick={() => { setTool('eraser'); setShowEraserSizes(!showEraserSizes); setShowColorPicker(false); setShowPenTypes(false); }}
                    className={`p-2 border-2 transition-all ${tool === 'eraser' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                    <Eraser size={18} />
                  </button>
                  {showEraserSizes && (
                    <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-30 flex gap-1.5">
                      {ERASER_SIZES.map(s => (
                        <button key={s} onClick={() => { setEraserSize(s); setShowEraserSizes(false); }}
                          className={`w-9 h-9 flex items-center justify-center border-2 transition-all ${eraserSize === s ? 'border-primary bg-primary/20' : 'border-border'}`}>
                          <div className="rounded-full bg-muted-foreground" style={{ width: Math.min(s, 20), height: Math.min(s, 20) }} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-8 bg-border" />

                {/* Color picker */}
                <div className="relative">
                  <button onClick={() => { setShowColorPicker(!showColorPicker); setShowPenTypes(false); setShowEraserSizes(false); }}
                    className="p-2 border-2 border-border hover:border-primary transition-all flex items-center gap-1">
                    <Circle size={16} fill={penColor} stroke={penColor} />
                    <Palette size={12} className="text-muted-foreground" />
                  </button>
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-30 grid grid-cols-5 gap-1.5">
                      {PEN_COLORS.map(c => (
                        <button key={c} onClick={() => { setPenColor(c); setShowColorPicker(false); }}
                          className={`w-7 h-7 border-2 transition-all ${penColor === c ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-8 bg-border" />

                {/* Image */}
                <button onClick={() => fileInputRef.current?.click()} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="إدراج صورة">
                  <ImageIcon size={18} />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

                <div className="w-px h-8 bg-border" />

                {/* Undo/Redo */}
                <button onClick={undo} disabled={actions.length === 0} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"><Undo2 size={16} /></button>
                <button onClick={redo} disabled={undoneActions.length === 0} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"><Redo2 size={16} /></button>

                <div className="flex-1" />

                <button onClick={clearAll} className="p-2 border-2 border-destructive/50 text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={16} /></button>
                <button onClick={downloadCanvas} className="p-2 border-2 border-accent/50 text-accent hover:bg-accent/10 transition-all"><Download size={16} /></button>
              </div>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="border-2 border-border border-t-0 bg-card p-1 mb-6 overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair touch-none"
                style={{ minHeight: 500 }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
