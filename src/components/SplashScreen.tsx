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
      'rgba(255, 255, 255,',
      'rgba(173, 216, 255,',
      'rgba(135, 206, 250,',
      'rgba(200, 230, 255,',
      'rgba(220, 240, 255,',
    ];

    // Create particles
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
    let startTime = Date.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        // Draw pixel-style square particle
        ctx.fillStyle = `${p.color} ${Math.max(0, p.opacity)})`;
        ctx.fillRect(
          Math.round(p.x),
          Math.round(p.y),
          Math.round(p.size),
          Math.round(p.size)
        );

        // Add glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = `${p.color} 0.3)`;
        ctx.fillRect(
          Math.round(p.x),
          Math.round(p.y),
          Math.round(p.size),
          Math.round(p.size)
        );
        ctx.shadowBlur = 0;
      });

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(173, 216, 255, ${0.15 * (1 - dist / 100)})`;
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

    // Auto-dismiss after 3.5 seconds
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
          style={{ background: 'linear-gradient(135deg, hsl(228, 40%, 6%), hsl(220, 50%, 12%), hsl(228, 40%, 6%))' }}
          onClick={() => { setVisible(false); setTimeout(onComplete, 600); }}
        >
          <canvas ref={canvasRef} className="absolute inset-0" />
          <div className="relative z-10 text-center">
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="font-pixel text-3xl md:text-5xl mb-4"
              style={{
                color: '#fff',
                textShadow: '0 0 20px rgba(135,206,250,0.8), 0 0 40px rgba(135,206,250,0.4), 0 0 60px rgba(100,180,255,0.2)',
              }}
            >
              PIXÑOL
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="font-pixel text-[0.55rem] md:text-xs"
              style={{ color: 'rgba(173,216,255,0.9)' }}
            >
              Aprende Español con RPG
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="font-body text-sm mt-4"
              style={{ color: 'rgba(200,230,255,0.7)' }}
            >
              تعلّم الإسبانية بأسلوب RPG
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 2, repeat: Infinity, duration: 2 }}
              className="font-body text-xs mt-8"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              اضغط للمتابعة...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
