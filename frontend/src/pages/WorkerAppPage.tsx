import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { HomeTab } from './HomeTab';
import { WorkTab } from './WorkTab';
import { PassportTab } from './PassportTab';
import { ProfileTab } from './ProfileTab';
import { AddWorkModal } from '../modals/AddWorkModal';
import { WorkDetailModal } from '../modals/WorkDetailModal';
import { VerifierModal } from '../modals/VerifierModal';
import { QrModal } from '../modals/QrModal';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Briefcase, 
  Award, 
  Home as HomeIcon,
  Plus
} from 'lucide-react';

export const WorkerAppPage: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    worker, 
    setIsAddWorkOpen, 
    isAuthenticated,
    isLoading,
    currentUser,
    logout,
    activeRole
  } = useApp();
  
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/worker', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // If authenticated as employer, prevent access to worker portal
  React.useEffect(() => {
    if (isAuthenticated && activeRole === 'contractor') {
      navigate('/contractor', { replace: true });
    }
  }, [isAuthenticated, activeRole, navigate]);

  // If authenticated worker has incomplete onboarding, route them to complete employee details
  React.useEffect(() => {
    if (!isLoading && isAuthenticated && currentUser && currentUser.onboarding_completed === false) {
      navigate('/build-passport', { replace: true });
    }
  }, [isAuthenticated, isLoading, currentUser, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems: Array<{ id: 'home' | 'work' | 'passport' | 'profile'; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'home', label: t('workerApp.tabHome'), icon: HomeIcon },
    { id: 'work', label: t('workerApp.tabWork'), icon: Briefcase },
    { id: 'passport', label: t('workerApp.tabPassport'), icon: Award },
    { id: 'profile', label: t('workerApp.tabProfile'), icon: User },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1E3B2B] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono uppercase text-[#737A75]">{t('workerApp.loadingPassport')}</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col font-sans selection:bg-[#162B22] selection:text-white">
      
      {/* 1. Professional Web Application Header (Full Width) */}
      <header className="w-full bg-white border-b border-[#DFD9CE] sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Vouch Brand & Workspace Indicator */}
          <div className="flex items-center space-x-6">
            <Link to="/worker" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#162B22] flex items-center justify-center text-white shadow-xs group-hover:bg-[#102019] transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#F5F2EB]" strokeWidth={2.2} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#141715]">
                VOUCH
              </span>
            </Link>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-[#727A75] border-l border-[#DFD9CE] pl-5">
              <span className="w-2 h-2 rounded-full bg-[#245E3F]"></span>
              <span className="font-medium text-[#484F4A]">{t('workerApp.workspace')}</span>
              <span className="text-[#C2672B] bg-[#FAF0E6] px-2 py-0.5 rounded font-semibold border border-[#C2672B]/20">
                {worker.passportId}
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#162B22] text-white shadow-xs'
                      : 'text-[#484F4A] hover:text-[#141715] hover:bg-[#F5F2EB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#727A75]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: User Identity & Profile Dropdown */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Add Work Button (Desktop) */}
            <button
              onClick={() => setIsAddWorkOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE] text-xs font-semibold text-[#162B22] hover:bg-[#ECE7DE] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#162B22]" />
              <span>{t('workerApp.addWork')}</span>
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Profile Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-1.5 pr-2.5 rounded-xl hover:bg-[#F5F2EB] border border-transparent hover:border-[#DFD9CE] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DFD9CE] bg-[#ECE7DE] shrink-0">
                  <img
                    src={worker.avatarUrl}
                    alt={worker.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#141715] leading-tight">
                    {worker.name}
                  </p>
                  <p className="text-[11px] text-[#727A75]">
                    {worker.trade}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#727A75] hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#DFD9CE] shadow-lg py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-[#ECE7DE]">
                      <p className="text-xs font-mono uppercase text-[#727A75] font-semibold">
                        {t('workerApp.authAccount')}
                      </p>
                      <p className="text-sm font-bold text-[#141715] mt-0.5">
                        {worker.name}
                      </p>
                      <p className="text-xs text-[#484F4A]">
                        {worker.trade} · {t('workerApp.workerRole')}
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentTab('profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#141715] hover:bg-[#F5F2EB] flex items-center space-x-2.5 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#727A75]" />
                        <span>{t('workerApp.viewFullProfile')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTab('passport');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#141715] hover:bg-[#F5F2EB] flex items-center space-x-2.5 cursor-pointer"
                      >
                        <Award className="w-4 h-4 text-[#727A75]" />
                        <span>{t('workerApp.viewVouchPassport')}</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-[#ECE7DE]">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#B91C1C] hover:bg-red-50 flex items-center space-x-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-[#B91C1C]" />
                        <span>{t('workerApp.logout')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Navigation Drawer Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 rounded-xl text-[#484F4A] hover:bg-[#F5F2EB] border border-[#DFD9CE] cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-[#DFD9CE] bg-white px-4 pt-3 pb-4 space-y-2">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsMobileNavOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                      isActive
                        ? 'bg-[#162B22] text-white shadow-xs'
                        : 'bg-[#F5F2EB] text-[#484F4A] hover:bg-[#F5F2EB]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#727A75]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#ECE7DE] flex items-center justify-between">
              <button
                onClick={() => {
                  setIsAddWorkOpen(true);
                  setIsMobileNavOpen(false);
                }}
                className="py-2 px-3 rounded-xl bg-[#162B22] text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Work</span>
              </button>

              <button
                onClick={handleLogout}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-[#B91C1C] hover:bg-red-50 flex items-center space-x-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Full-Width Application Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'work' && <WorkTab />}
        {currentTab === 'passport' && <PassportTab />}
        {currentTab === 'profile' && <ProfileTab />}
      </main>

      {/* Modals Preserved */}
      <AddWorkModal />
      <WorkDetailModal />
      <VerifierModal />
      <QrModal />

    </div>
  );
};

export default WorkerAppPage;
