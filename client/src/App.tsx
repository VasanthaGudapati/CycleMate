import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { RideTrackingProvider } from './context/RideTrackingContext';

// Layout
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RideTrackingPage } from './pages/RideTrackingPage';
import { RideSummaryPage } from './pages/RideSummaryPage';
import { RoutesPage } from './pages/RoutesPage';
import { RouteDetailsPage } from './pages/RouteDetailsPage';
import { RideHistoryPage } from './pages/RideHistoryPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CommunityPage } from './pages/CommunityPage';
import { BikeGaragePage } from './pages/BikeGaragePage';
import { AICoachPage } from './pages/AICoachPage';
import { SafetyWeatherPage } from './pages/SafetyWeatherPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RideTrackingProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing & Auth Pages */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Authenticated Application Shell */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/track" element={<RideTrackingPage />} />
                  <Route path="/rides/:id" element={<RideSummaryPage />} />
                  <Route path="/ride-summary" element={<RideSummaryPage />} />
                  <Route path="/routes" element={<RoutesPage />} />
                  <Route path="/routes/:id" element={<RouteDetailsPage />} />
                  <Route path="/history" element={<RideHistoryPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/challenges" element={<ChallengesPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/garage" element={<BikeGaragePage />} />
                  <Route path="/bikes" element={<BikeGaragePage />} />
                  <Route path="/coach" element={<AICoachPage />} />
                  <Route path="/safety" element={<SafetyWeatherPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </RideTrackingProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
