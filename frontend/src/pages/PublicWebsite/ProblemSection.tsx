import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, MessageSquareWarning, PhoneCall, Building2, ArrowRight, ShieldCheck, CheckCircle2, Camera, UserCheck, Layers } from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';

export const ProblemSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="problem" className="py-20 sm:py-28 lg:py-32 bg-[#F5F2EB] border-t border-b border-[#DFD9CE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal delay={0} duration={600}>
          <div className="max-w-3xl mb-16 sm:mb-20">
            <p className="text-xs font-mono uppercase tracking-widest text-[#C2672B] font-bold mb-3">
              {t('problem.tag', '01 / THE STRUCTURAL BREAKDOWN')}
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#141715] tracking-tight leading-[1.08] mb-6">
              {t('problem.title', 'EXPERIENCE SHOULDN\'T DISAPPEAR WHEN THE JOB ENDS.')}
            </h2>
            <p className="text-lg sm:text-xl text-[#484F4A] leading-relaxed">
              {t('problem.description', 'A worker can spend ten years mastering a trade and still have little portable proof of what they can do. Every new job starts from zero.')}
            </p>
          </div>
        </ScrollReveal>

        {/* Contrast Grid: Traditional vs Vouch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Traditional Worker Identity (Friction & Lost Value) */}
          <div className="lg:col-span-5 flex flex-col">
            <ScrollReveal delay={100} duration={650} className="h-full flex flex-col">
              <div className="h-full bg-[#F5F2EB] rounded-2xl p-6 sm:p-8 border border-[#DFD9CE] flex flex-col justify-between relative overflow-hidden shadow-xs">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#C2672B]"></div>
                
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold">
                      {t('problem.traditionalIdentity', 'TRADITIONAL IDENTITY')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FAF0E6] text-[#C2672B]">
                      {t('problem.fragileBadge', 'FRAGILE & LOCKED')}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#141715] mb-3">
                    {t('problem.card1Title', 'Scattered, Unverifiable & Lost')}
                  </h3>
                  <p className="text-sm text-[#484F4A] mb-8 leading-relaxed">
                    {t('problem.card1Desc', 'When a worker leaves an employer, their reputation remains behind in the contractor\'s phone, while hard-won trade experience disappears.')}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center shrink-0 text-[#C2672B]">
                        <FileQuestion className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.paperRecords', 'Paper records')}</h4>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('problem.paperRecordsDesc', 'Physical challans get lost, water-damaged, or discarded after site handovers.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center shrink-0 text-[#C2672B]">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.verbalRefs', 'Verbal references')}</h4>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('problem.verbalRefsDesc', 'Subjective phone calls to past bosses who may be busy, hostile, or unreachable.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center shrink-0 text-[#C2672B]">
                        <MessageSquareWarning className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.scatteredWa', 'Scattered WhatsApp messages')}</h4>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('problem.scatteredWaDesc', 'Site photos buried in chats with zero technical metadata or verifier signatures.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] flex items-center justify-center shrink-0 text-[#C2672B]">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.employerDep', 'Employer-dependent reputation')}</h4>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('problem.employerDepDesc', 'The contractor owns the reputation, not the skilled technician who did the work.')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#ECE7DE] text-xs font-mono text-[#C2672B] flex items-center space-x-1.5">
                  <span>{t('problem.resultLabel', 'RESULT:')}</span>
                  <span className="font-sans font-medium text-[#484F4A]">{t('problem.traditionalResult', 'Underpaid wages, repeated trial jobs, zero career compounding.')}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* CENTER: Visual Bridge / Transition Indicator (2 Cols on lg) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
            <ScrollReveal delay={150} duration={600}>
              <div className="hidden lg:flex flex-col items-center space-y-3">
                <div className="w-px h-16 bg-[#DFD9CE]"></div>
                <div className="w-10 h-10 rounded-full bg-[#162B22] text-white flex items-center justify-center shadow-sm">
                  <ArrowRight className="w-5 h-5 text-[#F5F2EB]" />
                </div>
                <div className="w-px h-16 bg-[#DFD9CE]"></div>
              </div>
              <div className="lg:hidden flex items-center justify-center space-x-3 my-2">
                <div className="h-px w-16 bg-[#DFD9CE]"></div>
                <span className="text-xs font-mono font-bold text-[#162B22] bg-[#ECE7DE] px-3 py-1 rounded-full border border-[#DFD9CE]">
                  {t('problem.transformsInto', 'TRANSFORMS INTO')}
                </span>
                <div className="h-px w-16 bg-[#DFD9CE]"></div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: VOUCH Portable Evidence Identity (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col">
            <ScrollReveal delay={200} duration={650} className="h-full flex flex-col">
              <div className="h-full bg-[#F5F2EB] rounded-2xl p-6 sm:p-8 border-2 border-[#162B22] flex flex-col justify-between relative overflow-hidden shadow-[0_12px_32px_rgba(22, 43, 34,0.08)]">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#162B22]"></div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#162B22] font-bold">
                      {t('problem.vouchIdentity', 'VOUCH IDENTITY')}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20">
                      {t('problem.vouchBadge', 'WORKER-OWNED & PORTABLE')}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#141715] mb-3">
                    {t('problem.vouchHeading', 'Independent, Confirmed & Permanent')}
                  </h3>
                  <p className="text-sm text-[#484F4A] mb-8 leading-relaxed">
                    {t('problem.vouchDesc', 'Every project turns into permanent professional equity. You carry your verified passport anywhere — across contractors, cities, and states.')}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE] shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F]">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.workHistory', 'Work history')}</h4>
                        <p className="text-xs text-[#484F4A] mt-0.5">{t('problem.workHistoryDesc', 'Chronological, immutable ledger of real jobs completed with exact trade roles.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE] shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F]">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.evidence', 'Evidence')}</h4>
                        <p className="text-xs text-[#484F4A] mt-0.5">{t('problem.evidenceDesc', 'High-resolution site photos, signed work orders, load testing sheets, and schematics.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE] shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F]">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.confirmations', 'Confirmations')}</h4>
                        <p className="text-xs text-[#484F4A] mt-0.5">{t('problem.confirmationsDesc', 'Signed off independently by verified supervisors, site engineers, and direct clients.')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5 p-3.5 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE] shadow-2xs">
                      <div className="w-8 h-8 rounded-lg bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#141715]">{t('problem.portablePassport', 'Portable passport')}</h4>
                        <p className="text-xs text-[#484F4A] mt-0.5">{t('problem.portablePassportDesc', 'Instant QR or link share that gives instant proof to any hiring contractor on day one.')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#ECE7DE] text-xs font-mono text-[#245E3F] flex items-center space-x-1.5">
                  <span>{t('problem.resultLabel', 'RESULT:')}</span>
                  <span className="font-sans font-medium text-[#141715]">{t('problem.vouchResult', 'Higher wages, instant trust on new sites, zero reliance on gatekeepers.')}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* Link to dedicated About Page */}
        <ScrollReveal delay={120} duration={600}>
          <div className="mt-12 text-center">
            <Link
              to="/about"
              className="vouch-btn inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white border border-[#DFD9CE] text-xs font-mono font-bold text-[#162B22] hover:bg-[#F5F2EB] transition-colors shadow-2xs"
            >
              <span>{t('problem.learnMoreGap', 'LEARN ABOUT THE TRADE CREDENTIAL GAP')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C2672B]" />
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
