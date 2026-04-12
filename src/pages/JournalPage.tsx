import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  ArrowLeft, Pen, Eraser, Type, Image as ImageIcon, Trash2, Download, Palette,
  Undo2, Redo2, Circle, Save, FolderOpen, Plus, Brush, Pencil, Highlighter,
  BookOpen, FileText, Bold, Italic, List, AlignRight, AlignLeft, AlignCenter,
  Edit3, Search, Clock, Star, StarOff, Hash, ChevronDown, Copy, Scissors,
  ZoomIn, ZoomOut, Grid3X3, Heading1, Heading2, Quote, Code, Link2,
  CheckSquare, Strikethrough, SortAsc, SortDesc, Tag, Filter, MoreVertical
} from 'lucide-react';
import { PixelLoader } from '@/components/PixelLoader';
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
type SortOrder = 'newest' | 'oldest' | 'alpha';

export default function JournalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
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

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);
  const [entryTitle, setEntryTitle] = useState(() => new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);

  // New advanced features
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [autoSaveTimer, setAutoSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);

  const currentPen = PEN_TYPES.find(p => p.id === selectedPen) || PEN_TYPES[1];

  // Word/char count
  useEffect(() => {
    const words = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharCount(textContent.length);
  }, [textContent]);

  // Auto-save (every 30s if changes)
  useEffect(() => {
    if (!user || !currentEntryId) return;
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      saveEntry(true);
    }, 30000);
    setAutoSaveTimer(timer);
    return () => clearTimeout(timer);
  }, [textContent, actions, entryTitle]);

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
    ctx.fillStyle = '#12121e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,0,255,0.06)';
    ctx.lineWidth = 1;
    for (let y = 30; y < canvas.height; y += 32) {
      ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(canvas.width - 10, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(0,255,255,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(36, 0); ctx.lineTo(36, canvas.height); ctx.stroke();
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
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
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
      for (let i = 1; i < action.points.length; i++) ctx.lineTo(action.points[i].x, action.points[i].y);
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
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => { e.preventDefault(); setIsDrawing(true); currentPath.current = [getPos(e)]; };
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const pos = getPos(e);
    currentPath.current.push(pos);
    const canvas = canvasRef.current; const ctx = canvas?.getContext('2d');
    if (!ctx || currentPath.current.length < 2) return;
    const pts = currentPath.current;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (tool === 'eraser') { ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = 'rgba(0,0,0,1)'; ctx.lineWidth = eraserSize; }
    else { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = currentPen.opacity; ctx.strokeStyle = penColor; ctx.lineWidth = currentPen.size; }
    ctx.beginPath(); ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y); ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y); ctx.stroke(); ctx.restore();
  };
  const endDraw = () => {
    if (!isDrawing) return; setIsDrawing(false);
    if (currentPath.current.length > 1) {
      setActions(prev => [...prev, { type: 'path', points: [...currentPath.current], color: penColor, lineWidth: tool === 'eraser' ? eraserSize : currentPen.size, eraser: tool === 'eraser', penType: selectedPen }]);
      setUndoneActions([]);
    }
    currentPath.current = [];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current; if (!canvas) return;
        const maxW = canvas.width * 0.7; const ratio = img.width / img.height;
        const w = Math.min(img.width, maxW); const h = w / ratio;
        setActions(prev => [...prev, { type: 'image', imageData: dataUrl, x: (canvas.width - w) / 2, y: 20, width: w, height: h }]);
        setUndoneActions([]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file); e.target.value = '';
  };

  const undo = () => { if (!actions.length) return; setUndoneActions(prev => [...prev, actions[actions.length - 1]]); setActions(prev => prev.slice(0, -1)); };
  const redo = () => { if (!undoneActions.length) return; setActions(prev => [...prev, undoneActions[undoneActions.length - 1]]); setUndoneActions(prev => prev.slice(0, -1)); };
  const clearAll = () => { if (confirm('هل تريد مسح كل الرسم؟')) { setActions([]); setUndoneActions([]); } };
  const downloadCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement('a'); link.download = `journal-${Date.now()}.png`; link.href = canvas.toDataURL('image/png'); link.click();
  };

  const saveEntry = async (silent = false) => {
    if (!user) return;
    setSaving(true);
    try {
      const canvasData = JSON.stringify(actions);
      if (currentEntryId) {
        await supabase.from('journal_entries').update({ title: entryTitle, text_content: textContent, canvas_data: canvasData }).eq('id', currentEntryId).eq('user_id', user.id);
      } else {
        const { data } = await supabase.from('journal_entries').insert({ user_id: user.id, title: entryTitle, text_content: textContent, canvas_data: canvasData }).select('id').single();
        if (data) setCurrentEntryId(data.id);
      }
      const { data: all } = await supabase.from('journal_entries').select('id, title, text_content, canvas_data, created_at, updated_at').eq('user_id', user.id).order('updated_at', { ascending: false });
      if (all) setEntries(all);
      setLastSaved(new Date());
      if (!silent) toast.success('تم الحفظ بنجاح! ✅');
    } catch { if (!silent) toast.error('حدث خطأ أثناء الحفظ'); }
    setSaving(false);
  };

  const loadEntry = (entry: JournalEntry) => {
    setCurrentEntryId(entry.id); setEntryTitle(entry.title); setTextContent(entry.text_content || '');
    try { setActions(JSON.parse(entry.canvas_data || '[]')); } catch { setActions([]); }
    setUndoneActions([]);
    if (isMobile) setSidebarOpen(false);
  };

  const newEntry = () => {
    setCurrentEntryId(null);
    setEntryTitle(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }));
    setTextContent(''); setActions([]); setUndoneActions([]);
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

  const duplicateEntry = async (entry: JournalEntry) => {
    if (!user) return;
    const { data } = await supabase.from('journal_entries').insert({
      user_id: user.id, title: `${entry.title} (نسخة)`, text_content: entry.text_content, canvas_data: entry.canvas_data,
    }).select('id, title, text_content, canvas_data, created_at, updated_at').single();
    if (data) { setEntries(prev => [data, ...prev]); toast.success('تم نسخ التدوينة'); }
  };

  const insertTextFormatting = (prefix: string, suffix: string = '') => {
    const area = textAreaRef.current; if (!area) return;
    const start = area.selectionStart; const end = area.selectionEnd;
    const selected = textContent.substring(start, end);
    const newText = textContent.substring(0, start) + prefix + selected + (suffix || prefix) + textContent.substring(end);
    setTextContent(newText);
    setTimeout(() => { area.focus(); area.setSelectionRange(start + prefix.length, end + prefix.length); }, 0);
  };

  const insertAtCursor = (text: string) => {
    const area = textAreaRef.current; if (!area) return;
    const start = area.selectionStart;
    const newText = textContent.substring(0, start) + text + textContent.substring(start);
    setTextContent(newText);
    setTimeout(() => { area.focus(); area.setSelectionRange(start + text.length, start + text.length); }, 0);
  };

  const exportAsText = () => {
    const blob = new Blob([`# ${entryTitle}\n\n${textContent}`], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a'); link.download = `${entryTitle}.txt`; link.href = URL.createObjectURL(blob); link.click();
  };

  const exportAsMarkdown = () => {
    const blob = new Blob([`# ${entryTitle}\n\n${textContent}`], { type: 'text/markdown;charset=utf-8' });
    const link = document.createElement('a'); link.download = `${entryTitle}.md`; link.href = URL.createObjectURL(blob); link.click();
  };

  // Filtered & sorted entries
  const filteredEntries = entries
    .filter(e => !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.text_content?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortOrder === 'oldest') return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      return a.title.localeCompare(b.title, 'ar');
    });

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveEntry(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); newEntry(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); insertTextFormatting('**'); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); insertTextFormatting('*'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [textContent, entryTitle, actions, currentEntryId]);

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? 'fixed inset-0 z-[100]' : ''}`}>
      {!isFullscreen && <Header />}
      <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[calc(100vh-60px)]'}`}>
        {/* Sidebar */}
        {/* Sidebar overlay backdrop on mobile */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        )}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: isMobile ? '85vw' : 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={`border-l-2 border-border bg-card/95 backdrop-blur-sm flex flex-col overflow-hidden shrink-0 ${
                isMobile ? 'fixed right-0 top-0 bottom-0 z-50' : ''
              }`}
            >
              {/* Sidebar header */}
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-pixel text-[0.5rem] text-primary flex items-center gap-1.5">
                    <BookOpen size={14} /> المفكرة
                  </h2>
                  <div className="flex gap-1">
                    <button onClick={newEntry} className="p-1.5 border border-accent/50 text-accent hover:bg-accent/10 transition-all" title="جديد (Ctrl+N)">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                {/* Search */}
                <div className="relative">
                  <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="بحث..."
                    className="w-full bg-background/50 border border-border text-xs font-body text-foreground pr-7 pl-2 py-1.5 focus:outline-none focus:border-primary transition-colors"
                    dir="auto"
                  />
                </div>
                {/* Sort */}
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => setSortOrder('newest')} className={`px-2 py-1 text-[0.4rem] font-pixel border transition-all ${sortOrder === 'newest' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                    الأحدث
                  </button>
                  <button onClick={() => setSortOrder('oldest')} className={`px-2 py-1 text-[0.4rem] font-pixel border transition-all ${sortOrder === 'oldest' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                    الأقدم
                  </button>
                  <button onClick={() => setSortOrder('alpha')} className={`px-2 py-1 text-[0.4rem] font-pixel border transition-all ${sortOrder === 'alpha' ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground'}`}>
                    أبجدي
                  </button>
                </div>
              </div>

              {/* Entries list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading ? (
                  <div className="text-center py-8"><PixelLoader size={20} className="text-muted-foreground mx-auto" /></div>
                ) : filteredEntries.length === 0 ? (
                  <p className="text-muted-foreground font-body text-xs text-center py-8">
                    {searchQuery ? 'لا توجد نتائج' : 'لا توجد تدوينات بعد'}
                  </p>
                ) : (
                  filteredEntries.map(entry => (
                    <div
                      key={entry.id}
                      className={`group p-2.5 border transition-all cursor-pointer hover:shadow-[0_0_8px_rgba(255,0,255,0.08)] ${
                        currentEntryId === entry.id ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-muted-foreground'
                      }`}
                    >
                      {editingTitleId === entry.id ? (
                        <div className="flex gap-1">
                          <input value={editingTitleValue} onChange={e => setEditingTitleValue(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && renameEntry(entry.id, editingTitleValue)}
                            className="flex-1 bg-background px-1 py-0.5 text-[0.55rem] font-body text-foreground border border-primary focus:outline-none" dir="auto" autoFocus />
                          <button onClick={() => renameEntry(entry.id, editingTitleValue)} className="text-accent"><Save size={10} /></button>
                        </div>
                      ) : (
                        <button onClick={() => loadEntry(entry)} className="w-full text-right">
                          <p className="font-pixel text-[0.42rem] text-foreground truncate">{entry.title}</p>
                          <p className="font-body text-[0.55rem] text-muted-foreground mt-0.5 line-clamp-2">
                            {entry.text_content?.slice(0, 60) || 'رسم فقط'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock size={9} className="text-muted-foreground/60" />
                            <span className="font-mono text-[0.45rem] text-muted-foreground/60">
                              {new Date(entry.updated_at).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </button>
                      )}
                      <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingTitleId(entry.id); setEditingTitleValue(entry.title); }} className="text-muted-foreground hover:text-secondary p-0.5" title="إعادة تسمية"><Edit3 size={10} /></button>
                        <button onClick={() => duplicateEntry(entry)} className="text-muted-foreground hover:text-accent p-0.5" title="نسخ"><Copy size={10} /></button>
                        <button onClick={() => deleteEntry(entry.id)} className="text-muted-foreground hover:text-destructive p-0.5" title="حذف"><Trash2 size={10} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Sidebar footer stats */}
              <div className="p-2 border-t border-border text-center">
                <span className="font-mono text-[0.45rem] text-muted-foreground">{entries.length} تدوينة</span>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top toolbar */}
          <div className="border-b-2 border-border bg-card/60 backdrop-blur-sm px-2 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 shrink-0 flex-wrap">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="الشريط الجانبي">
              <FolderOpen size={16} />
            </button>

            {!isFullscreen && (
              <button onClick={() => navigate('/')} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={16} />
              </button>
            )}

            {/* Title */}
            <input
              value={entryTitle} onChange={e => setEntryTitle(e.target.value)}
              className="flex-1 bg-transparent font-pixel text-[0.6rem] text-foreground focus:outline-none placeholder:text-muted-foreground/50 border-b border-dashed border-transparent focus:border-primary/30 px-2"
              placeholder="✏️ عنوان التدوينة..." dir="auto"
            />

            {/* Status indicators */}
            <div className="hidden sm:flex items-center gap-2">
              {lastSaved && (
                <span className="font-mono text-[0.45rem] text-muted-foreground/60 flex items-center gap-1">
                  <Clock size={9} /> آخر حفظ {lastSaved.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <span className="font-mono text-[0.45rem] text-muted-foreground">{wordCount} كلمة · {charCount} حرف</span>
            </div>

            {/* Save & export */}
            <div className="flex items-center gap-1">
              <button onClick={() => saveEntry()} disabled={saving}
                className="px-3 py-1.5 border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-all font-pixel text-[0.4rem] flex items-center gap-1">
                {saving ? <PixelLoader size={12} className="text-primary" /> : <Save size={12} />} حفظ
              </button>
              <div className="relative group">
                <button className="p-1.5 border border-border text-muted-foreground hover:text-foreground transition-all">
                  <Download size={14} />
                </button>
                <div className="absolute left-0 top-full mt-1 bg-card border-2 border-border p-1 z-50 hidden group-hover:block min-w-[100px]">
                  <button onClick={exportAsText} className="w-full text-right px-2 py-1 text-[0.45rem] font-body text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all">.txt</button>
                  <button onClick={exportAsMarkdown} className="w-full text-right px-2 py-1 text-[0.45rem] font-body text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all">.md</button>
                  {activeTab === 'draw' && (
                    <button onClick={downloadCanvas} className="w-full text-right px-2 py-1 text-[0.45rem] font-body text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all">.png</button>
                  )}
                </div>
              </div>
              <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 border border-border text-muted-foreground hover:text-foreground transition-all" title="ملء الشاشة">
                {isFullscreen ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
              </button>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-border bg-card/30 shrink-0">
            <button onClick={() => setActiveTab('write')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-pixel text-[0.45rem] transition-all border-b-2 ${
                activeTab === 'write' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <Type size={14} /> الكتابة
            </button>
            <button onClick={() => setActiveTab('draw')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 font-pixel text-[0.45rem] transition-all border-b-2 ${
                activeTab === 'draw' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <Pen size={14} /> الرسم
            </button>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            {/* Writing tab */}
            {activeTab === 'write' && (
              <div className="flex flex-col h-full">
                {/* Advanced formatting toolbar */}
                <div className="flex items-center gap-1 px-3 py-2 border-b border-border bg-card/20 flex-wrap shrink-0">
                  <button onClick={() => insertTextFormatting('**')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="غامق (Ctrl+B)"><Bold size={13} /></button>
                  <button onClick={() => insertTextFormatting('*')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="مائل (Ctrl+I)"><Italic size={13} /></button>
                  <button onClick={() => insertTextFormatting('~~')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="يتوسطه خط"><Strikethrough size={13} /></button>
                  <div className="w-px h-5 bg-border" />
                  <button onClick={() => insertAtCursor('\n# ')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="عنوان رئيسي"><Heading1 size={13} /></button>
                  <button onClick={() => insertAtCursor('\n## ')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="عنوان فرعي"><Heading2 size={13} /></button>
                  <div className="w-px h-5 bg-border" />
                  <button onClick={() => insertAtCursor('\n• ')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="قائمة"><List size={13} /></button>
                  <button onClick={() => insertAtCursor('\n- [ ] ')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="مهمة"><CheckSquare size={13} /></button>
                  <button onClick={() => insertTextFormatting('\n> ', '')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="اقتباس"><Quote size={13} /></button>
                  <button onClick={() => insertTextFormatting('`')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="كود"><Code size={13} /></button>
                  <div className="w-px h-5 bg-border" />
                  <button onClick={() => { if (textAreaRef.current) textAreaRef.current.style.textAlign = 'right'; }} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all"><AlignRight size={13} /></button>
                  <button onClick={() => { if (textAreaRef.current) textAreaRef.current.style.textAlign = 'center'; }} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all"><AlignCenter size={13} /></button>
                  <button onClick={() => { if (textAreaRef.current) textAreaRef.current.style.textAlign = 'left'; }} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all"><AlignLeft size={13} /></button>
                  <div className="w-px h-5 bg-border" />
                  <button onClick={() => insertAtCursor('\n---\n')} className="p-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="خط فاصل">—</button>
                </div>

                {/* Text editor */}
                <div className="flex-1 p-4">
                  <textarea
                    ref={textAreaRef}
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                    placeholder="ابدأ الكتابة هنا... اكتب ملاحظاتك، أفكارك، أو ما تعلمته اليوم ✍️&#10;&#10;اختصارات: Ctrl+S للحفظ، Ctrl+B للتغميق، Ctrl+I للمائل"
                    className="w-full h-full min-h-[400px] bg-transparent text-foreground font-body text-sm resize-none focus:outline-none placeholder:text-muted-foreground/30 leading-8"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(255,0,255,0.04) 31px, rgba(255,0,255,0.04) 32px)',
                      backgroundSize: '100% 32px',
                      paddingTop: '8px',
                    }}
                    dir="auto"
                  />
                </div>
              </div>
            )}

            {/* Drawing tab */}
            {activeTab === 'draw' && (
              <div>
                <div className="border-b border-border bg-card/20 p-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <div className="relative">
                      <button onClick={() => { setTool('pen'); setShowPenTypes(!showPenTypes); setShowColorPicker(false); setShowEraserSizes(false); }}
                        className={`p-2 border-2 transition-all flex items-center gap-1 ${tool === 'pen' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                        {(() => { const Icon = currentPen.icon; return <Icon size={16} />; })()}
                        <span className="font-pixel text-[0.35rem] hidden sm:inline">{currentPen.name}</span>
                      </button>
                      {showPenTypes && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-30 space-y-1 min-w-[120px]">
                          {PEN_TYPES.map(pen => {
                            const Icon = pen.icon;
                            return (
                              <button key={pen.id} onClick={() => { setSelectedPen(pen.id); setTool('pen'); setShowPenTypes(false); }}
                                className={`w-full flex items-center gap-2 p-1.5 border-2 transition-all ${selectedPen === pen.id ? 'border-primary bg-primary/10' : 'border-transparent hover:border-border'}`}>
                                <Icon size={14} /> <span className="font-pixel text-[0.4rem]">{pen.name}</span>
                                <div className="ml-auto rounded-full bg-foreground" style={{ width: Math.min(pen.size, 12), height: Math.min(pen.size, 12), opacity: pen.opacity }} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <button onClick={() => { setTool('eraser'); setShowEraserSizes(!showEraserSizes); setShowColorPicker(false); setShowPenTypes(false); }}
                        className={`p-2 border-2 transition-all ${tool === 'eraser' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                        <Eraser size={16} />
                      </button>
                      {showEraserSizes && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-30 flex gap-1.5">
                          {ERASER_SIZES.map(s => (
                            <button key={s} onClick={() => { setEraserSize(s); setShowEraserSizes(false); }}
                              className={`w-8 h-8 flex items-center justify-center border-2 transition-all ${eraserSize === s ? 'border-primary bg-primary/20' : 'border-border'}`}>
                              <div className="rounded-full bg-muted-foreground" style={{ width: Math.min(s, 18), height: Math.min(s, 18) }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="w-px h-7 bg-border" />
                    <div className="relative">
                      <button onClick={() => { setShowColorPicker(!showColorPicker); setShowPenTypes(false); setShowEraserSizes(false); }}
                        className="p-2 border-2 border-border hover:border-primary transition-all flex items-center gap-1">
                        <Circle size={14} fill={penColor} stroke={penColor} /> <Palette size={11} className="text-muted-foreground" />
                      </button>
                      {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-30 grid grid-cols-5 gap-1.5">
                          {PEN_COLORS.map(c => (
                            <button key={c} onClick={() => { setPenColor(c); setShowColorPicker(false); }}
                              className={`w-6 h-6 border-2 transition-all ${penColor === c ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'}`}
                              style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="w-px h-7 bg-border" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all" title="إدراج صورة"><ImageIcon size={16} /></button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="w-px h-7 bg-border" />
                    <button onClick={undo} disabled={!actions.length} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"><Undo2 size={14} /></button>
                    <button onClick={redo} disabled={!undoneActions.length} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"><Redo2 size={14} /></button>
                    <div className="flex-1" />
                    <button onClick={clearAll} className="p-2 border-2 border-destructive/50 text-destructive hover:bg-destructive/10 transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div ref={containerRef} className="p-1 overflow-hidden">
                  <canvas
                    ref={canvasRef} className="w-full cursor-crosshair touch-none" style={{ minHeight: 500 }}
                    onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                    onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
