import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { STORIES } from '@/data/stories';
import Header from '@/components/Header';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import storyCafe from '@/assets/story-cafe.jpg';
import storyHotel from '@/assets/story-hotel.jpg';
import storyMarket from '@/assets/story-market.jpg';

const STORY_IMAGES: Record<string, string> = {
  'story-cafe': storyCafe,
  'story-hotel': storyHotel,
  'story-market': storyMarket,
};

export default function StoriesListPage() {
  const navigate = useNavigate();
  const [zoomedId, setZoomedId] = useState<string | null>(null);

  const toggleZoom = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setZoomedId(prev => prev === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-3 py-6 max-w-2xl">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-4">
          <ArrowLeft size={16} /> العودة للخريطة
        </button>

        <div className="pixel-card-primary p-6 mb-6 text-center">
          <BookOpen size={28} className="text-primary mx-auto mb-3" />
          <h1 className="font-pixel text-sm text-primary mb-1">القصص التفاعلية</h1>
          <p className="font-pixel text-[0.5rem] text-muted-foreground">Historias Interactivas</p>
          <p className="text-foreground font-body text-sm mt-2">اختر حوارك وتعلم من أخطائك!</p>
        </div>

        <div className="space-y-3">
          {STORIES.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <button
                onClick={() => navigate(`/story/${story.id}`)}
                className="w-full pixel-card p-4 hover:border-primary hover:translate-y-[-1px] transition-all group flex items-center gap-4"
              >
                <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 80, height: 60 }}>
                  <img
                    src={STORY_IMAGES[story.id] || storyCafe}
                    alt={story.titleAr}
                    width={80}
                    height={60}
                    loading="lazy"
                    onClick={(e) => toggleZoom(e, story.id)}
                    className={`w-full h-full object-cover rounded story-image-zoom ${zoomedId === story.id ? 'zoomed' : ''}`}
                  />
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <h3 className="font-pixel text-[0.6rem] text-primary">{story.title}</h3>
                  <p className="text-foreground font-body text-sm mt-0.5">{story.titleAr}</p>
                  <p className="text-muted-foreground font-body text-xs mt-1">{story.descriptionAr}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-pixel text-[0.4rem] text-muted-foreground border border-border px-2 py-0.5">{story.level}</span>
                  <span className="font-pixel text-[0.4rem] text-accent">+{story.xpReward} XP</span>
                  <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
