import { CharacterConfig } from '@/hooks/useGameState';

interface PixelCharacterProps {
  character: CharacterConfig;
  size?: number;
  animate?: boolean;
  className?: string;
}

// Character grid: 0=transparent, 1=hair, 2=skin, 3=outfit, 4=boots, 5=eyes
const HAIR_STYLES = [
  // Style 0: Classic
  [
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
  ],
  // Style 1: Spiky
  [
    [0,1,0,1,0,1,0],
    [0,1,1,1,1,1,0],
  ],
  // Style 2: Long
  [
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
  ],
];

const BODY_GRID = [
  [0,2,2,2,2,2,0],
  [0,2,5,2,5,2,0],
  [0,2,2,2,2,2,0],
  [0,0,2,2,2,0,0],
  [0,3,3,3,3,3,0],
  [0,3,3,3,3,3,0],
  [0,3,3,3,3,3,0],
  [0,0,3,0,3,0,0],
  [0,0,4,0,4,0,0],
];

const ACCESSORIES: Record<number, { row: number; col: number; color: string }[]> = {
  0: [], // None
  1: [{ row: 2, col: 0, color: '#ffd700' }], // Earring
  2: [{ row: 0, col: 3, color: '#ff4444' }], // Crown dot
};

export default function PixelCharacter({ character, size = 6, animate = false, className = '' }: PixelCharacterProps) {
  const hairGrid = HAIR_STYLES[character.hairStyle % HAIR_STYLES.length];
  const fullGrid = [...hairGrid, ...BODY_GRID];

  const colorMap: Record<number, string> = {
    0: 'transparent',
    1: character.hairColor,
    2: character.skinColor,
    3: character.outfitColor,
    4: character.bootsColor,
    5: character.eyeColor,
  };

  return (
    <div
      className={`inline-block ${animate ? 'animate-pixel-float' : ''} ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <div
        className="grid gap-0"
        style={{
          gridTemplateColumns: `repeat(7, ${size}px)`,
          gridTemplateRows: `repeat(${fullGrid.length}, ${size}px)`,
        }}
      >
        {fullGrid.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            const accessory = ACCESSORIES[character.accessory % Object.keys(ACCESSORIES).length];
            const accItem = accessory?.find(a => a.row === rowIdx && a.col === colIdx);

            return (
              <div
                key={`${rowIdx}-${colIdx}`}
                style={{
                  width: size,
                  height: size,
                  backgroundColor: accItem ? accItem.color : colorMap[cell] || 'transparent',
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
