import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { ContractorTab } from './ContractorTab';
import { WorkDetailModal } from '../modals/WorkDetailModal';
import { VerifierModal } from '../modals/VerifierModal';
import { QrModal } from '../modals/QrModal';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  Search, 
  Bookmark, 
  ChevronDown, 
  Menu, 
  X, 
  Home as HomeIcon,
  Briefcase,
  Building2,
  Mail,
  Phone,
  Lock,
  MapPin,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  Award,
  ArrowRight
} from 'lucide-react';

export const ContractorAppPage: React.FC = () => {
  const { 
    savedWorkerIds, 
    toggleSaveWorker, 
    isSavedWorker,
    isAuthenticated,
    isLoading,
    currentUser,
    logout,
    activeRole
  } = useApp();
  
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<'home' | 'find' | 'saved' | 'profile'>('home');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Inspected worker passport modal state
  const [inspectedWorker, setInspectedWorker] = useState<any | null>(null);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirect=/contractor', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // If authenticated as worker, prevent casual access to contractor portal
  React.useEffect(() => {
    if (isAuthenticated && activeRole === 'worker') {
      navigate('/worker', { replace: true });
    }
  }, [isAuthenticated, activeRole, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const employerName = currentUser?.name || 'Contractor / Employer';
  const employerEmail = currentUser?.email || 'employer@vouchwork.in';
  const employerInitials = employerName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'EM';

  const navItems = [
    { id: 'home' as const, label: t('contractorApp.navHome'), icon: HomeIcon },
    { id: 'find' as const, label: t('contractorApp.navFind'), icon: Search },
    { id: 'saved' as const, label: `${t('contractorApp.navSaved')} (${savedWorkerIds.length})`, icon: Bookmark },
    { id: 'profile' as const, label: t('contractorApp.navProfile'), icon: User },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#1E3B2B] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono uppercase text-[#737A75]">{t('contractorApp.loadingPortal')}</span>
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
          
          {/* Left: Vouch Brand & Employer Workspace Context */}
          <div className="flex items-center space-x-6">
            <Link to="/contractor" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#162B22] flex items-center justify-center text-white shadow-xs group-hover:bg-[#102019] transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#F5F2EB]" strokeWidth={2.2} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-[#141715]">
                VOUCH
              </span>
            </Link>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-[#727A75] border-l border-[#DFD9CE] pl-5">
              <span className="w-2 h-2 rounded-full bg-[#162B22]"></span>
              <span className="font-semibold text-[#162B22] bg-[#E5EFE8] px-2.5 py-0.5 rounded-md border border-[#245E3F]/20">
                {t('contractorApp.workspace')}
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

          {/* Right: Employer Account Identity & Dropdown */}
          <div className="flex items-center space-x-3">
            
            {/* Language Selector */}
            <LanguageSelector />

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-1.5 pr-2.5 rounded-xl hover:bg-[#F5F2EB] border border-transparent hover:border-[#DFD9CE] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#DFD9CE] bg-[#162B22] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {employerInitials}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-[#141715] leading-tight truncate max-w-[140px]">
                    {employerName}
                  </p>
                  <p className="text-[11px] text-[#727A75]">
                    {currentUser?.role === 'contractor' ? t('contractorApp.role') : t('contractorApp.workspace')}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#727A75] hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#DFD9CE] shadow-lg py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-[#ECE7DE]">
                      <p className="text-xs font-mono uppercase text-[#727A75] font-semibold">
                        {t('contractorApp.accountMenu')}
                      </p>
                      <p className="text-sm font-bold text-[#141715] mt-0.5 truncate">
                        {employerName}
                      </p>
                      <p className="text-xs text-[#484F4A] truncate">
                        {employerEmail}
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
                        <span>{t('contractorApp.navProfile')}</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentTab('saved');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#141715] hover:bg-[#F5F2EB] flex items-center space-x-2.5 cursor-pointer"
                      >
                        <Bookmark className="w-4 h-4 text-[#727A75]" />
                        <span>{t('contractorApp.navSaved')} ({savedWorkerIds.length})</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-[#ECE7DE]">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[#B91C1C] hover:bg-red-50 flex items-center space-x-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-[#B91C1C]" />
                        <span>{t('contractorApp.logout')}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Nav Drawer Toggle */}
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
              <span className="text-xs text-[#727A75] truncate mr-2">
                Signed in as <strong className="text-[#141715]">{employerName}</strong>
              </span>

              <button
                onClick={handleLogout}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-[#B91C1C] hover:bg-red-50 flex items-center space-x-1.5 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Full-Width Application Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* View 1 & 2: Home or Find Workers */}
        {(currentTab === 'home' || currentTab === 'find') && (
          <ContractorTab 
            onViewPassport={(workerData) => setInspectedWorker(workerData)}
            defaultActiveTab="DIRECTORY"
          />
        )}

        {/* View 3: Saved Workers Tab */}
        {currentTab === 'saved' && (
          <ContractorTab 
            onViewPassport={(workerData) => setInspectedWorker(workerData)}
            defaultActiveTab="SAVED"
          />
        )}

        {/* View 4: Employer Profile Tab */}
        {currentTab === 'profile' && (
          <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
            
            {/* Employer Profile Header */}
            <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#162B22] text-white flex items-center justify-center font-display font-extrabold text-2xl sm:text-3xl shrink-0 shadow-xs border border-[#102019]">
                  {employerInitials}
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20">
                      AUTHENTICATED EMPLOYER
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#F5F2EB] text-[#727A75] border border-[#DFD9CE]">
                      COMMERCIAL CONTRACTOR
                    </span>
                  </div>

                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] tracking-tight">
                    {employerName}
                  </h1>
                  <p className="text-base font-semibold text-[#162B22]">
                    Employer & Project Director Account
                  </p>

                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-[#727A75]">
                    <MapPin className="w-3.5 h-3.5 text-[#727A75]" />
                    <span>Karnataka & Pan-India Construction Hubs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#ECE7DE]">
                <Building2 className="w-5 h-5 text-[#162B22]" />
                <div>
                  <h2 className="font-bold text-base text-[#141715]">Account Information</h2>
                  <p className="text-xs text-[#727A75]">Company profile and workspace classification</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE]">
                  <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-1">
                    ACCOUNT TYPE
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#141715]">Employer / Contractor</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E5EFE8] text-[#245E3F] font-bold">
                      VERIFICATION SUITE
                    </span>
                  </div>
                  <p className="text-xs text-[#727A75] mt-1.5 leading-relaxed">
                    This account is authorized to inspect evidence-backed passports, examine supervisor verifications, and evaluate skilled technicians without platform commissions.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE] space-y-2.5">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-0.5">
                      REGISTERED WORK EMAIL
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-[#141715] font-medium">
                      <Mail className="w-3.5 h-3.5 text-[#727A75]" />
                      <span>{employerEmail}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#DFD9CE]">
                    <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-0.5">
                      USER IDENTIFIER
                    </span>
                    <div className="flex items-center space-x-2 text-xs text-[#141715] font-medium">
                      <Building2 className="w-3.5 h-3.5 text-[#727A75]" />
                      <span>{currentUser?.id || 'ID-EMP-VERIFIED'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center space-x-3 pb-3 border-b border-[#ECE7DE]">
                <Lock className="w-5 h-5 text-[#162B22]" />
                <div>
                  <h2 className="font-bold text-base text-[#141715]">Security & Access</h2>
                  <p className="text-xs text-[#727A75]">Credential protection and corporate access controls</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-[#141715]">Employer Password & Authentication</p>
                  <p className="text-[#727A75] mt-0.5">
                    Secured with modern cryptographic hashing.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-white border border-[#DFD9CE] text-xs font-medium text-[#245E3F] self-start sm:self-auto">
                  Protected
                </span>
              </div>
            </div>

            {/* Session Management & Log Out */}
            <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <h2 className="font-bold text-base text-[#141715]">Session Management</h2>
                <p className="text-xs text-[#727A75] mt-1">
                  To access a Worker account or another workspace, sign out of this Employer session and sign in with the corresponding credentials.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#B91C1C] text-xs font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out of Vouch</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 3. Interactive Vouch Passport Inspection Modal */}
      {inspectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#F5F2EB] rounded-3xl border border-[#DFD9CE] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="bg-[#141715] text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C2672B]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#F5F2EB]">
                  VOUCH PROFESSIONAL PASSPORT · EVIDENCE INSPECTION
                </span>
              </div>
              <button
                onClick={() => setInspectedWorker(null)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Passport"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Identity Banner */}
              <div className="bg-[#E6EDE8] rounded-2xl border border-[#DFD9CE] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="w-20 h-24 rounded-xl overflow-hidden border border-[#DFD9CE] bg-[#ECE7DE] shrink-0">
                    <img
                      src={inspectedWorker.avatarUrl}
                      alt={inspectedWorker.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase text-[#245E3F] font-semibold bg-[#E5EFE8] px-2 py-0.5 rounded border border-[#245E3F]/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Sovereign Identity</span>
                    </div>
                    <h2 className="font-display font-extrabold text-2xl text-[#141715]">
                      {inspectedWorker.name}
                    </h2>
                    <p className="text-sm font-semibold text-[#162B22]">
                      {inspectedWorker.trade} · {inspectedWorker.experienceYears} Years Documented Exp
                    </p>
                    <p className="text-xs text-[#727A75] flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{inspectedWorker.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => toggleSaveWorker(inspectedWorker.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                      isSavedWorker(inspectedWorker.id)
                        ? 'bg-[#E5EFE8] text-[#245E3F] border-[#245E3F]/30'
                        : 'bg-white text-[#141715] border-[#DFD9CE] hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSavedWorker(inspectedWorker.id) ? 'Saved' : 'Save Worker'}</span>
                  </button>
                  <Link
                    to={`/passport/${inspectedWorker.publicSlug || inspectedWorker.id}`}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-[#162B22] hover:bg-[#102019] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <span>Full Ledger</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Evidence Confidence Card */}
              <div className="bg-[#E6EDE8] rounded-2xl border border-[#DFD9CE] p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#141715]">
                      Credibility Score & Evidence Confidence
                    </h3>
                    <p className="text-xs text-[#727A75]">
                      Evaluated on supervisor confirmations & on-site photo records
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20">
                    {inspectedWorker.overallConfidence || 82} / 100 · {inspectedWorker.confidenceLevel} CONFIDENCE
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE]">
                    <span className="font-display font-extrabold text-xl text-[#141715] block">
                      {inspectedWorker.workRecordsCount}
                    </span>
                    <span className="text-[#727A75]">Work Records</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE]">
                    <span className="font-display font-extrabold text-xl text-[#141715] block">
                      {inspectedWorker.evidenceItemsCount || (inspectedWorker.workRecordsCount * 2)}
                    </span>
                    <span className="text-[#727A75]">Evidence Items</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE]">
                    <span className="font-display font-extrabold text-xl text-[#245E3F] block">
                      {inspectedWorker.confirmationsCount}
                    </span>
                    <span className="text-[#727A75]">Confirmations</span>
                  </div>
                </div>
              </div>

              {/* Demonstrated Skills Breakdown */}
              <div className="bg-[#E6EDE8] rounded-2xl border border-[#DFD9CE] p-6 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-[#141715]">
                  Demonstrated Competencies
                </h3>
                <div className="space-y-2">
                  {(inspectedWorker.skillsSummary || inspectedWorker.trade)
                    .split(',')
                    .map((skillName: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE] flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-[#141715]">
                          {skillName.trim()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F]">
                          VERIFIED EVIDENCE
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* View Complete Passport CTA */}
              <div className="p-4 rounded-2xl bg-[#E5EFE8] border border-[#245E3F]/20 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-[#162B22]">
                    Inspect Full Verification Ledger
                  </p>
                  <p className="text-[11px] text-[#727A75]">
                    View all attached photographs, verifier signatures, and verifiable QR code.
                  </p>
                </div>
                <Link
                  to={`/passport/${inspectedWorker.publicSlug || inspectedWorker.id}`}
                  className="px-4 py-2 rounded-xl bg-[#162B22] text-white text-xs font-semibold hover:bg-[#102019] transition-colors"
                >
                  Open Passport
                </Link>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-[#DFD9CE] flex items-center justify-between">
              <span className="text-xs text-[#727A75]">
                Independent Vouch Credential · Worker Sovereign Record
              </span>
              <button
                onClick={() => setInspectedWorker(null)}
                className="px-4 py-2 rounded-xl bg-[#162B22] text-white text-xs font-semibold hover:bg-[#102019] transition-colors cursor-pointer"
              >
                Close Passport
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modals Preserved */}
      <WorkDetailModal />
      <VerifierModal />
      <QrModal />

    </div>
  );
};

export default ContractorAppPage;
