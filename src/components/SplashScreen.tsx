import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
}

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const colors = [
      'rgba(255, 0, 255,',   // magenta
      'rgba(0, 255, 255,',   // cyan
      'rgba(255, 153, 0,',   // orange
      'rgba(255, 100, 200,', // pink
      'rgba(150, 0, 255,',   // purple
    ];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2 - 0.5,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw perspective grid
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, canvas.height * 0.5);
        ctx.lineTo(x + (x - canvas.width / 2) * 0.5, canvas.height);
        ctx.stroke();
      }
      for (let y = canvas.height * 0.5; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity -= 0.001;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        ctx.fillStyle = `${p.color} ${Math.max(0, p.opacity)})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `${p.color} 0.5)`;
        ctx.fillRect(
          Math.round(p.x),
          Math.round(p.y),
          Math.round(p.size),
          Math.round(p.size)
        );
        ctx.shadowBlur = 0;
      });

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 3500);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #090014 0%, #1a0030 50%, #090014 100%)' }}
          onClick={() => { setVisible(false); setTimeout(onComplete, 600); }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />

          {/* Floating sun orb */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-[80px]"
            style={{ background: 'linear-gradient(to bottom, #FF9900, #FF00FF)' }}
          />

          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="font-pixel text-3xl md:text-5xl mb-4"
              style={{
                background: 'linear-gradient(to right, #FF9900, #FF00FF, #00FFFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 30px rgba(255,0,255,0.6))',
              }}
            >
              PIXÑOL
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="font-pixel text-[0.55rem] md:text-xs"
              style={{ color: '#00FFFF', filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.6))' }}
            >
              Aprende Español con RPG
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="font-body text-sm mt-4"
              style={{ color: 'rgba(224,224,224,0.7)' }}
            >
              طريقك لإتقان الإسبانية يبدأ هنا
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 2, repeat: Infinity, duration: 2 }}
              className="font-mono text-xs mt-8 uppercase tracking-widest"
              style={{ color: 'rgba(255,0,255,0.6)' }}
            >
              {'> '}اضغط للمتابعة...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
