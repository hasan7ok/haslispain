import { cn } from '@/lib/utils';

interface PixelLoaderProps {
  size?: number;
  className?: string;
}

export function PixelLoader({ size = 24, className }: PixelLoaderProps) {
  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 40 40"
        width={size}
        height={size}
        className="animate-spin"
        style={{ animationDuration: '1.2s' }}
      >
        <polygon
          points="20,2 36.6,12 36.6,28 20,38 3.4,28 3.4,12"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="90"
          strokeDashoffset="30"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default PixelLoader;
