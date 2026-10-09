import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  QrCode, 
  Shield, 
  CheckCircle2, 
  Share2, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Languages, 
  FileText, 
  Image, 
  ExternalLink,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { SkillConfidenceLevel } from '../types';

export const PassportTab: React.FC = () => {
  const { worker, skills, workRecords, stats, setIsQrModalOpen, setSelectedWorkRecord, error, refreshData } = useApp();
  const { t } = useLanguage();
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>('skill_wiring');

  const getConfidenceBadge = (level: SkillConfidenceLevel) => {
    switch (level) {
      case 'HIGH':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20">
            {t('homeTab.highConfidence')}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-[#FAF0E6] text-[#C2672B] border border-[#C2672B]/25">
            {t('homeTab.buildingEvidence')}
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wide bg-[#F5F2EB] text-[#727A75] border border-[#DFD9CE]">
            {t('homeTab.needsEvidence')}
          </span>
        );
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-6 bg-white rounded-3xl border border-[#E5E1D8] text-center space-y-5">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF0F0] text-[#9E4545] flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h2 className="font-display font-bold text-xl text-[#121614]">
            Unable to Load Digital Passport
          </h2>
          <p className="text-sm text-[#737A75]">
            {error || "Could not retrieve passport credentials from the server."}
          </p>
        </div>
        <button
          onClick={() => refreshData()}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#1E3B2B] text-white text-xs font-semibold rounded-xl hover:bg-[#14281D] transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Header & Minimal Share Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#DFD9CE]">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#245E3F] font-bold bg-[#E5EFE8] px-2.5 py-0.5 rounded-full border border-[#245E3F]/20 inline-block">
            {t('passportTab.workerOwnedRecord')}
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] tracking-tight mt-1">
            {t('nav.professionalPassport')}
          </h1>
        </div>
        <button
          onClick={() => setIsQrModalOpen(true)}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-4 py-2 bg-[#162B22] text-white rounded-xl text-xs font-semibold hover:bg-[#102019] active:translate-y-[1px] transition-all shadow-xs cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-[#F5F2EB]" />
          <span>{t('homeTab.share')}</span>
        </button>
      </div>

      {/* 1. PERSON: Worker Portable Identity Card */}
      <div className="bg-[#E6EDE8] rounded-3xl border border-[#CBD5E1] shadow-xs overflow-hidden">
        {/* Clean Neutral Header */}
        <div className="bg-[#141715] text-white px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#C2672B]" />
            <span className="font-mono text-xs font-bold tracking-wider text-[#F5F2EB]">
              VOUCH PASSPORT
            </span>
          </div>
          <span className="font-mono text-xs text-white/80">
            {worker.passportId}
          </span>
        </div>

        <div className="p-6 sm:p-8 bg-stone-50/50 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden shrink-0 border border-stone-300 bg-stone-200 shadow-xs">
              <img
                alt={worker.name}
                className="w-full h-full object-cover"
                src={worker.portraitUrl}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#141715] uppercase tracking-wide truncate">
                {worker.name}
              </h3>
              <p className="text-sm font-bold text-[#245E3F]">
                {worker.trade} · {worker.experienceYears} {t('passportTab.documentedExp')}
              </p>
              
              <div className="pt-2 space-y-1 text-xs text-gray-600">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{worker.location}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Languages className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{t('passportTab.languages')} {worker.languages.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence-Backed Portability Notice (No arbitrary percentage scores) */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 gap-2">
            <span>
              {t('common.evidence')}: <strong className="text-[#245E3F] font-mono font-bold">{stats.workCount} {t('common.workRecords')} · {stats.confirmationCount} {t('workTab.supervisorVouches')}</strong>
            </span>
            <span className="text-gray-500 font-medium italic">
              {t('passportTab.sovereignRecord')}
            </span>
          </div>
        </div>
      </div>

      {/* 2. SKILLS: Skill-Specific Evidence Confidence */}
      <div className="bg-[#E6EDE8] rounded-3xl p-6 sm:p-8 border border-[#DFD9CE] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#141715]">{t('homeTab.demonstratedSkills')}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('passportTab.skillsSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {skills.map(skill => {
            const isExpanded = expandedSkillId === skill.id;
            const relevantRecords = workRecords.filter(r => r.skills.includes(skill.name));

            return (
              <div
                key={skill.id}
                className="border border-stone-200 rounded-2xl overflow-hidden transition-all bg-stone-50/40"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedSkillId(isExpanded ? null : skill.id)}
                  className="p-4 hover:bg-stone-100/60 cursor-pointer flex items-start justify-between"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center space-x-2.5 mb-1.5 flex-wrap gap-y-1">
                      <span className="text-sm sm:text-base font-bold text-gray-900">{skill.name}</span>
                      {getConfidenceBadge(skill.confidenceLevel)}
                    </div>
                    {/* Explainable evidence string */}
                    <p className="text-xs text-gray-600 font-medium">
                      {skill.explanation}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 text-emerald-800 text-xs font-semibold pt-0.5 shrink-0">
                    <span>{isExpanded ? t('passportTab.hide') : t('passportTab.viewEvidence')}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>

                {/* Explainable evidence accordion */}
                {isExpanded && (
                  <div className="p-4 bg-white border-t border-stone-200 text-xs space-y-3.5">
                    <p className="text-xs text-gray-600 italic">
                      &quot;{skill.description}&quot;
                    </p>

                    {/* Supporting records list */}
                    <div className="space-y-2">
                      <p className="font-bold text-gray-800 text-[11px] uppercase tracking-wider">
                        {t('passportTab.supportingRecords')} ({relevantRecords.length}):
                      </p>
                      {relevantRecords.map(r => (
                        <div
                          key={r.id}
                          onClick={() => setSelectedWorkRecord(r)}
                          className="p-3 rounded-xl bg-stone-50 border border-stone-200 hover:border-gray-400 cursor-pointer flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-gray-900 truncate text-xs">{r.title}</p>
                            <p className="text-[11px] text-gray-500">
                              {r.employer} · {r.date}
                            </p>
                          </div>
                          {r.status === 'CONFIRMED' ? (
                            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 shrink-0">
                              {t('common.confirmed')} ✓
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] shrink-0">
                              {t('passportTab.selfAdded')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Why confidence is rated */}
                    <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <p className="font-bold">{t('passportTab.whyRated')}</p>
                      <p className="text-stone-700 text-[11px] leading-relaxed">
                        {skill.supervisorConfirmationsCount > 0
                          ? `Backed by ${skill.supervisorConfirmationsCount} direct supervisor confirmations and ${skill.evidenceCount} verified photos/documents from active jobsites.`
                          : 'Currently supported by worker declaration with minimal independent verifications. Additional confirmations will increase confidence.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. WORK HISTORY: Portable Experience across Multiple Employers/Clients */}
      <div className="bg-[#E6EDE8] rounded-3xl p-6 sm:p-8 border border-[#DFD9CE] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#141715]">{t('passportTab.verifiedHistory')}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('passportTab.subtitle')}
            </p>
          </div>
          <span className="text-xs font-mono text-gray-400">{workRecords.length} {t('passportTab.recordsCount')}</span>
        </div>

        <div className="space-y-2.5">
          {workRecords.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedWorkRecord(item)}
              className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200 hover:border-gray-400 cursor-pointer flex items-center justify-between transition-all"
            >
              <div className="flex items-center space-x-3.5 min-w-0 pr-2">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-300">
                  <img alt={item.title} src={item.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{item.title}</p>
                  <p className="text-xs text-gray-600 truncate">
                    {item.employer} {item.role ? `· ${item.role}` : ''}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.date} · {item.location}</p>
                </div>
              </div>

              {item.status === 'CONFIRMED' ? (
                <span className="px-2.5 py-1 rounded-full bg-[#E5EFE8] text-[#245E3F] text-[11px] font-bold shrink-0 border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('common.confirmed')}</span>
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[11px] shrink-0">
                  {t('passportTab.selfAdded')}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. CONFIRMATIONS: Provenance Model */}
      <div className="bg-[#E6EDE8] rounded-3xl p-6 sm:p-8 border border-[#DFD9CE] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#141715]">{t('homeTab.statsConfirmations')}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {t('showcase.feature3Desc')}
          </p>
        </div>

        <div className="space-y-2.5">
          {workRecords
            .flatMap(r => r.confirmations)
            .filter(c => c.status === 'CONFIRMED')
            .map(conf => (
              <div
                key={conf.id}
                className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span>{conf.verifierName} ({conf.verifierRole})</span>
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full font-mono">
                    {conf.verifierType}
                  </span>
                </div>
                <div className="text-xs text-stone-700">
                  <span className="font-semibold">{conf.organization}</span> · Work: {conf.workTitle}
                </div>
                {conf.notes && (
                  <p className="text-xs text-stone-600 italic">&quot;{conf.notes}&quot;</p>
                )}
                <p className="text-[11px] text-gray-400 font-mono">{conf.date}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Primary Share Action */}
      <button
        onClick={() => setIsQrModalOpen(true)}
        className="w-full py-4 bg-[#162B22] text-white rounded-2xl font-bold text-sm flex items-center justify-center space-x-2 shadow-xs hover:bg-[#102019] active:translate-y-[1px] transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        <span>{t('publicPassport.shareTitle')}</span>
      </button>
    </div>
  );
};

export default PassportTab;
