import { useEffect, useState } from 'react';

interface SVGProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  icon: string;
  label: string;
  labelEs: string;
}

export default function SVGProgressRing({ value, max, size = 100, strokeWidth = 6, icon, label, labelEs }: SVGProgressRingProps) {
  const [offset, setOffset] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = max > 0 ? Math.min(value / max, 1) : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference * (1 - progress));
    }, 100);
    return () => clearTimeout(timer);
  }, [circumference, progress]);

  return (
    <div className="flex flex-col items-center group" style={{ perspective: '400px' }}>
      <div
        className="relative transition-transform duration-300 group-hover:[transform:rotateX(8deg)_rotateY(-5deg)]"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: 'stroke-dashoffset 1.2s ease-out',
              filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))',
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className="font-pixel text-xs text-secondary" style={{ filter: 'drop-shadow(0 0 4px hsl(var(--secondary) / 0.4))' }}>
            {value}
          </span>
        </div>
      </div>
      <p className="font-pixel text-[0.4rem] text-muted-foreground mt-1.5 text-center">{label}</p>
      <p className="font-mono text-[0.45rem] text-primary/60 text-center">{labelEs}</p>
    </div>
  );
}
