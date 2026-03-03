import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { ArrowLeft, Pen, Eraser, Type, Image as ImageIcon, Trash2, Download, Palette, Minus, Plus, Undo2, Redo2, Circle } from 'lucide-react';

interface DrawPoint {
  x: number;
  y: number;
}

interface DrawAction {
  type: 'path' | 'image';
  points?: DrawPoint[];
  color?: string;
  lineWidth?: number;
  eraser?: boolean;
  imageData?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

const PEN_COLORS = [
  '#ffffff', '#ff00ff', '#00ffff', '#ff9900', '#ff5050',
  '#39ff14', '#ffff00', '#8b5cf6', '#3b82f6', '#000000',
];

const BRUSH_SIZES = [2, 4, 6, 10, 16, 24];

export default function JournalPage() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tool, setTool] = useState<'pen' | 'eraser' | 'text'>('pen');
  const [penColor, setPenColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBrushSizes, setShowBrushSizes] = useState(false);
  const [textEntries, setTextEntries] = useState<string>('');
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<DrawAction[]>([]);
  const currentPath = useRef<DrawPoint[]>([]);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = Math.max(500, container.clientHeight);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw subtle grid
      ctx.strokeStyle = 'rgba(255,0,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(255,0,255,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Replay actions
    actions.forEach(action => {
      if (action.type === 'path' && action.points && action.points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = action.eraser ? '#1a1a2e' : (action.color || '#fff');
        ctx.lineWidth = action.lineWidth || 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = action.eraser ? 'destination-out' : 'source-over';
        ctx.moveTo(action.points[0].x, action.points[0].y);
        for (let i = 1; i < action.points.length; i++) {
          ctx.lineTo(action.points[i].x, action.points[i].y);
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
      } else if (action.type === 'image' && action.imageData) {
        const img = new window.Image();
        img.src = action.imageData;
        img.onload = () => {
          ctx.drawImage(img, action.x || 0, action.y || 0, action.width || 200, action.height || 200);
        };
      }
    });
  }, [actions]);

  useEffect(() => {
    redrawCanvas();
  }, [actions, redrawCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (tool === 'text') return;
    setIsDrawing(true);
    const pos = getPos(e);
    currentPath.current = [pos];

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.strokeStyle = tool === 'eraser' ? '#1a1a2e' : penColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || tool === 'text') return;
    const pos = getPos(e);
    currentPath.current.push(pos);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.globalCompositeOperation = 'source-over';
    }

    if (currentPath.current.length > 1) {
      setActions(prev => [...prev, {
        type: 'path',
        points: [...currentPath.current],
        color: penColor,
        lineWidth: brushSize,
        eraser: tool === 'eraser',
      }]);
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
        const maxW = canvas.width * 0.6;
        const ratio = img.width / img.height;
        const w = Math.min(img.width, maxW);
        const h = w / ratio;
        const x = (canvas.width - w) / 2;
        const y = 20;

        setActions(prev => [...prev, {
          type: 'image',
          imageData: dataUrl,
          x, y, width: w, height: h,
        }]);
        setUndoneActions([]);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const undo = () => {
    if (actions.length === 0) return;
    const last = actions[actions.length - 1];
    setActions(prev => prev.slice(0, -1));
    setUndoneActions(prev => [...prev, last]);
  };

  const redo = () => {
    if (undoneActions.length === 0) return;
    const last = undoneActions[undoneActions.length - 1];
    setUndoneActions(prev => prev.slice(0, -1));
    setActions(prev => [...prev, last]);
  };

  const clearCanvas = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-4xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pixel-card-primary p-6 mb-6 text-center">
          <h1 className="font-pixel text-sm text-primary mb-1">📝 التدوين - Diario</h1>
          <p className="font-body text-xs text-muted-foreground">ارسم، اكتب، أضف صور... عبّر عن إبداعك!</p>
        </motion.div>

        {/* Text entry area */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="pixel-card p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Type size={16} className="text-secondary" />
            <h3 className="font-pixel text-[0.5rem] text-secondary">الكتابة - Escritura</h3>
          </div>
          <textarea
            ref={textAreaRef}
            value={textEntries}
            onChange={e => setTextEntries(e.target.value)}
            placeholder="اكتب أفكارك هنا... Escribe tus ideas aquí..."
            className="w-full min-h-[120px] bg-muted/50 border-2 border-border rounded-none p-3 text-foreground font-body text-sm resize-y focus:outline-none focus:border-primary placeholder:text-muted-foreground/50"
            dir="auto"
          />
        </motion.div>

        {/* Drawing toolbar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="pixel-card p-3 mb-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tool buttons */}
            <button onClick={() => setTool('pen')} className={`p-2 border-2 transition-all ${tool === 'pen' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              <Pen size={18} />
            </button>
            <button onClick={() => setTool('eraser')} className={`p-2 border-2 transition-all ${tool === 'eraser' ? 'border-primary bg-primary/20 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
              <Eraser size={18} />
            </button>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Color picker */}
            <div className="relative">
              <button onClick={() => { setShowColorPicker(!showColorPicker); setShowBrushSizes(false); }} className="p-2 border-2 border-border hover:border-primary transition-all flex items-center gap-1">
                <Circle size={18} fill={penColor} stroke={penColor} />
                <Palette size={14} className="text-muted-foreground" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-20 grid grid-cols-5 gap-1.5">
                  {PEN_COLORS.map(c => (
                    <button key={c} onClick={() => { setPenColor(c); setShowColorPicker(false); }} className={`w-7 h-7 border-2 transition-all ${penColor === c ? 'border-primary scale-110' : 'border-border hover:border-muted-foreground'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              )}
            </div>

            {/* Brush size */}
            <div className="relative">
              <button onClick={() => { setShowBrushSizes(!showBrushSizes); setShowColorPicker(false); }} className="p-2 border-2 border-border hover:border-primary transition-all flex items-center gap-1 text-muted-foreground">
                <Minus size={12} />
                <span className="font-pixel text-[0.4rem] w-4 text-center">{brushSize}</span>
                <Plus size={12} />
              </button>
              {showBrushSizes && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-card border-2 border-border z-20 flex gap-2">
                  {BRUSH_SIZES.map(s => (
                    <button key={s} onClick={() => { setBrushSize(s); setShowBrushSizes(false); }} className={`flex items-center justify-center w-8 h-8 border-2 transition-all ${brushSize === s ? 'border-primary bg-primary/20' : 'border-border'}`}>
                      <div className="rounded-full bg-foreground" style={{ width: s, height: s }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-8 bg-border mx-1" />

            {/* Image upload */}
            <button onClick={() => fileInputRef.current?.click()} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground hover:border-primary transition-all">
              <ImageIcon size={18} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

            <div className="w-px h-8 bg-border mx-1" />

            {/* Undo/Redo */}
            <button onClick={undo} disabled={actions.length === 0} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
              <Undo2 size={18} />
            </button>
            <button onClick={redo} disabled={undoneActions.length === 0} className="p-2 border-2 border-border text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all">
              <Redo2 size={18} />
            </button>

            <div className="flex-1" />

            {/* Clear & Download */}
            <button onClick={clearCanvas} className="p-2 border-2 border-destructive/50 text-destructive hover:bg-destructive/10 transition-all">
              <Trash2 size={18} />
            </button>
            <button onClick={downloadCanvas} className="p-2 border-2 border-accent/50 text-accent hover:bg-accent/10 transition-all">
              <Download size={18} />
            </button>
          </div>
        </motion.div>

        {/* Canvas */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pixel-card p-1 mb-6 overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full cursor-crosshair touch-none"
            style={{ minHeight: 500, imageRendering: 'auto' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </motion.div>
      </main>
    </div>
  );
}
