interface XPBarProps {
  xp: number;
  xpToNext: number;
  level: number;
  compact?: boolean;
}

export default function XPBar({ xp, xpToNext, level, compact = false }: XPBarProps) {
  const progress = Math.min((xp / xpToNext) * 100, 100);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-pixel text-[0.5rem] text-primary">Lv.{level}</span>
        <div className="xp-bar-bg h-2 w-20 rounded-sm overflow-hidden">
          <div
            className="xp-bar-fill h-full transition-all duration-700 ease-out animate-xp-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-pixel text-[0.45rem] text-xp">{xp}/{xpToNext}</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="font-pixel text-xs text-primary">Level {level}</span>
        <span className="font-pixel text-[0.6rem] text-xp">{xp} / {xpToNext} XP</span>
      </div>
      <div className="xp-bar-bg h-4 rounded-sm overflow-hidden">
        <div
          className="xp-bar-fill h-full transition-all duration-700 ease-out rounded-sm"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
