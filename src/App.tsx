import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import AuthPage from "@/pages/AuthPage";
import WelcomeQuiz from "@/components/WelcomeQuiz";
import Index from "./pages/Index";
import ZonePage from "./pages/ZonePage";
import LessonPage from "./pages/LessonPage";
import SentenceForgePage from "./pages/SentenceForgePage";
import WordHuntPage from "./pages/WordHuntPage";
import ProfilePage from "./pages/ProfilePage";
import AIChatPage from "./pages/AIChatPage";
import AchievementsPage from "./pages/AchievementsPage";
import JournalPage from "./pages/JournalPage";
import DailyChallengePage from "./pages/DailyChallengePage";
import StoriesListPage from "./pages/StoriesListPage";
import StoryPage from "./pages/StoryPage";
import BossFightsListPage from "./pages/BossFightsListPage";
import GrammarBossPage from "./pages/GrammarBossPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/hooks/useAuth";
import { useGameState } from "@/hooks/useGameState";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function AppContent() {
  const [showSplash, setShowSplash] = useState(() => {
    const seen = sessionStorage.getItem('pixnol-splash-seen');
    return !seen;
  });

  const auth = useAuth();
  const { updateUsername } = useGameState();

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('pixnol-splash-seen', 'true');
  };

  // Sync username to game state on load
  useEffect(() => {
    if (auth.profile?.username && auth.profile.quiz_completed) {
      const currentState = localStorage.getItem('pixnol-game-state');
      if (currentState) {
        const parsed = JSON.parse(currentState);
        if (parsed.username !== auth.profile.username) {
          updateUsername(auth.profile.username);
        }
      } else {
        updateUsername(auth.profile.username);
      }
    }
  }, [auth.profile?.username, auth.profile?.quiz_completed, updateUsername]);

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // Loading auth state
  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
          <p className="font-pixel text-[0.5rem] text-muted-foreground">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Not logged in → show auth page or how-it-works
  if (!auth.user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="*" element={
            <AuthPage
              onSignUp={auth.signUp}
              onSignIn={auth.signIn}
              checkUsername={auth.checkUsernameAvailable}
            />
          } />
        </Routes>
      </BrowserRouter>
    );
  }

  // Logged in but quiz not completed → show quiz
  if (auth.profile && !auth.profile.quiz_completed) {
    return (
      <WelcomeQuiz
        onComplete={async (results, level) => {
          await auth.updateProfile({
            quiz_completed: true,
            quiz_results: results,
            level,
          });
          if (auth.user) {
            await supabase.rpc('award_nft', { p_unlock_condition: 'signup' });
          }
          if (auth.profile?.username) {
            updateUsername(auth.profile.username);
          }
          await auth.refreshProfile();
        }}
      />
    );
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
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/daily-challenge" element={<DailyChallengePage />} />
        <Route path="/stories" element={<StoriesListPage />} />
        <Route path="/story/:storyId" element={<StoryPage />} />
        <Route path="/boss-fights" element={<BossFightsListPage />} />
        <Route path="/boss/:bossId" element={<GrammarBossPage />} />
        <Route path="/settings" element={<SettingsPage />} />
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
