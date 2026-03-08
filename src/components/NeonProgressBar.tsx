import { motion } from 'framer-motion';

interface NeonProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export default function NeonProgressBar({ progress, className = '' }: NeonProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div
      className={`relative w-full h-1 bg-muted/40 overflow-visible rounded-full ${className}`}
      style={{
        boxShadow: '0 0 4px hsl(var(--muted) / 0.2)',
      }}
    >
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        initial={{ width: '0%' }}
        animate={{ width: `${clampedProgress}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 18, mass: 0.8 }}
        style={{
          background: 'linear-gradient(90deg, hsl(var(--accent)), hsl(var(--destructive)))',
          boxShadow:
            '0 0 8px hsl(var(--accent) / 0.6), 0 0 16px hsl(var(--accent) / 0.3), 0 0 24px hsl(var(--destructive) / 0.2)',
        }}
      >
        {/* Leading pulse dot */}
        {clampedProgress > 0 && clampedProgress < 100 && (
          <motion.div
            className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full"
            style={{
              background: 'hsl(var(--destructive))',
              boxShadow:
                '0 0 6px hsl(var(--destructive) / 0.8), 0 0 14px hsl(var(--accent) / 0.5)',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Completed glow burst */}
        {clampedProgress >= 100 && (
          <motion.div
            className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: 'hsl(var(--accent))',
              boxShadow: '0 0 10px hsl(var(--accent) / 0.9), 0 0 20px hsl(var(--accent) / 0.4)',
            }}
            initial={{ scale: 1.8, opacity: 1 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>
    </div>
  );
}
