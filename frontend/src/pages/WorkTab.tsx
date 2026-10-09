import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { WorkRecord } from '../types';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Image, 
  FileText, 
  ArrowRight,
  AlertCircle,
  RefreshCw,
  XCircle,
  Layers
} from 'lucide-react';

export const WorkTab: React.FC = () => {
  const { 
    workRecords, 
    isLoading,
    error,
    refreshData,
    setSelectedWorkRecord, 
    setIsAddWorkOpen, 
    setActiveVerifierRecord, 
    setIsVerifierModalOpen 
  } = useApp();
  
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'PENDING'>('ALL');

  const filteredRecords = workRecords.filter(r => {
    if (filter === 'CONFIRMED') return r.status === 'CONFIRMED';
    if (filter === 'PENDING') return r.status !== 'CONFIRMED';
    return true;
  });

  // ---------------------------------------------------------------------------
  // 1. Loading Skeleton State
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#DFD9CE]">
          <div className="space-y-2">
            <div className="h-8 w-60 bg-[#DFD9CE] rounded-xl"></div>
            <div className="h-4 w-72 bg-[#ECE7DE] rounded-md"></div>
          </div>
          <div className="h-10 w-36 bg-[#DFD9CE] rounded-xl"></div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex space-x-2">
          <div className="h-9 w-28 bg-[#DFD9CE] rounded-xl"></div>
          <div className="h-9 w-28 bg-[#ECE7DE] rounded-xl"></div>
          <div className="h-9 w-28 bg-[#ECE7DE] rounded-xl"></div>
        </div>

        {/* Record Cards Skeleton */}
        <div className="space-y-4">
          <div className="h-48 bg-white rounded-3xl border border-[#DFD9CE]"></div>
          <div className="h-48 bg-white rounded-3xl border border-[#DFD9CE]"></div>
          <div className="h-48 bg-white rounded-3xl border border-[#DFD9CE]"></div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. Error State
  // ---------------------------------------------------------------------------
  if (error) {
    return (
      <div className="w-full max-w-5xl mx-auto py-12 px-6 bg-white rounded-3xl border border-[#DFD9CE] text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF0F0] text-[#9E4545] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h2 className="font-display font-bold text-xl text-[#141715]">
            Unable to Load Work Records
          </h2>
          <p className="text-sm text-[#727A75]">
            {error || "Could not retrieve work history from the server."}
          </p>
        </div>
        <button
          onClick={() => refreshData()}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#162B22] text-white text-xs font-semibold rounded-xl hover:bg-[#102019] transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#DFD9CE]">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] tracking-tight">
            {t('workTab.title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#727A75] mt-1">
            {t('workTab.headerDesc')}
          </p>
        </div>
        <button
          onClick={() => setIsAddWorkOpen(true)}
          className="self-start sm:self-auto flex items-center space-x-2 px-5 py-2.5 bg-[#162B22] text-white rounded-xl text-xs font-semibold hover:bg-[#102019] active:translate-y-[1px] transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>{t('workTab.addRecord')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-[#162B22] text-white shadow-xs'
              : 'bg-white text-[#484F4A] hover:bg-gray-50 border border-[#DFD9CE]'
          }`}
        >
          {t('workTab.allRecords')} ({workRecords.length})
        </button>
        <button
          onClick={() => setFilter('CONFIRMED')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            filter === 'CONFIRMED'
              ? 'bg-[#245E3F] text-white shadow-xs'
              : 'bg-white text-[#484F4A] hover:bg-gray-50 border border-[#DFD9CE]'
          }`}
        >
          {t('workTab.confirmed')} ({workRecords.filter(r => r.status === 'CONFIRMED').length})
        </button>
        <button
          onClick={() => setFilter('PENDING')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
            filter === 'PENDING'
              ? 'bg-[#141715] text-white shadow-xs'
              : 'bg-white text-[#484F4A] hover:bg-gray-50 border border-[#DFD9CE]'
          }`}
        >
          {t('workTab.awaitingVouch')} ({workRecords.filter(r => r.status !== 'CONFIRMED').length})
        </button>
      </div>

      {/* Work Records Feed */}
      {filteredRecords.length > 0 ? (
        <div className="space-y-4">
          {filteredRecords.map(record => {
            const isConfirmed = record.status === 'CONFIRMED';
            const isRejected = record.status === 'REJECTED';
            const photosCount = (record.evidenceItems || []).filter(e => e.type === 'PHOTO' || e.type === 'VIDEO').length;
            const docsCount = (record.evidenceItems || []).filter(e => e.type !== 'PHOTO' && e.type !== 'VIDEO').length;
            const confsCount = (record.confirmations || []).filter(c => c.status === 'CONFIRMED').length;

            return (
              <div
                key={record.id}
                className="bg-[#E6EDE8] rounded-3xl p-5 sm:p-6 border border-[#DFD9CE] shadow-xs hover:border-[#162B22]/40 transition-all flex flex-col space-y-4"
              >
                <div 
                  onClick={() => setSelectedWorkRecord(record)}
                  className="flex items-start space-x-4 cursor-pointer"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#ECE7DE] shrink-0 border border-[#DFD9CE]">
                    <img
                      alt={record.title}
                      src={record.imageUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#141715] truncate pr-1">
                        {record.title}
                      </h3>
                      {isConfirmed ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E5EFE8] text-[#245E3F] text-[11px] font-bold flex items-center space-x-1 shrink-0 border border-[#245E3F]/20">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#245E3F]" />
                          <span>{t('workTab.confirmed')}</span>
                        </span>
                      ) : isRejected ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0F0] text-[#9E4545] text-[11px] font-bold flex items-center space-x-1 shrink-0 border border-[#9E4545]/20">
                          <XCircle className="w-3.5 h-3.5 text-[#9E4545]" />
                          <span>{t('workTab.needsReview')}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold flex items-center space-x-1 shrink-0 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t('workTab.needsVouch')}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-[#484F4A] truncate mt-1">
                      {record.employer} · {record.location}
                    </p>
                    <p className="text-xs text-[#727A75] mt-0.5">
                      {record.date} {record.quantity ? `· ${record.quantity} ${record.quantityUnit || 'units'}` : ''}
                    </p>
                  </div>
                </div>

                {/* Skills Supported relationship */}
                <div className="p-3.5 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE] text-xs space-y-1.5">
                  <span className="text-[11px] font-mono uppercase font-bold text-[#727A75] tracking-wider block">
                    {t('workTab.demonstratesSkills')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {record.skills.map(s => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-[#E5EFE8] text-[#162B22] text-xs font-bold border border-[#245E3F]/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Evidence & Confirmation counts */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-[#ECE7DE] text-xs gap-3">
                  <div className="flex items-center space-x-3 text-[#484F4A] font-medium">
                    <span className="flex items-center space-x-1.5">
                      <Image className="w-3.5 h-3.5 text-[#727A75]" />
                      <span>{photosCount} {t('workTab.photos')}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#727A75]" />
                      <span>{docsCount} {t('workTab.docs')}</span>
                    </span>
                    <span>·</span>
                    <span className="text-[#245E3F] font-semibold">{confsCount} {t('workTab.supervisorVouches')}</span>
                  </div>

                  <div className="flex items-center space-x-3 self-end sm:self-auto">
                    {!isConfirmed && (
                      <button
                        onClick={() => {
                          setActiveVerifierRecord(record);
                          setIsVerifierModalOpen(true);
                        }}
                        className="flex items-center space-x-1.5 text-emerald-800 font-bold hover:underline bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>{t('workTab.simulateVouch')}</span>
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedWorkRecord(record)}
                      className="text-[#141715] hover:text-[#162B22] font-semibold flex items-center space-x-1 cursor-pointer py-1"
                    >
                      <span>{t('workTab.viewAuditRecord')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 bg-white rounded-3xl border border-[#DFD9CE] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E5EFE8] text-[#162B22] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-[#141715]">
              {t('workTab.noRecordsFound')}
            </h3>
            <p className="text-xs text-[#727A75] max-w-sm mx-auto">
              {filter === 'ALL'
                ? t('workTab.emptyDescAll')
                : `${t('workTab.noRecords')} (${filter.toLowerCase()})`}
            </p>
          </div>
          <button
            onClick={() => setIsAddWorkOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-[#162B22] text-white text-xs font-semibold rounded-xl hover:bg-[#102019] transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('workTab.addRecord')}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkTab;
