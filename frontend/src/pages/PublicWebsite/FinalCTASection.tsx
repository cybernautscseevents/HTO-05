import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const FinalCTASection: React.FC = () => {
  const { isAuthenticated, activeRole } = useApp();
  const { t, language } = useLanguage();
  const buildPassportHref = isAuthenticated && activeRole === 'worker' ? '/build-passport' : '/login?redirect=/build-passport';

  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-[#162B22] text-white relative overflow-hidden">
      {/* Subtle background texture lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
        <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Subtle Tag & Giant Editorial Headline */}
          <ScrollReveal delay={0}>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 text-emerald-200 text-xs font-mono mb-8 border border-white/15">
              <ShieldCheck className="w-4 h-4 text-[#C2672B]" />
              <span>{language === 'hi' ? 'आज ही अपना व्यावसायिक रिकॉर्ड शुरू करें' : 'START YOUR VOCATIONAL RECORD TODAY'}</span>
            </div>

            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#F5F2EB] tracking-tight leading-[1.02] mb-8">
              {language === 'hi' ? (
                <>
                  आपकी मेहनत अनमोल है।<br />
                  <span className="text-[#C2672B]">इसे पोर्टेबल पहचान बनाएं।</span>
                </>
              ) : (
                <>
                  YOUR WORK<br />
                  ALREADY HAS VALUE.<br />
                  <span className="text-[#C2672B]">MAKE IT PORTABLE.</span>
                </>
              )}
            </h2>
          </ScrollReveal>

          {/* Supporting text */}
          <ScrollReveal delay={100}>
            <p className="text-lg sm:text-xl text-[#F5F2EB]/80 max-w-2xl mx-auto leading-relaxed mb-12 font-normal">
              {language === 'hi'
                ? 'एक ऐसी पेशेवर पहचान बनाएं जो हर नए काम, हर पुष्टि और हर साल के तजुर्बे के साथ बढ़ती रहे।'
                : 'Build a professional identity that grows with every project, every confirmation and every year of experience.'}
            </p>
          </ScrollReveal>

          {/* Real SPA CTAs */}
          <ScrollReveal delay={180}>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-5">
              <Link
                to={buildPassportHref}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-9 py-4 rounded-xl bg-[#F5F2EB] text-[#162B22] text-base font-bold tracking-wide hover:bg-white active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(0,0,0,0.25)] vouch-btn"
              >
                <span>{t('hero.buildPassport')}</span>
                <ArrowRight className="w-4 h-4 text-[#C2672B]" />
              </Link>

              <Link
                to="/employers"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-base font-semibold border border-white/20 transition-colors vouch-btn"
              >
                <span>{t('nav.forEmployers')}</span>
                <span className="text-[#C2672B]">→</span>
              </Link>
            </div>
          </ScrollReveal>

          {/* Micro-assurances */}
          <ScrollReveal delay={240}>
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#F5F2EB]/60 font-mono">
              <span>{language === 'hi' ? '✓ कारीगरों के लिए 100% मुफ़्त' : '✓ 100% Free for Workers'}</span>
              <span>{language === 'hi' ? '✓ शून्य बिचौलिया कमीशन' : '✓ Zero Middleman Commission'}</span>
              <span>{language === 'hi' ? '✓ डेटा का पूरा अधिकार कामगार का' : '✓ Worker Owns All Data'}</span>
              <span>{language === 'hi' ? '✓ व्हाट्सएप पर त्वरित सत्यापन' : '✓ Instant WhatsApp Verification'}</span>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};
