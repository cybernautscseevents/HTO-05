import React from 'react';
import { Quote, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 sm:py-28 lg:py-32 bg-[#F5F2EB] border-t border-b border-[#DFD9CE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal delay={0} duration={600}>
          <div className="max-w-3xl mb-14 sm:mb-16">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-[#ECE7DE] border border-[#DFD9CE] mb-3 text-[11px] font-mono text-[#727A75]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#162B22]" />
              <span>{t('testimonials.tag', 'FIELD PERSPECTIVES')}</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#141715] tracking-tight leading-[1.08] mb-6">
              {t('testimonials.title', 'HEAR FROM THE JOB SITE')}
            </h2>
            <p className="text-lg text-[#484F4A] leading-relaxed">
              {t('testimonials.subtitle', 'How verified trade evidence impacts the day-to-day decisions of workers, jobsite supervisors, and general contractors.')}
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Concise Perspectives: Worker, Supervisor, Contractor */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Worker Perspective */}
          <ScrollReveal delay={0} duration={650} className="h-full flex flex-col">
            <div className="h-full bg-[#E6EDE8] rounded-2xl p-6 sm:p-7 border border-[#DFD9CE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#162B22] font-bold bg-[#E5EFE8] px-2.5 py-1 rounded">
                    WORKER PERSPECTIVE
                  </span>
                  <Quote className="w-5 h-5 text-[#DFD9CE]" />
                </div>
                <p className="text-sm text-[#141715] leading-relaxed mb-6 font-normal">
                  &quot;Before Vouch, my seven years of electrical installations were trapped with past contractors. When I moved cities, I had to accept apprentice pay for the first month. Now my passport proves my skill before I pick up a single wire.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-[#ECE7DE] flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-[#DFD9CE]">
                  <img
                    src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=150&auto=format&fit=crop&q=80"
                    alt="Ravi Kumar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#141715]">Ravi Kumar</h3>
                  <p className="text-xs text-[#727A75]">Lead Electrician · Mangaluru</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 2. Supervisor Perspective */}
          <ScrollReveal delay={100} duration={650} className="h-full flex flex-col">
            <div className="h-full bg-[#E6EDE8] rounded-2xl p-6 sm:p-7 border border-[#DFD9CE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C2672B] font-bold bg-[#FAF0E6] px-2.5 py-1 rounded">
                    SUPERVISOR PERSPECTIVE
                  </span>
                  <Quote className="w-5 h-5 text-[#DFD9CE]" />
                </div>
                <p className="text-sm text-[#141715] leading-relaxed mb-6 font-normal">
                  &quot;Field supervisors don&apos;t have time to write formal letters. With Vouch, a technician sends me a verification link and I review photos and confirm with one tap on WhatsApp. It honors their honest craftsmanship without paperwork.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-[#ECE7DE] flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#ECE7DE] border border-[#DFD9CE] flex items-center justify-center font-bold text-sm text-[#162B22]">
                  MS
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#141715]">Mahesh Shetty</h3>
                  <p className="text-xs text-[#727A75]">Site Supervisor · ABC Electricals</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* 3. Contractor Perspective */}
          <ScrollReveal delay={200} duration={650} className="h-full flex flex-col">
            <div className="h-full bg-[#E6EDE8] rounded-2xl p-6 sm:p-7 border border-[#DFD9CE] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#245E3F] font-bold bg-[#E5EFE8] px-2.5 py-1 rounded">
                    CONTRACTOR PERSPECTIVE
                  </span>
                  <Quote className="w-5 h-5 text-[#DFD9CE]" />
                </div>
                <p className="text-sm text-[#141715] leading-relaxed mb-6 font-normal">
                  &quot;We don&apos;t rely on word-of-mouth or generic CVs. When we brought in a commercial panel crew, being able to review their insulation Megger test sheets and verifier notes eliminated our commissioning rework risks entirely.&quot;
                </p>
              </div>
              <div className="pt-4 border-t border-[#ECE7DE] flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#ECE7DE] border border-[#DFD9CE] flex items-center justify-center font-bold text-sm text-[#245E3F]">
                  SR
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#141715]">Sunil Rao</h3>
                  <p className="text-xs text-[#727A75]">Project Director · Apex Buildcon</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
};
