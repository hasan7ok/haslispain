import { motion } from 'framer-motion';
import PixelAvatar from './PixelAvatar';

export interface NFTItem {
  id: string;
  name: string;
  description: string | null;
  image_seed: string;
  rarity: string;
  category: string;
  frame_style: string;
  unlock_condition: string | null;
  earned: boolean;
  earned_at?: string;
}

interface NFTCollectionProps {
  nfts: NFTItem[];
  title?: string;
}

const RARITY_CONFIG: Record<string, { label: string; color: string; bgClass: string }> = {
  common: { label: 'عادي', color: 'text-muted-foreground', bgClass: 'border-border' },
  uncommon: { label: 'غير عادي', color: 'text-accent', bgClass: 'border-accent/50' },
  rare: { label: 'نادر', color: 'text-pixel-purple', bgClass: 'border-purple-500/50' },
  legendary: { label: 'أسطوري', color: 'text-primary', bgClass: 'border-primary/50' },
};

export default function NFTCollection({ nfts, title = 'مجموعة NFT' }: NFTCollectionProps) {
  return (
    <div>
      <h3 className="font-pixel text-[0.6rem] text-foreground mb-4 flex items-center gap-2">
        🖼️ {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {nfts.map((nft, idx) => {
          const rarity = RARITY_CONFIG[nft.rarity] || RARITY_CONFIG.common;
          return (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`pixel-card p-3 text-center relative ${
                nft.earned ? rarity.bgClass : 'opacity-40 grayscale'
              }`}
            >
              {nft.earned && nft.rarity === 'legendary' && (
                <div className="absolute inset-0 animate-pixel-glow pointer-events-none" />
              )}
              <div className="flex justify-center mb-2">
                <PixelAvatar
                  seed={nft.image_seed}
                  size={64}
                  frameStyle={nft.earned ? nft.frame_style : undefined}
                />
              </div>
              <p className="font-pixel text-[0.4rem] text-foreground mb-1 truncate">{nft.name}</p>
              <span className={`font-pixel text-[0.35rem] ${rarity.color}`}>
                {rarity.label}
              </span>
              {nft.earned && (
                <p className="text-[0.55rem] text-muted-foreground font-body mt-1">✅ مُكتسب</p>
              )}
              {!nft.earned && nft.description && (
                <p className="text-[0.55rem] text-muted-foreground font-body mt-1">{nft.description}</p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
