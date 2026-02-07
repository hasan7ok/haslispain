import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/pages/LoginPage";
import Index from "./pages/Index";
import ZonePage from "./pages/ZonePage";
import LessonPage from "./pages/LessonPage";
import SentenceForgePage from "./pages/SentenceForgePage";
import WordHuntPage from "./pages/WordHuntPage";
import ProfilePage from "./pages/ProfilePage";
import AIChatPage from "./pages/AIChatPage";
import AchievementsPage from "./pages/AchievementsPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import StoriesListPage from "./pages/StoriesListPage";
import StoryPage from "./pages/StoryPage";
import BossFightsListPage from "./pages/BossFightsListPage";
import GrammarBossPage from "./pages/GrammarBossPage";
import NotFound from "./pages/NotFound";
import { useGameState } from "@/hooks/useGameState";

const queryClient = new QueryClient();

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem('pixnol-splash-seen');
    return !seen;
  });
  const { state, updateUsername } = useGameState();

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('pixnol-splash-seen', 'true');
  };

  const handleLogin = (username: string) => {
    updateUsername(username);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (!state.username) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/zone/:zoneId" element={<ZonePage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/game/sentence-forge" element={<SentenceForgePage />} />
        <Route path="/game/word-hunt" element={<WordHuntPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/daily-challenge" element={<DailyChallengePage />} />
        <Route path="/stories" element={<StoriesListPage />} />
        <Route path="/story/:storyId" element={<StoryPage />} />
        <Route path="/boss-fights" element={<BossFightsListPage />} />
        <Route path="/boss/:bossId" element={<GrammarBossPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
