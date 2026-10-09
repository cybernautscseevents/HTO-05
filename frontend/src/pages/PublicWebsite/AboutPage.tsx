import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Award, 
  FileCheck,
  Building2,
  Users
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, activeRole } = useApp();

  const buildPassportHref = isAuthenticated && activeRole === 'worker' ? '/build-passport' : '/login?redirect=/build-passport';

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 sm:pt-36 animate-page-enter">
        
        {/* About Hero Section */}
        <section className="py-12 sm:py-20 border-b border-[#DFD9CE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <ScrollReveal delay={0}>
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#E5EFE8] text-[#245E3F] text-xs font-mono font-bold uppercase mb-6 border border-[#245E3F]/20">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('aboutPage.badge')}</span>
                </div>

                <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#141715] tracking-tight leading-[1.04] mb-6">
                  {t('aboutPage.heroTitle1')}<br />
                  <span className="text-[#162B22]">{t('aboutPage.heroTitle2')}</span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={100}>
                <p className="text-lg sm:text-xl text-[#484F4A] leading-relaxed mb-8">
                  {t('aboutPage.heroDesc')}
                </p>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <div className="flex items-center space-x-4">
                  <Link
                    to={buildPassportHref}
                    className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#162B22] text-white font-semibold text-base hover:bg-[#102019] active:scale-[0.98] transition-all shadow-md vouch-btn"
                  >
                    <span>{t('aboutPage.buildPassport')}</span>
                    <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="px-6 py-4 rounded-xl border border-[#DFD9CE] bg-white text-[#141715] hover:bg-[#F5F2EB] text-sm font-semibold transition-colors vouch-btn"
                  >
                    <span>{t('aboutPage.howVerificationWorks')}</span>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* The Fundamental Asymmetry: White-Collar vs Skilled Trades */}
        <section className="py-20 sm:py-28 bg-[#F5F2EB] border-b border-[#DFD9CE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal delay={0}>
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-[#162B22] font-bold block mb-3">
                  {t('aboutPage.realityTag')}
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#141715] tracking-tight leading-[1.08] mb-4">
                  {t('aboutPage.realityHeading')}
                </h2>
                <p className="text-lg text-[#484F4A]">
                  {t('aboutPage.realityDesc')}
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              
              {/* White Collar Side */}
              <ScrollReveal delay={100}>
                <div className="p-8 rounded-2xl bg-white border border-[#DFD9CE] flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#727A75] font-semibold block mb-2">
                      {t('aboutPage.whiteCollarTag')}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-[#141715] mb-4">
                      {t('aboutPage.whiteCollarTitle')}
                    </h3>
                    <div className="space-y-3 text-sm text-[#484F4A]">
                      <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE]">
                        <span className="font-semibold text-[#141715]">{t('aboutPage.whiteCollarItem1Title')}</span>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('aboutPage.whiteCollarItem1Desc')}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE]">
                        <span className="font-semibold text-[#141715]">{t('aboutPage.whiteCollarItem2Title')}</span>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('aboutPage.whiteCollarItem2Desc')}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE]">
                        <span className="font-semibold text-[#141715]">{t('aboutPage.whiteCollarItem3Title')}</span>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('aboutPage.whiteCollarItem3Desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#ECE7DE] text-xs font-mono text-[#245E3F]">
                    {t('aboutPage.whiteCollarOutcome')}
                  </div>
                </div>
              </ScrollReveal>

              {/* Skilled Trades Side */}
              <ScrollReveal delay={200}>
                <div className="p-8 rounded-2xl bg-[#F5F2EB] border-2 border-[#162B22] flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#162B22] font-bold block mb-2">
                      {t('aboutPage.tradesTag')}
                    </span>
                    <h3 className="font-display font-bold text-2xl text-[#141715] mb-4">
                      {t('aboutPage.tradesTitle')}
                    </h3>
                    <div className="space-y-3 text-sm text-[#484F4A]">
                      <div className="p-3 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                        <span className="font-semibold text-[#141715]">{t('aboutPage.tradesItem1Title')}</span>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('aboutPage.tradesItem1Desc')}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                        <span className="font-semibold text-[#141715]">{t('aboutPage.tradesItem2Title')}</span>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('aboutPage.tradesItem2Desc')}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-[#E6EDE8] border border-[#DFD9CE]">
                        <span className="font-semibold text-[#141715]">{t('aboutPage.tradesItem3Title')}</span>
                        <p className="text-xs text-[#727A75] mt-0.5">{t('aboutPage.tradesItem3Desc')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#ECE7DE] text-xs font-mono text-[#C2672B]">
                    {t('aboutPage.tradesProblem')}
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </section>

        {/* The Vouch Equation Section */}
        <section className="py-20 sm:py-28 bg-[#162B22] text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <ScrollReveal delay={0}>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-bold block mb-4">
                {t('aboutPage.formulaTag')}
              </span>

              <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-white mb-10">
                {t('aboutPage.formulaHeading')}
              </h2>
            </ScrollReveal>

            {/* Formula Banner */}
            <ScrollReveal delay={100}>
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center bg-white/10 p-6 sm:p-8 rounded-3xl border border-white/20 mb-10 text-center font-mono">
                <div className="sm:col-span-1 bg-white/15 p-4 rounded-2xl">
                  <span className="text-xs text-emerald-300 block mb-1">01</span>
                  <span className="font-bold text-lg text-white">{t('aboutPage.stepWork')}</span>
                </div>
                <div className="sm:col-span-1 text-2xl font-bold text-[#C2672B]">+</div>
                <div className="sm:col-span-1 bg-white/15 p-4 rounded-2xl">
                  <span className="text-xs text-emerald-300 block mb-1">02</span>
                  <span className="font-bold text-lg text-white">{t('aboutPage.stepEvidence')}</span>
                </div>
                <div className="sm:col-span-1 text-2xl font-bold text-[#C2672B]">+</div>
                <div className="sm:col-span-1 bg-white/15 p-4 rounded-2xl">
                  <span className="text-xs text-emerald-300 block mb-1">03</span>
                  <span className="font-bold text-lg text-white">{t('aboutPage.stepConfirmation')}</span>
                </div>
                <div className="sm:col-span-1 text-2xl font-bold text-[#C2672B]">=</div>
                <div className="sm:col-span-1 bg-[#C2672B] p-4 rounded-2xl text-white">
                  <span className="text-xs text-white/80 block mb-1">RESULT</span>
                  <span className="font-bold text-sm text-white">{t('aboutPage.stepResult')}</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
                {t('aboutPage.formulaDesc')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={220}>
              <Link
                to={buildPassportHref}
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-white text-[#162B22] font-bold text-base hover:bg-gray-100 transition-colors shadow-lg vouch-btn"
              >
                <span>{t('aboutPage.formulaCta')}</span>
                <ArrowRight className="w-4 h-4 text-[#C2672B]" />
              </Link>
            </ScrollReveal>

          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
};

export default AboutPage;
