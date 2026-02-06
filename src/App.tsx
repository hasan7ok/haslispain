import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ZonePage from "./pages/ZonePage";
import LessonPage from "./pages/LessonPage";
import SentenceForgePage from "./pages/SentenceForgePage";
import WordHuntPage from "./pages/WordHuntPage";
import ProfilePage from "./pages/ProfilePage";
import AIChatPage from "./pages/AIChatPage";
import AchievementsPage from "./pages/AchievementsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
