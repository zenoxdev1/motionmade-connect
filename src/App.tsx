import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MusicPlayerComponent from "@/components/MusicPlayerComponent";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import test helpers for development
import "@/utils/testHelpers";
import "@/utils/uploadDebugger";
import "@/utils/audioFixHelper";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import UploadTrack from "./pages/UploadTrack";
import Musicians from "./pages/Musicians";
import MyTracks from "./pages/MyTracks";
import EditTrack from "./pages/EditTrack";
import Features from "./pages/Features";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import PublicProfile from "./pages/PublicProfile";
import NotFound from "./pages/NotFound";

// Initialize real users and enhanced features
import { initializeRealUsers } from "@/utils/recommendationSystem";

const queryClient = new QueryClient();

// Initialize app features
if (typeof window !== "undefined") {
  // Initialize real user accounts on app start
  setTimeout(() => {
    initializeRealUsers();
  }, 1000);
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <MusicPlayerProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route
                    path="/profile/:username"
                    element={<PublicProfile />}
                  />
                  <Route
                    path="/login"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Login />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <Signup />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/upload-track"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <UploadTrack />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/musicians"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Musicians />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/find-musicians"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Musicians />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/discover"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <Musicians />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-tracks"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <MyTracks />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-track/:trackId"
                    element={
                      <ProtectedRoute requireAuth={true}>
                        <EditTrack />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <MusicPlayerComponent />
            </TooltipProvider>
          </MusicPlayerProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
