import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { HowItWorksSection } from './HowItWorksSection';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, activeRole } = useApp();

  const buildPassportHref = isAuthenticated && activeRole === 'worker' ? '/build-passport' : '/login?redirect=/build-passport';

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col selection:bg-[#162B22] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 pt-28 sm:pt-36 animate-page-enter">
        
        {/* How It Works Hero */}
        <section className="py-12 sm:py-20 border-b border-[#DFD9CE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <ScrollReveal delay={0}>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E5EFE8] text-[#245E3F] text-xs font-mono font-bold uppercase mb-6 border border-[#245E3F]/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('howItWorks.badge', 'THE VERIFICATION ENGINE')}</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#141715] tracking-tight leading-[1.04] mb-6">
                  {t('howItWorks.heroTitle1', 'FROM WORK')}<br />
                  <span className="text-[#162B22]">{t('howItWorks.heroTitle2', 'TO PROOF.')}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <p className="text-lg sm:text-xl text-[#484F4A] leading-relaxed mb-8">
                  {t('howItWorks.heroDesc', 'How Vouch turns raw physical labor into a tamper-evident, portable professional identity through a transparent four-stage pipeline.')}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    to={buildPassportHref}
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#162B22] text-white font-semibold text-base hover:bg-[#102019] active:scale-[0.98] transition-all shadow-md vouch-btn"
                  >
                    <span>{t('howItWorks.startPassport', 'Start Your Passport')}</span>
                    <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                  </Link>
                  <Link
                    to="/passport"
                    className="px-6 py-4 rounded-xl border border-[#DFD9CE] bg-white text-[#141715] hover:bg-[#F5F2EB] text-sm font-semibold transition-colors vouch-btn"
                  >
                    <span>{t('howItWorks.viewStructure', 'View Passport Structure →')}</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CANONICAL VERTICAL SCROLL STORYTELLING PIPELINE */}
        <HowItWorksSection />

        {/* Tamper-Resistant Proof Callout Banner */}
        <section className="py-16 bg-[#F5F2EB] border-t border-[#DFD9CE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal delay={0}>
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#DFD9CE] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#245E3F]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('howItWorks.protocolTitle', 'WORKER-OWNED VERIFICATION PROTOCOL')}</span>
                  </div>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715]">
                    {t('howItWorks.protocolHeading', 'No past employer owns your identity.')}
                  </h3>
                  <p className="text-sm sm:text-base text-[#484F4A] leading-relaxed">
                    {t('howItWorks.protocolDesc', 'Confirmations are cryptographically anchored to verified verifier phone numbers and organization credentials. Your work records and confidence ratings belong to you permanently, carried from project to project.')}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  <Link
                    to={buildPassportHref}
                    className="px-6 py-3.5 rounded-xl bg-[#162B22] text-white text-xs font-mono font-bold text-center hover:bg-[#102019] transition-colors shadow-xs"
                  >
                    {t('footer.buildPassport', 'BUILD YOUR PASSPORT →')}
                  </Link>
                  <Link
                    to="/employers"
                    className="px-6 py-3.5 rounded-xl bg-white border border-[#DFD9CE] text-[#141715] text-xs font-mono font-bold text-center hover:bg-[#F5F2EB] transition-colors"
                  >
                    {t('footer.forEmployers', 'FOR HIRERS & CONTRACTORS')}
                  </Link>
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

export default HowItWorksPage;
