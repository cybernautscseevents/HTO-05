import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Search, 
  SlidersHorizontal, 
  Bookmark, 
  CheckCircle2, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useLanguage } from '../../i18n/LanguageContext';

export const EmployerSection: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section id="employers" className="py-20 sm:py-28 lg:py-32 bg-[#F5F2EB] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal delay={0} duration={650}>
              <p className="text-xs font-mono uppercase tracking-widest text-[#C2672B] font-bold mb-3">
                {t('employerSec.tag', '06 / CONTRACTOR & HIRER EVALUATION')}
              </p>
              
              <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#141715] tracking-tight leading-[1.08] mb-6">
                {t('employerSec.title', 'HIRE WITH CERTAINTY, NOT GUESSWORK')}
              </h2>

              <p className="text-lg sm:text-xl text-[#484F4A] leading-relaxed mb-8">
                {t('employerSec.subtitle', 'Discover skilled workers through the work they\'ve actually done — and the people who can confirm it.')}
              </p>

              {/* Evidence Evaluation Highlights (NOT A Job Board) */}
              <div className="space-y-4 mb-10">
                <div className="flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-md bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#141715]">Search by specific trade tasks</h3>
                    <p className="text-xs text-[#727A75] mt-0.5">Filter by demonstrated capabilities like 415V LT panels, VRF copper piping, or multi-story formwork.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-md bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#141715]">Review raw on-site proof</h3>
                    <p className="text-xs text-[#727A75] mt-0.5">Inspect timestamped jobsite photos, megger test certificates, and physical work order sheets.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5">
                  <div className="w-6 h-6 rounded-md bg-[#E5EFE8] flex items-center justify-center shrink-0 text-[#245E3F] mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#141715]">Direct peer confirmations</h3>
                    <p className="text-xs text-[#727A75] mt-0.5">See sign-offs from respected site supervisors and builders with known company affiliations.</p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/employers"
                  className="vouch-btn inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-[#162B22] text-white font-semibold text-base hover:bg-[#102019] active:scale-[0.98] transition-all shadow-sm"
                >
                  <span>Employer Verification Model</span>
                  <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                </Link>
                <Link
                  to="/contractor"
                  className="vouch-btn inline-flex items-center space-x-2 px-6 py-4 rounded-xl bg-white border border-[#DFD9CE] text-[#141715] hover:bg-[#F5F2EB] text-sm font-semibold transition-colors"
                >
                  <span>Explore Worker Directory →</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Contractor Evaluation Terminal Preview */}
          <div className="lg:col-span-6">
            <ScrollReveal delay={120} duration={700}>
              <div className="bg-[#F5F2EB] rounded-3xl p-6 sm:p-7 border border-[#DFD9CE] shadow-[0_20px_50px_rgba(18,22,20,0.08)]">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#DFD9CE] mb-5">
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#141715]">
                    <Briefcase className="w-4 h-4 text-[#162B22]" />
                    <span>CONTRACTOR EVIDENCE PORTAL</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#ECE7DE] text-[#484F4A]">
                    FILTER: ELECTRICIAN
                  </span>
                </div>

                {/* Search Bar Simulation */}
                <div className="flex items-center space-x-2 bg-white px-3.5 py-2.5 rounded-xl border border-[#DFD9CE] mb-5 text-xs text-[#727A75]">
                  <Search className="w-4 h-4 text-[#727A75]" />
                  <span className="text-[#141715] font-medium">Distribution Board · 5+ yrs experience</span>
                  <div className="ml-auto flex items-center space-x-1.5 text-[11px] font-mono text-[#162B22]">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Active Filters (2)</span>
                  </div>
                </div>

                {/* Verified Worker Evaluation Card (Routes to /passport) */}
                <div 
                  onClick={() => navigate('/passport')}
                  className="bg-[#E6EDE8] rounded-2xl p-5 border border-[#DFD9CE] hover:border-[#162B22] transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-[#DFD9CE] bg-gray-100 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=300&auto=format&fit=crop&q=80"
                          alt="Ravi Kumar candidate"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-display font-bold text-base text-[#141715]">
                            Ravi Kumar
                          </h4>
                          <span className="w-2 h-2 rounded-full bg-[#245E3F]"></span>
                        </div>
                        <p className="text-xs text-[#484F4A] mt-0.5">
                          Electrician · 7 years · Mangaluru / Mumbai
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate('/contractor'); }}
                      className="p-2 text-[#727A75] hover:text-[#162B22] transition-colors" 
                      title="Open in Contractor Portal"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Evidence Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-[#F5F2EB] p-3 rounded-xl border border-[#ECE7DE] text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[#727A75] uppercase block">Skill Confidence</span>
                      <span className="font-bold text-[#245E3F] flex items-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>HIGH CONFIDENCE</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-[#727A75] uppercase block">Audit Proof</span>
                      <span className="font-semibold text-[#141715] block mt-0.5">
                        8 records · 3 confirmations
                      </span>
                    </div>
                  </div>

                  {/* Verified Trades Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E5EFE8] text-[#162B22] border border-[#245E3F]/20 font-medium">
                      LT Power Panels
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E5EFE8] text-[#162B22] border border-[#245E3F]/20 font-medium">
                      Earth Resistance &lt; 2Ω
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#F5F2EB] text-[#484F4A] border border-[#DFD9CE]">
                      3-Phase Motor Rewind
                    </span>
                  </div>

                  {/* Card Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#ECE7DE] text-xs font-semibold text-[#162B22]">
                    <span className="group-hover:underline">View Passport & Evidence Audit</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Second Worker Summary Simulation */}
                <div 
                  onClick={() => navigate('/contractor')}
                  className="mt-3 bg-white/70 hover:bg-white rounded-xl p-3.5 border border-[#DFD9CE] flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#ECE7DE] flex items-center justify-center font-bold text-[#162B22]">
                      SM
                    </div>
                    <div>
                      <span className="font-bold text-[#141715] block">Suresh M.</span>
                      <span className="text-[11px] text-[#727A75]">Industrial HVAC Technician · 5 records verified</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-[#245E3F] font-bold">HIGH CONFIDENCE</span>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
