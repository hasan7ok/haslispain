import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Pen, Eraser, Type, Image as ImageIcon, Trash2, Download, Palette, Undo2, Redo2, Circle, Save, FolderOpen, Plus, Loader2, Brush, Pencil, Highlighter } from 'lucide-react';
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

export default function JournalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const [entryTitle, setEntryTitle] = useState('تدوينة جديدة');
  const [saving, setSaving] = useState(false);
  const [showEntries, setShowEntries] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canvasReady, setCanvasReady] = useState(false);

  const currentPen = PEN_TYPES.find(p => p.id === selectedPen) || PEN_TYPES[1];

  // Load entries list
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

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth - 8;
    canvas.height = 600;
    clearCanvasBackground(canvas);
    setCanvasReady(true);
  }, []);

  const clearCanvasBackground = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,0,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
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

    // Draw images (async)
    drawImages.forEach(action => {
      if (!action.imageData) return;
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, action.x || 0, action.y || 0, action.width || 200, action.height || 200);
        // Redraw paths on top of images
        actions.forEach(a => { if (a.type === 'path') drawPath(a); });
      };
      img.src = action.imageData;
    });
  }, [actions]);

  useEffect(() => {
    if (canvasReady) redrawCanvas();
  }, [actions, canvasReady, redrawCanvas]);

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

    // Live preview stroke
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

  // Save to DB
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
      // Refresh list
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
    setEntryTitle('تدوينة جديدة');
    setTextContent('');
    setActions([]);
    setUndoneActions([]);
    setShowEntries(false);
  };

  const deleteEntry = async (id: string) => {
    if (!confirm('هل تريد حذف هذه التدوينة؟')) return;
    await supabase.from('journal_entries').delete().eq('id', id);
    setEntries(prev => prev.filter(e => e.id !== id));
    if (currentEntryId === id) newEntry();
    toast.success('تم الحذف');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-4xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pixel-card-primary p-6 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-pixel text-sm text-primary mb-1">📝 التدوين - Diario</h1>
            <p className="font-body text-xs text-muted-foreground">ارسم، اكتب، أضف صور... عبّر عن إبداعك!</p>
          </div>
          <div className="flex gap-2">
            <button onClick={newEntry} className="p-2 border-2 border-accent/50 text-accent hover:bg-accent/10 transition-all" title="تدوينة جديدة">
              <Plus size={18} />
            </button>
            <button onClick={() => setShowEntries(!showEntries)} className="p-2 border-2 border-secondary/50 text-secondary hover:bg-secondary/10 transition-all" title="التدوينات المحفوظة">
              <FolderOpen size={18} />
            </button>
            <button onClick={saveEntry} disabled={saving} className="px-3 py-1 border-2 border-primary text-primary hover:bg-primary/10 transition-all font-pixel text-[0.45rem] flex items-center gap-1">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              حفظ
            </button>
          </div>
        </motion.div>

        {/* Saved entries panel */}
        {showEntries && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pixel-card p-4 mb-4 max-h-60 overflow-y-auto">
            <h3 className="font-pixel text-[0.5rem] text-secondary mb-3">التدوينات المحفوظة</h3>
            {loading ? (
              <div className="text-center py-4"><Loader2 size={20} className="animate-spin text-muted-foreground mx-auto" /></div>
            ) : entries.length === 0 ? (
              <p className="text-muted-foreground font-body text-xs text-center py-4">لا توجد تدوينات محفوظة</p>
            ) : (
              <div className="space-y-2">
                {entries.map(entry => (
                  <div key={entry.id} className={`flex items-center justify-between p-2 border-2 transition-all cursor-pointer ${currentEntryId === entry.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground'}`}>
                    <button onClick={() => loadEntry(entry)} className="flex-1 text-right">
                      <p className="font-pixel text-[0.45rem] text-foreground">{entry.title}</p>
                      <p className="font-body text-[0.6rem] text-muted-foreground">{new Date(entry.updated_at).toLocaleDateString('ar')}</p>
                    </button>
                    <button onClick={() => deleteEntry(entry.id)} className="p-1 text-destructive/50 hover:text-destructive ml-2"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Title */}
        <div className="pixel-card p-3 mb-3">
          <input
            value={entryTitle}
            onChange={e => setEntryTitle(e.target.value)}
            className="w-full bg-transparent font-pixel text-[0.6rem] text-foreground focus:outline-none placeholder:text-muted-foreground/50"
            placeholder="عنوان التدوينة..."
            dir="auto"
          />
        </div>

        {/* Text area */}
        <div className="pixel-card p-4 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Type size={14} className="text-secondary" />
            <span className="font-pixel text-[0.45rem] text-secondary">الكتابة</span>
          </div>
          <textarea
            value={textContent}
            onChange={e => setTextContent(e.target.value)}
            placeholder="اكتب أفكارك هنا... Escribe tus ideas aquí..."
            className="w-full min-h-[100px] bg-muted/30 border-2 border-border p-3 text-foreground font-body text-sm resize-y focus:outline-none focus:border-primary placeholder:text-muted-foreground/40"
            dir="auto"
          />
        </div>

        {/* Drawing toolbar */}
        <div className="pixel-card p-3 mb-1">
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
            <button onClick={() => fileInputRef.current?.click()} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all">
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
        <div ref={containerRef} className="pixel-card p-1 mb-6 overflow-hidden">
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
      </main>
    </div>
  );
}
