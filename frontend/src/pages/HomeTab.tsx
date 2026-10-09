import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { WorkRecord, SkillEvidenceBreakdown } from '../types';
import { 
  Plus, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  QrCode, 
  FileCheck2, 
  RefreshCw,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const HomeTab: React.FC = () => {
  const { 
    worker, 
    workRecords, 
    skills, 
    stats, 
    isLoading, 
    error, 
    refreshData,
    setCurrentTab, 
    setIsAddWorkOpen, 
    setIsQrModalOpen, 
    setSelectedWorkRecord 
  } = useApp();

  const { t } = useLanguage();
  const recentRecords = workRecords.slice(0, 3);

  // Confidence level badge helper based strictly on evidence (no percentages, no stars)
  const renderConfidenceBadge = (level: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (level) {
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20">
            {t('homeTab.highConfidence')}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide bg-[#FAF0E6] text-[#C2672B] border border-[#C2672B]/25">
            {t('homeTab.buildingEvidence')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide bg-[#F5F2EB] text-[#727A75] border border-[#DFD9CE]">
            {t('homeTab.needsEvidence')}
          </span>
        );
    }
  };

  // ---------------------------------------------------------------------------
  // 1. Loading Skeleton State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full space-y-10 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#DFD9CE]">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-[#DFD9CE] rounded-xl"></div>
            <div className="h-4 w-48 bg-[#ECE7DE] rounded-md"></div>
          </div>
          <div className="h-10 w-32 bg-[#DFD9CE] rounded-xl"></div>
        </div>

        {/* Passport Card Skeleton */}
        <div className="bg-white rounded-3xl border border-[#DFD9CE] p-8 space-y-6">
          <div className="h-6 w-40 bg-[#DFD9CE] rounded-md"></div>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="w-24 h-28 bg-[#ECE7DE] rounded-2xl shrink-0"></div>
            <div className="flex-1 space-y-3 w-full">
              <div className="h-7 w-56 bg-[#DFD9CE] rounded-lg"></div>
              <div className="h-4 w-36 bg-[#ECE7DE] rounded-md"></div>
              <div className="h-4 w-44 bg-[#ECE7DE] rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Record Counter Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="h-24 bg-white rounded-2xl border border-[#DFD9CE]"></div>
          <div className="h-24 bg-white rounded-2xl border border-[#DFD9CE]"></div>
          <div className="h-24 bg-white rounded-2xl border border-[#DFD9CE]"></div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. Error State (with Retry Action)
  // ---------------------------------------------------------------------------
  if (error) {
    return (
      <div className="w-full py-12 px-6 bg-white rounded-3xl border border-[#DFD9CE] text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF0F0] text-[#9E4545] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h2 className="font-display font-bold text-xl text-[#141715]">
            {t('homeTab.errorTitle')}
          </h2>
          <p className="text-sm text-[#727A75]">
            {error || "Vouch couldn't connect to the backend server. Please verify the FastAPI service is running."}
          </p>
        </div>
        <button
          onClick={() => refreshData()}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#162B22] text-white text-xs font-semibold rounded-xl hover:bg-[#102019] transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('homeTab.retry')}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-10 sm:space-y-12">
      
      {/* 1. Header Greeting & Primary Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#DFD9CE]">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121614] tracking-tight">
            {t('homeTab.goodMorning')}{worker.name ? `, ${worker.name.split(' ')[0]}` : ''}.
          </h1>
          <p className="text-sm sm:text-base text-[#4A524D] mt-1 flex items-center space-x-2">
            <span>{worker.trade}</span>
            <span>·</span>
            <span>{worker.experienceYears} {t('common.yearsExp')}</span>
            <span>·</span>
            <span>{(worker.location || 'India').split(',')[0]}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAddWorkOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#162B22] hover:bg-[#102019] text-white text-sm font-semibold transition-all shadow-xs cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>{t('workerApp.addWork')}</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Professional Passport Section (Editorial / Identity Object) */}
      <section className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] shadow-xs overflow-hidden">
        {/* Passport Category Header */}
        <div className="px-6 sm:px-8 py-3.5 bg-[#141715] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C2672B]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5F2EB]">
              VOUCH PASSPORT
            </span>
          </div>
          <span className="text-xs font-mono text-white/70">
            {worker.passportId}
          </span>
        </div>

        {/* Passport Content Body */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Identity Info */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border border-[#DFD9CE] bg-[#ECE7DE] shrink-0 shadow-xs">
                <img
                  src={worker.portraitUrl}
                  alt={worker.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase text-[#245E3F] font-semibold bg-[#E5EFE8] px-2.5 py-0.5 rounded-md border border-[#245E3F]/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('homeTab.workerOwnedIdentity')}</span>
                </div>
                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] tracking-tight">
                  {worker.name}
                </h2>
                <p className="text-base font-semibold text-[#162B22]">
                  {worker.trade}
                </p>
                <p className="text-sm text-[#727A75] flex items-center space-x-2">
                  <span>{worker.experienceYears} {t('common.yearsExp')}</span>
                  <span>·</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-[#727A75]" />
                    <span>{worker.location}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Credential Breakdown & View Passport Action */}
            <div className="lg:col-span-5 bg-[#F5F2EB] p-6 rounded-2xl border border-[#DFD9CE] flex flex-col justify-between space-y-5">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold mb-3">
                  {t('homeTab.identitySummary')}
                </p>
                <div className="grid grid-cols-3 gap-2 text-left">
                  <div>
                    <span className="font-display font-extrabold text-2xl text-[#141715] block">
                      {stats.skillCount}
                    </span>
                    <span className="text-xs text-[#727A75]">
                      {t('common.skills')}
                    </span>
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-2xl text-[#141715] block">
                      {stats.workCount}
                    </span>
                    <span className="text-xs text-[#727A75]">
                      {t('common.workRecords')}
                    </span>
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-2xl text-[#245E3F] block">
                      {stats.confirmationCount}
                    </span>
                    <span className="text-xs text-[#727A75]">
                      {t('common.confirmations')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setCurrentTab('passport')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#162B22] hover:bg-[#102019] text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>{t('homeTab.viewPassport')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl border border-[#DFD9CE] bg-white hover:bg-gray-50 text-[#141715] text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Share Passport QR"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#162B22]" />
                  <span className="hidden sm:inline">{t('homeTab.share')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Understated Professional Record Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold">
          {t('homeTab.professionalRecord')}
        </h3>

        <div className="bg-[#E6EDE8] rounded-2xl border border-[#DFD9CE] p-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#DFD9CE]">
            
            <button
              onClick={() => setCurrentTab('work')}
              className="py-3 sm:py-0 sm:px-6 text-left hover:opacity-80 transition-opacity cursor-pointer group first:sm:pl-0"
            >
              <span className="text-xs font-medium text-[#727A75] block group-hover:text-[#162B22]">
                {t('common.workRecords')}
              </span>
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#141715] mt-1 block">
                {stats.workCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('passport')}
              className="py-3 sm:py-0 sm:px-6 text-left hover:opacity-80 transition-opacity cursor-pointer group"
            >
              <span className="text-xs font-medium text-[#727A75] block group-hover:text-[#162B22]">
                {t('common.skills')}
              </span>
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#141715] mt-1 block">
                {stats.skillCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('work')}
              className="py-3 sm:py-0 sm:px-6 text-left hover:opacity-80 transition-opacity cursor-pointer group last:sm:pr-0"
            >
              <span className="text-xs font-medium text-[#727A75] block group-hover:text-[#162B22]">
                {t('common.confirmations')}
              </span>
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-[#245E3F] mt-1 block">
                {stats.confirmationCount}
              </span>
            </button>

          </div>
        </div>
      </section>

      {/* 4. Two-Column Workspace: Recent Work & Demonstrated Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Work Records */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold">
              {t('homeTab.recentWork')}
            </h3>
            <button
              onClick={() => setCurrentTab('work')}
              className="text-xs font-semibold text-[#162B22] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{t('homeTab.viewAllRecords')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentRecords.length > 0 ? (
            <div className="space-y-3">
              {recentRecords.map((item: WorkRecord) => {
                const isConfirmed = item.status === 'CONFIRMED';
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#DFD9CE] p-5 shadow-xs hover:border-[#162B22]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4 min-w-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#ECE7DE] shrink-0 border border-[#DFD9CE]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[#141715] truncate">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#727A75] mt-0.5">
                          {item.location} · {item.date}
                        </p>
                        <p className="text-xs text-[#484F4A] mt-1 flex items-center space-x-1.5">
                          <FileCheck2 className="w-3.5 h-3.5 text-[#245E3F]" />
                          <span>
                            {item.evidenceItems.length} {t('homeTab.evidenceItems')} · {isConfirmed ? t('homeTab.confirmedBySupervisor') : t('homeTab.awaitingConfirmation')}
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedWorkRecord(item)}
                      className="self-end sm:self-center px-4 py-2 rounded-xl border border-[#DFD9CE] hover:border-[#162B22] bg-[#F5F2EB] hover:bg-white text-xs font-semibold text-[#141715] transition-all cursor-pointer shrink-0"
                    >
                      {t('homeTab.viewRecord')}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-[#DFD9CE] text-center space-y-3">
              <p className="text-sm text-[#727A75]">{t('homeTab.noWorkYet')}</p>
              <button
                onClick={() => setIsAddWorkOpen(true)}
                className="px-4 py-2 bg-[#162B22] text-white text-xs font-semibold rounded-xl hover:bg-[#102019] transition-colors"
              >
                {t('homeTab.logFirstJob')}
              </button>
            </div>
          )}
        </section>

        {/* Right Column: Demonstrated Skills (Evidence-backed, no stars/percentages) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold">
              {t('homeTab.demonstratedSkills')}
            </h3>
            <button
              onClick={() => setCurrentTab('passport')}
              className="text-xs font-semibold text-[#162B22] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>{t('homeTab.viewInPassport')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {skills.slice(0, 3).map((skill: SkillEvidenceBreakdown) => (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-[#DFD9CE] p-5 shadow-xs hover:border-[#162B22]/40 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#141715]">
                    {skill.name}
                  </h4>
                  {renderConfidenceBadge(skill.confidenceLevel)}
                </div>

                <div className="pt-2 border-t border-[#ECE7DE] text-xs text-[#727A75] flex items-center justify-between flex-wrap gap-2">
                  <span>{skill.workRecordsCount} {t('common.workRecords')}</span>
                  <span>·</span>
                  <span>{skill.evidenceCount} {t('homeTab.evidenceItems')}</span>
                  <span>·</span>
                  <span className="font-medium text-[#245E3F]">
                    {skill.confirmationsCount} {t('common.confirmations')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
};

export default HomeTab;
