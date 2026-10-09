import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { ScrollToTop } from './components/ScrollToTop';

// Dedicated Public Website Pages
import { LandingPage } from './pages/PublicWebsite/LandingPage';
import { WorkersPage } from './pages/PublicWebsite/WorkersPage';
import { EmployersPage } from './pages/PublicWebsite/EmployersPage';
import { HowItWorksPage } from './pages/PublicWebsite/HowItWorksPage';
import { PassportPage } from './pages/PublicWebsite/PassportPage';
import { AboutPage } from './pages/PublicWebsite/AboutPage';
import { LoginPage } from './pages/PublicWebsite/LoginPage';
import { SignupPage } from './pages/PublicWebsite/SignupPage';
import { BuildPassportPage } from './pages/PublicWebsite/BuildPassportPage';
import { PublicPassportPage } from './pages/PublicWebsite/PublicPassportPage';
import { PublicVerifierPage } from './pages/PublicVerifierPage';

// Verified Vouch Application Experiences
import { WorkerAppPage } from './pages/WorkerAppPage';
import { ContractorAppPage } from './pages/ContractorAppPage';

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Marketing & Explainer Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/employers" element={<EmployersPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/passport" element={<PassportPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/build-passport" element={<BuildPassportPage />} />

          {/* Vouch Application Portals & Verification */}
          <Route path="/worker" element={<WorkerAppPage />} />
          <Route path="/contractor" element={<ContractorAppPage />} />
          <Route path="/passport/:id" element={<PublicPassportPage />} />
          <Route path="/passport/p/:slug" element={<PublicPassportPage />} />
          <Route path="/verify/:token" element={<PublicVerifierPage />} />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  </LanguageProvider>
  );
}

export default App;
