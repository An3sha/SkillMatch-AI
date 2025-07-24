import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { TeamsListPage } from "./pages/TeamsListPage";
import { TeamDetailsPage } from "./pages/TeamDetailsPage";
import { Toaster } from "./components/ui/toaster";
import { useAuth } from "./hooks/useAuth";
import { TeamsProvider } from "./context/TeamsContext";
import { CandidateSelectionProvider } from "./context/CandidateSelectionContext";
import { CandidatesProvider } from "./context/CandidateContext";
import { Dashboard } from "./components/Dashboard";

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4c4cc9]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth check component
const AuthWrapper: React.FC = () => {
  const { isLoggedIn, isLoading, handleLogout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4c4cc9]"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" replace />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard onLogout={handleLogout} />
        </ProtectedRoute>
      } />
      <Route path="/teams" element={
        <ProtectedRoute>
          <TeamsListPage />
        </ProtectedRoute>
      } />
      <Route path="/teams/:teamId" element={
        <ProtectedRoute>
          <TeamDetailsPage />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App component with context providers and router
function App() {
  return (
    <BrowserRouter>
      <CandidateSelectionProvider>
        <CandidatesProvider>
          <TeamsProvider>
            <AuthWrapper />
            <Toaster />
          </TeamsProvider>
        </CandidatesProvider>
      </CandidateSelectionProvider>
    </BrowserRouter>
  );
}

export default App;
