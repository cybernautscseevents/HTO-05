import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { api, WorkerProfileResponse } from '../services/api';
import { 
  Search, 
  Bookmark, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  X,
  FileCheck2,
  Award,
  Users,
  Layers,
  Sparkles,
  Loader2
} from 'lucide-react';

export interface DirectoryWorkerItem {
  id: string;
  name: string;
  trade: string;
  experienceYears: number;
  location: string;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  overallConfidence: number;
  workRecordsCount: number;
  evidenceItemsCount: number;
  confirmationsCount: number;
  avatarUrl: string;
  skillsSummary: string;
  skillsList: string[];
  publicSlug?: string;
  raw: WorkerProfileResponse;
}

interface ContractorTabProps {
  onViewPassport: (workerData: any) => void;
  defaultActiveTab?: 'DIRECTORY' | 'SAVED';
}

export const ContractorTab: React.FC<ContractorTabProps> = ({ 
  onViewPassport, 
  defaultActiveTab = 'DIRECTORY' 
}) => {
  const { 
    currentUser,
    savedWorkerIds, 
    toggleSaveWorker, 
    isSavedWorker
  } = useApp();

  const { t } = useLanguage();

  const [workers, setWorkers] = useState<DirectoryWorkerItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [credibilityFilter, setCredibilityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'SAVED'>(defaultActiveTab);

  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  // Load real workers from FastAPI backend
  useEffect(() => {
    let isMounted = true;
    async function fetchDirectoryWorkers() {
      setIsLoading(true);
      setError(null);
      try {
        const rawWorkers = await api.getWorkers();
        if (!isMounted) return;

        const mapped: DirectoryWorkerItem[] = rawWorkers.map(w => {
          const confidenceScore = w.overall_confidence || 0;
          const tier: 'HIGH' | 'MEDIUM' | 'LOW' = 
            confidenceScore >= 70 ? 'HIGH' : confidenceScore >= 40 ? 'MEDIUM' : 'LOW';

          const demonstratedSkills = w.demonstrated_skills || [];
          const skillsList = demonstratedSkills.map(s => s.skill_name);
          const skillsSummary = skillsList.length > 0 
            ? skillsList.slice(0, 3).join(', ')
            : `${w.trade} Execution`;

          const evCount = demonstratedSkills.reduce(
            (acc, s) => acc + (s.photo_count || 0) + (s.document_count || 0), 
            0
          ) || (w.work_count * 2);

          const locationCity = w.location ? w.location.split(',')[0].trim() : 'India';

          return {
            id: w.id,
            name: w.name,
            trade: w.trade,
            experienceYears: w.experience_years,
            location: locationCity,
            confidenceLevel: tier,
            overallConfidence: confidenceScore,
            workRecordsCount: w.work_count || 0,
            evidenceItemsCount: evCount,
            confirmationsCount: w.confirmation_count || 0,
            avatarUrl: w.profile_photo_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
            skillsSummary,
            skillsList,
            publicSlug: w.public_slug || undefined,
            raw: w
          };
        });

        setWorkers(mapped);
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('Could not load workers from API:', err);
        setError('Unable to load directory from backend server.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchDirectoryWorkers();
    return () => { isMounted = false; };
  }, []);

  // Compute available trades dynamically
  const availableTrades = useMemo(() => {
    const tradeSet = new Set<string>();
    workers.forEach(w => {
      if (w.trade) tradeSet.add(w.trade);
    });
    return ['All', ...Array.from(tradeSet)];
  }, [workers]);

  // Aggregate directory statistics
  const metrics = useMemo(() => {
    const totalWorkers = workers.length;
    const totalEvidence = workers.reduce((acc, w) => acc + w.evidenceItemsCount, 0);
    const totalConfirmations = workers.reduce((acc, w) => acc + w.confirmationsCount, 0);
    const avgConfidence = totalWorkers > 0
      ? Math.round(workers.reduce((acc, w) => acc + w.overallConfidence, 0) / totalWorkers)
      : 0;
    return {
      totalWorkers,
      totalEvidence,
      totalConfirmations,
      avgConfidence
    };
  }, [workers]);

  // Filter based on search query, trade, credibility tier, and directory vs saved mode
  const filteredWorkers = useMemo(() => {
    return workers.filter(w => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        w.name.toLowerCase().includes(q) ||
        w.trade.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q) ||
        w.skillsSummary.toLowerCase().includes(q) ||
        w.skillsList.some(s => s.toLowerCase().includes(q));

      const matchesTrade = selectedTrade === 'All' || 
        w.trade.toLowerCase() === selectedTrade.toLowerCase();

      const matchesTier = credibilityFilter === 'ALL' ||
        w.confidenceLevel === credibilityFilter;

      const matchesSaved = activeTab === 'DIRECTORY' || isSavedWorker(w.id);

      return matchesSearch && matchesTrade && matchesTier && matchesSaved;
    });
  }, [workers, searchQuery, selectedTrade, credibilityFilter, activeTab, isSavedWorker]);

  const renderConfidenceBadge = (score: number, level: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (level) {
      case 'HIGH':
        return (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20 inline-flex items-center space-x-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#245E3F] animate-pulse"></span>
              <span>{score} / 100 · {t('homeTab.highConfidence')}</span>
            </span>
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide bg-[#FAF0E6] text-[#C2672B] border border-[#C2672B]/25 inline-flex items-center space-x-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#C2672B]"></span>
              <span>{score} / 100 · {t('homeTab.buildingEvidence')}</span>
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide bg-[#F5F2EB] text-[#727A75] border border-[#DFD9CE] inline-flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-[#727A75]"></span>
              <span>{score} / 100 · {t('homeTab.needsEvidence')}</span>
            </span>
          </div>
        );
    }
  };

  const employerFirstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Employer';

  return (
    <div className="w-full space-y-8 sm:space-y-10">
      
      {/* 1. Contractor Header & Dynamic Metrics */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono uppercase text-[#245E3F] font-bold bg-[#E5EFE8] px-2.5 py-1 rounded-md border border-[#245E3F]/20 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('contractorTab.verificationDir')}</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] tracking-tight">
              {t('homeTab.goodMorning')}, {employerFirstName}.
            </h1>
            <p className="text-sm sm:text-base text-[#484F4A] mt-1">
              {t('contractorTab.inspectSubtext')}
            </p>
          </div>

          {/* Top Real Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-3 rounded-2xl border border-[#DFD9CE] shadow-2xs">
            <div className="px-3 py-1.5 border-r border-[#ECE7DE] last:border-r-0">
              <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('contractorTab.metricWorkers')}</span>
              <span className="font-display font-bold text-base text-[#141715]">{metrics.totalWorkers}</span>
            </div>
            <div className="px-3 py-1.5 border-r border-[#ECE7DE] last:border-r-0">
              <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('contractorTab.metricEvidence')}</span>
              <span className="font-display font-bold text-base text-[#162B22]">{metrics.totalEvidence}</span>
            </div>
            <div className="px-3 py-1.5 border-r border-[#ECE7DE] last:border-r-0">
              <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('contractorTab.metricConfirmations')}</span>
              <span className="font-display font-bold text-base text-[#245E3F]">{metrics.totalConfirmations}</span>
            </div>
            <div className="px-3 py-1.5">
              <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('contractorTab.metricCredibility')}</span>
              <span className="font-display font-bold text-base text-[#162B22]">{metrics.avgConfidence}/100</span>
            </div>
          </div>
        </div>

        {/* Search Field & Clear */}
        <div className="relative w-full max-w-3xl">
          <div className="flex items-center bg-white rounded-2xl border border-[#DFD9CE] shadow-xs focus-within:border-[#162B22] focus-within:ring-1 focus-within:ring-[#162B22] transition-all p-1.5">
            <div className="pl-3.5 pr-2 text-[#727A75]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('contractorApp.searchPlaceholder')}
              className="flex-1 py-2.5 text-sm sm:text-base text-[#141715] placeholder:text-[#A1A7A2] focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 text-[#727A75] hover:text-[#141715] transition-colors mr-1 cursor-pointer"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-[#162B22] hover:bg-[#102019] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-xs shrink-0"
            >
              {t('contractorTab.searchBtn')}
            </button>
          </div>
        </div>

        {/* 2. Trade & Credibility Tier Filters */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold">
              {t('contractorTab.browseTrade')}
            </p>

            {/* Credibility Filter Dropdown / Buttons */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-[#727A75] font-mono text-[11px] uppercase mr-1">{t('contractorTab.credibility')}</span>
              <button
                onClick={() => setCredibilityFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  credibilityFilter === 'ALL'
                    ? 'bg-[#162B22] text-white font-bold'
                    : 'bg-white text-[#484F4A] border border-[#DFD9CE] hover:bg-[#F5F2EB]'
                }`}
              >
                {t('contractorTab.credAll')}
              </button>
              <button
                onClick={() => setCredibilityFilter('HIGH')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  credibilityFilter === 'HIGH'
                    ? 'bg-[#E5EFE8] text-[#245E3F] font-bold border border-[#245E3F]/30'
                    : 'bg-white text-[#484F4A] border border-[#DFD9CE] hover:bg-[#F5F2EB]'
                }`}
              >
                {t('contractorTab.credHigh')}
              </button>
              <button
                onClick={() => setCredibilityFilter('MEDIUM')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  credibilityFilter === 'MEDIUM'
                    ? 'bg-[#FAF0E6] text-[#C2672B] font-bold border border-[#C2672B]/30'
                    : 'bg-white text-[#484F4A] border border-[#DFD9CE] hover:bg-[#F5F2EB]'
                }`}
              >
                {t('contractorTab.credMed')}
              </button>
              <button
                onClick={() => setCredibilityFilter('LOW')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  credibilityFilter === 'LOW'
                    ? 'bg-[#F5F2EB] text-[#727A75] font-bold border border-[#DFD9CE]'
                    : 'bg-white text-[#484F4A] border border-[#DFD9CE] hover:bg-[#F5F2EB]'
                }`}
              >
                {t('contractorTab.credLow')}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {availableTrades.map(trade => (
              <button
                key={trade}
                onClick={() => setSelectedTrade(trade)}
                className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all cursor-pointer ${
                  selectedTrade === trade
                    ? 'bg-[#162B22] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#484F4A] hover:bg-[#F5F2EB] border border-[#DFD9CE]'
                }`}
              >
                {trade === 'All' ? t('common.all') : trade}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Worker Discovery / Saved Section */}
      <section className="space-y-5">
        
        {/* Section Header & Subtext */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#DFD9CE] gap-2">
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#141715] tracking-tight">
              {activeTab === 'DIRECTORY' ? t('contractorTab.verifiedInSystem') : t('contractorTab.shortlisted')}
            </h2>
            <p className="text-xs sm:text-sm text-[#727A75] mt-0.5">
              {activeTab === 'DIRECTORY'
                ? t('contractorApp.subtitle')
                : 'Technicians you have saved for active and upcoming site deployments.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setActiveTab('DIRECTORY')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'DIRECTORY'
                  ? 'bg-[#F5F2EB] text-[#162B22] font-bold border border-[#DFD9CE]'
                  : 'text-[#727A75] hover:text-[#141715]'
              }`}
            >
              {t('contractorTab.allWorkersTab')} ({workers.length})
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('SAVED')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'SAVED'
                  ? 'bg-[#F5F2EB] text-[#162B22] font-bold border border-[#DFD9CE]'
                  : 'text-[#727A75] hover:text-[#141715]'
              }`}
            >
              {t('contractorTab.savedTab')} ({savedWorkerIds.length})
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#DFD9CE] space-y-3">
            <Loader2 className="w-7 h-7 text-[#162B22] animate-spin mx-auto" />
            <p className="text-xs font-mono uppercase text-[#727A75]">
              {t('contractorTab.loadingLedger')}
            </p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-6 text-center bg-red-50 text-red-800 rounded-3xl border border-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Worker Cards Feed */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {filteredWorkers.map(w => {
              const isSaved = isSavedWorker(w.id);
              const passportUrl = `/passport/${w.publicSlug || w.id}`;

              return (
                <div
                  key={w.id}
                  className="bg-[#E6EDE8] rounded-3xl p-6 sm:p-7 border border-[#DFD9CE] shadow-xs hover:border-[#162B22]/40 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  
                  {/* Left & Center: Worker Photo, Identity, Trade & Skills */}
                  <div className="flex items-start space-x-5 min-w-0 flex-1">
                    
                    {/* Photo container */}
                    <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden bg-[#ECE7DE] border border-[#DFD9CE] shrink-0 shadow-xs">
                      <img
                        src={w.avatarUrl}
                        alt={w.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Identity details */}
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-display font-extrabold text-lg sm:text-xl text-[#141715] tracking-tight uppercase truncate">
                          {w.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E5EFE8] text-[#245E3F] font-bold border border-[#245E3F]/20">
                          ID: {w.id}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-[#162B22]">
                        {w.trade}
                      </p>

                      <p className="text-xs text-[#727A75] flex items-center space-x-2">
                        <span>{w.experienceYears} {t('common.yearsExp')}</span>
                        <span>·</span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#727A75]" />
                          <span>{w.location}</span>
                        </span>
                      </p>

                      {/* Demonstrated Skills summary */}
                      <div className="pt-2 text-xs text-[#484F4A]">
                        <span className="text-[#727A75] font-medium">{t('contractorTab.demonstratedSkillsLabel')} </span>
                        <span className="font-semibold text-[#141715]">{w.skillsSummary}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right: Credibility Score, Counts & Action Buttons */}
                  <div className="lg:border-l lg:border-[#ECE7DE] lg:pl-6 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0">
                    
                    {/* Numeric Credibility Score with Tier & Empirical Disclaimer */}
                    <div className="space-y-1 sm:text-right lg:text-right">
                      <div>
                        {renderConfidenceBadge(w.overallConfidence, w.confidenceLevel)}
                      </div>
                      <p className="text-[11px] text-[#727A75] mt-1 font-medium">
                        {w.workRecordsCount} {t('contractorTab.projects')} · {w.evidenceItemsCount} {t('homeTab.evidenceItems')} · {w.confirmationsCount} {t('common.confirmations')}
                      </p>
                      <p className="text-[10px] text-[#8C938E] italic">
                        {t('contractorTab.empDisclaimer')}
                      </p>
                    </div>

                    {/* Actions: View Passport & Save */}
                    <div className="flex items-center space-x-3 w-full sm:w-auto pt-1">
                      <button
                        onClick={() => toggleSaveWorker(w.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-[#E5EFE8] text-[#245E3F] border-[#245E3F]/30'
                            : 'bg-[#F5F2EB] hover:bg-white text-[#484F4A] border-[#DFD9CE]'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? t('contractorTab.savedBadge') : t('contractorTab.save')}</span>
                      </button>

                      {/* View Passport opens full dedicated passport route */}
                      <Link
                        to={passportUrl}
                        className="px-5 py-2.5 rounded-xl bg-[#162B22] hover:bg-[#102019] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <span>{t('contractorApp.viewPassport')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}

            {filteredWorkers.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-[#DFD9CE] text-xs text-[#727A75] space-y-2">
                <p className="font-bold text-base text-[#141715]">
                  {activeTab === 'SAVED' ? t('contractorTab.noSavedYet') : t('contractorTab.noWorkersFound')}
                </p>
                <p className="max-w-md mx-auto">
                  {activeTab === 'SAVED'
                    ? 'Browse the directory of verified workers and click "Save" to shortlist technicians for your projects.'
                    : 'Try clearing your search keywords or choosing a different trade category.'}
                </p>
              </div>
            )}
          </div>
        )}

      </section>

    </div>
  );
};

export default ContractorTab;
