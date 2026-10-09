import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const HeroSection: React.FC = () => {
  const { isAuthenticated, activeRole } = useApp();
  const { t } = useLanguage();
  const buildPassportHref = isAuthenticated && activeRole === 'worker' ? '/build-passport' : '/login?redirect=/build-passport';

  return (
    <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32 overflow-hidden bg-[#F5F2EB]">
      {/* Subtle architectural baseline grid lines (not artificial blobs) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
        <div className="w-full h-full bg-[linear-gradient(to_right,#141715_1px,transparent_1px),linear-gradient(to_bottom,#141715_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Status Pill / Credibility Tag */}
            <ScrollReveal delay={0} duration={550}>
              <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-[#ECE7DE] border border-[#DFD9CE] w-fit mb-6 sm:mb-8">
                <span className="w-2 h-2 rounded-full bg-[#245E3F]"></span>
                <span className="text-[12px] font-semibold tracking-wide uppercase text-[#162B22]">
                  {t('hero.tag')}
                </span>
              </div>

              {/* Giant Editorial Headline */}
              <h1 className="font-display font-extrabold text-[44px] sm:text-[62px] lg:text-[72px] leading-[1.02] tracking-[-0.035em] text-[#141715] mb-6">
                {t('hero.titleLine1')}<br />
                <span className="text-[#162B22]">{t('hero.titleLine2')}</span>
              </h1>
            </ScrollReveal>

            {/* Supporting Copy */}
            <ScrollReveal delay={100} duration={600}>
              <p className="text-lg sm:text-xl leading-relaxed text-[#484F4A] max-w-2xl mb-8 sm:mb-10 font-normal">
                {t('hero.description')}
              </p>
            </ScrollReveal>

            {/* Real SPA Navigation CTAs */}
            <ScrollReveal delay={180} duration={600}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3.5 sm:space-y-0 sm:space-x-4 mb-10 sm:mb-12">
                <Link
                  to={buildPassportHref}
                  className="vouch-btn inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl bg-[#162B22] text-[#F5F2EB] text-base font-semibold tracking-wide hover:bg-[#102019] active:scale-[0.98] transition-all shadow-[0_4px_16px_rgba(22, 43, 34,0.18)]"
                >
                  <span>{t('hero.buildPassport')}</span>
                  <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="vouch-btn inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-transparent hover:bg-[#ECE7DE] text-[#141715] text-base font-medium border border-[#DFD9CE] transition-colors"
                >
                  <span>{t('hero.seeHowItWorks')}</span>
                  <span className="text-[#727A75]">→</span>
                </Link>
              </div>
            </ScrollReveal>

            {/* Restrained Value Anchor Badges */}
            <ScrollReveal delay={240} duration={600}>
              <div className="pt-6 border-t border-[#DFD9CE] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="text-xs uppercase font-mono text-[#727A75] tracking-wider mb-1">{t('hero.ownership')}</p>
                  <p className="text-sm font-semibold text-[#141715]">{t('hero.workerOwned')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-mono text-[#727A75] tracking-wider mb-1">{t('hero.validation')}</p>
                  <p className="text-sm font-semibold text-[#141715]">{t('hero.evidenceBacked')}</p>
                </div>
                <div>
                  <p className="text-xs uppercase font-mono text-[#727A75] tracking-wider mb-1">{t('hero.mobility')}</p>
                  <p className="text-sm font-semibold text-[#141715]">{t('hero.crossEmployer')}</p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Documentary Photography + Overlay Passport UI (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              
              {/* Asymmetric Worker Photography Container */}
              <ScrollReveal delay={160} duration={700}>
                <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(18,22,20,0.12)] border border-[#DFD9CE] bg-[#ECE7DE] aspect-[4/5] sm:aspect-[3/4] reveal-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1200&auto=format&fit=crop&q=80"
                    alt="Real electrician working on commercial distribution panel"
                    className="w-full h-full object-cover object-center filter saturate-[0.95] contrast-[1.03] reveal-image-zoom"
                    loading="eager"
                  />
                  
                  {/* Subtle gradient vignette at bottom for card readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141715]/80 via-transparent to-transparent"></div>
                  
                  {/* Documentary Caption */}
                  <div className="absolute top-4 left-4 bg-[#F5F2EB]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-[#162B22] border border-[#DFD9CE]">
                    ON-SITE VERIFICATION · MANGALURU
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
