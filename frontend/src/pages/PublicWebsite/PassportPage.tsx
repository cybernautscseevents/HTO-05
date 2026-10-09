import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  QrCode, 
  Share2, 
  FileCheck, 
  CheckCircle2, 
  Lock, 
  ExternalLink,
  Award,
  Layers,
  Clock,
  Printer
} from 'lucide-react';

export const PassportPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, activeRole } = useApp();
  const [copied, setCopied] = useState(false);

  const buildPassportHref = isAuthenticated && activeRole === 'worker' ? '/build-passport' : '/login?redirect=/build-passport';

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + '/passport/VOUCH-IN-2026-8842');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 sm:pt-36 animate-page-enter">
        
        {/* Passport Explainer Hero */}
        <section className="py-12 sm:py-20 border-b border-[#DFD9CE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <ScrollReveal delay={0}>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E5EFE8] text-[#245E3F] text-xs font-mono font-bold uppercase mb-6 border border-[#245E3F]/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('passportPage.badge')}</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#141715] tracking-tight leading-[1.04] mb-6">
                  {t('passportPage.heroTitle1')}<br />
                  <span className="text-[#162B22]">{t('passportPage.heroTitle2')}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <p className="text-lg sm:text-xl text-[#484F4A] leading-relaxed mb-8">
                  {t('passportPage.heroDesc')}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3.5 sm:space-y-0 sm:space-x-4">
                  <Link
                    to={buildPassportHref}
                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[#162B22] text-white font-semibold text-base hover:bg-[#102019] active:scale-[0.98] transition-all shadow-md vouch-btn"
                  >
                    <span>{t('passportPage.buildPassport')}</span>
                    <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                  </Link>
                  <Link
                    to="/passport/VOUCH-IN-2026-8842"
                    className="inline-flex items-center justify-center space-x-1.5 px-6 py-4 rounded-xl border border-[#DFD9CE] bg-white text-[#141715] hover:bg-[#F5F2EB] text-base font-medium transition-colors vouch-btn"
                  >
                    <span>{t('passportPage.openLiveView')}</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The 5 Key Principles of the Passport */}
        <section className="py-16 sm:py-24 bg-[#F5F2EB] border-b border-[#DFD9CE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              <ScrollReveal delay={0}>
                <div className="bg-[#E6EDE8] p-5 rounded-2xl border border-[#DFD9CE] h-full">
                  <span className="text-xs font-mono font-bold text-[#245E3F] uppercase block mb-1">{t('passportPage.p1Tag')}</span>
                  <h3 className="font-bold text-base text-[#141715] mb-1">{t('passportPage.p1Title')}</h3>
                  <p className="text-xs text-[#727A75]">{t('passportPage.p1Desc')}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={60}>
                <div className="bg-[#E6EDE8] p-5 rounded-2xl border border-[#DFD9CE] h-full">
                  <span className="text-xs font-mono font-bold text-[#245E3F] uppercase block mb-1">{t('passportPage.p2Tag')}</span>
                  <h3 className="font-bold text-base text-[#141715] mb-1">{t('passportPage.p2Title')}</h3>
                  <p className="text-xs text-[#727A75]">{t('passportPage.p2Desc')}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={120}>
                <div className="bg-[#E6EDE8] p-5 rounded-2xl border border-[#DFD9CE] h-full">
                  <span className="text-xs font-mono font-bold text-[#245E3F] uppercase block mb-1">{t('passportPage.p3Tag')}</span>
                  <h3 className="font-bold text-base text-[#141715] mb-1">{t('passportPage.p3Title')}</h3>
                  <p className="text-xs text-[#727A75]">{t('passportPage.p3Desc')}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <div className="bg-[#E6EDE8] p-5 rounded-2xl border border-[#DFD9CE] h-full">
                  <span className="text-xs font-mono font-bold text-[#245E3F] uppercase block mb-1">{t('passportPage.p4Tag')}</span>
                  <h3 className="font-bold text-base text-[#141715] mb-1">{t('passportPage.p4Title')}</h3>
                  <p className="text-xs text-[#727A75]">{t('passportPage.p4Desc')}</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <div className="bg-[#E6EDE8] p-5 rounded-2xl border border-[#DFD9CE] h-full">
                  <span className="text-xs font-mono font-bold text-[#245E3F] uppercase block mb-1">{t('passportPage.p5Tag')}</span>
                  <h3 className="font-bold text-base text-[#141715] mb-1">{t('passportPage.p5Title')}</h3>
                  <p className="text-xs text-[#727A75]">{t('passportPage.p5Desc')}</p>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* Full Passport UI Showcase (No Stars / No Fake 92% Numbers) */}
        <section className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#DFD9CE]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal delay={0}>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-mono uppercase tracking-widest text-[#162B22] font-bold block mb-2">
                  {t('passportPage.artifactTag')}
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[#141715]">
                  {t('passportPage.artifactHeading')}
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} variant="passport">
              <div className="bg-[#E6EDE8] rounded-3xl border-2 border-[#162B22] shadow-2xl overflow-hidden">
                
                {/* Header Ribbon */}
                <div className="bg-[#162B22] text-white px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-5 h-5 text-[#C2672B]" />
                    <span className="font-mono text-xs uppercase tracking-widest font-bold">
                      {t('passportPage.ribbonTitle')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <span>ID: VOUCH-IN-2026-8842</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {t('passportPage.ribbonActive')}
                    </span>
                  </div>
                </div>

                {/* Identity Header */}
                <div className="p-6 sm:p-10 border-b border-[#DFD9CE] guilloche-pattern">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-3 flex justify-center sm:justify-start">
                      <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-[#162B22] shadow-md bg-gray-100 relative">
                        <img
                          src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=400&auto=format&fit=crop&q=80"
                          alt="Ravi Kumar"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 bg-white/95 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-[#162B22]">
                          VERIFIED ID
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <span className="text-xs font-mono text-[#727A75] uppercase block">{t('passportPage.holder')}</span>
                      <h3 className="font-display font-extrabold text-3xl text-[#141715] mb-2">
                        RAVI KUMAR
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('common.trade')}</span>
                          <span className="font-bold text-[#162B22]">{t('passportPage.sampleRole')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('common.role')}</span>
                          <span className="font-bold text-[#141715]">{t('passportPage.sampleExp')}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#484F4A] bg-[#F5F2EB] p-3 rounded-lg border border-[#DFD9CE]">
                        {t('passportPage.sampleBio')}
                      </p>
                    </div>

                    <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-[#F5F2EB] rounded-xl border border-[#DFD9CE] text-center">
                      <div className="w-20 h-20 bg-white p-1 rounded-lg border border-[#DFD9CE] flex items-center justify-center mb-1">
                        <QrCode className="w-16 h-16 text-[#162B22]" />
                      </div>
                      <span className="text-[10px] font-mono uppercase text-[#727A75] mb-2">
                        {t('passportPage.scanOnSite')}
                      </span>
                      <button
                        onClick={handleCopyLink}
                        className="text-xs font-semibold text-[#162B22] hover:underline flex items-center space-x-1 cursor-pointer vouch-btn"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>{copied ? t('common.copied') : t('common.share')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Skills with Evidence-Backed Language (No stars, no fake numerical ratings) */}
                <div className="p-6 sm:p-10 border-b border-[#DFD9CE]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-bold text-lg text-[#141715]">
                      {t('passportPage.skillsHeading')}
                    </h4>
                    <span className="text-xs font-mono text-[#245E3F] font-bold bg-[#E5EFE8] px-2.5 py-1 rounded">
                      {t('passportPage.evidenceCalibrated')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Skill 1 */}
                    <div className="p-4 rounded-xl border border-[#DFD9CE] bg-[#F5F2EB]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h5 className="font-bold text-sm text-[#141715]">{t('categories.electrician')}</h5>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20 w-fit">
                          {t('passportPage.highConfidence')}
                        </span>
                      </div>
                      <p className="text-xs text-[#727A75] mb-2">
                        Code-compliant conduit wiring, earthing pits, RCCB trip protection, and sub-meter distribution.
                      </p>
                      <div className="text-xs font-mono text-[#162B22] font-semibold pt-2 border-t border-[#DFD9CE]">
                        8 {t('common.workRecords')} · 12 {t('common.evidence')} · 3 {t('common.confirmations')}
                      </div>
                    </div>

                    {/* Skill 2 */}
                    <div className="p-4 rounded-xl border border-[#DFD9CE] bg-[#F5F2EB]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h5 className="font-bold text-sm text-[#141715]">Commercial Panel Installation</h5>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20 w-fit">
                          {t('passportPage.highConfidence')}
                        </span>
                      </div>
                      <p className="text-xs text-[#727A75] mb-2">
                        Three-phase main LT distribution boards, automatic changeover switches, and busbar trunking.
                      </p>
                      <div className="text-xs font-mono text-[#162B22] font-semibold pt-2 border-t border-[#DFD9CE]">
                        5 {t('common.workRecords')} · 7 {t('common.evidence')} · 2 {t('common.confirmations')}
                      </div>
                    </div>

                    {/* Skill 3 */}
                    <div className="p-4 rounded-xl border border-[#DFD9CE] bg-[#F5F2EB]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <h5 className="font-bold text-sm text-[#141715]">AC Electrical Feeds & Motor Repair</h5>
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#FEF3C7] text-[#B45309] border border-[#B45309]/20 w-fit">
                          {t('passportPage.mediumConfidence')}
                        </span>
                      </div>
                      <p className="text-xs text-[#727A75] mb-2">
                        Dedicated 20A isolators, copper pipe grounding, and 3-phase induction motor stator rewinding.
                      </p>
                      <div className="text-xs font-mono text-[#B45309] font-semibold pt-2 border-t border-[#DFD9CE]">
                        3 {t('common.workRecords')} · 4 {t('common.evidence')} · 1 {t('common.confirmations')}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-6 sm:p-8 bg-[#F5F2EB] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-2 text-xs text-[#484F4A]">
                    <CheckCircle2 className="w-4 h-4 text-[#245E3F]" />
                    <span>{t('passportPage.footerGuarantee')}</span>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <Link
                      to={buildPassportHref}
                      className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#162B22] text-white hover:bg-[#102019] text-xs font-bold text-center transition-colors vouch-btn"
                    >
                      {t('passportPage.buildNow')}
                    </Link>
                    <Link
                      to="/passport/VOUCH-IN-2026-8842"
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg border border-[#DFD9CE] bg-white hover:bg-gray-50 text-xs font-bold text-center transition-colors flex items-center justify-center space-x-1 vouch-btn"
                    >
                      <span>{t('passportPage.fullLiveView')}</span>
                      <ExternalLink className="w-3 h-3 text-[#162B22]" />
                    </Link>
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
};

export default PassportPage;
