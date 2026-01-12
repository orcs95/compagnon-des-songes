import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Evenements from "./pages/Evenements";
import Calendrier from "./pages/Calendrier";
import Bureau from "./pages/Bureau";
import Membres from "./pages/Membres";
import Auth from "./pages/Auth";
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/calendrier" element={<Calendrier />} />
            <Route path="/bureau" element={<Bureau />} />
            <Route path="/membres" element={<Membres />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
