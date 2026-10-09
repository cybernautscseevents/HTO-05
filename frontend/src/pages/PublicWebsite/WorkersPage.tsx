import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Camera, 
  FileText, 
  QrCode, 
  CheckCheck, 
  Lock, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  Layers, 
  Check, 
  ChevronRight, 
  XCircle, 
  FileCheck,
  Info,
  BadgeCheck,
  ExternalLink
} from 'lucide-react';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';

export const WorkersPage: React.FC = () => {
  const { isAuthenticated, activeRole } = useApp();
  const { t } = useLanguage();
  const buildPassportHref = isAuthenticated && activeRole === 'worker' ? '/build-passport' : '/login?redirect=/build-passport';

  // Interactive Confirmation Simulator State for Step 03
  const [confirmedState, setConfirmedState] = useState<'pending' | 'confirmed'>('pending');
  const [activeEvidenceTab, setActiveEvidenceTab] = useState<'photo' | 'document' | 'confirmation'>('photo');

  const scrollToSamplePassport = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('sample-passport');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121614] flex flex-col selection:bg-[#1E3B2B] selection:text-white">
      <PublicNavbar />

      <main className="flex-1 pt-28 sm:pt-36 animate-page-enter">
        
        {/* ==================================================
            SECTION 1: WORKER HERO
            ================================================== */}
        <section className="py-12 sm:py-20 lg:py-24 border-b border-[#E5E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              <div className="lg:col-span-7">
                <ScrollReveal delay={0}>
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#F4EFEB] text-[#1E3B2B] text-xs font-mono font-bold uppercase mb-6 border border-[#E5E1D8]">
                    <ShieldCheck className="w-4 h-4 text-[#059669]" />
                    <span>{t('workersPage.badge', 'FOR SKILLED TRADES & CRAFTSPEOPLE')}</span>
                  </div>

                  <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#121614] tracking-tight leading-[1.04] mb-6">
                    {t('workersPage.heroTitle', 'YOUR WORK DESERVES TO BE RECOGNISED.')}
                  </h1>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                  <p className="text-lg sm:text-xl text-[#4A524D] leading-relaxed mb-8 max-w-2xl font-normal">
                    {t('workersPage.heroDesc', 'Turn your skills, experience, and completed work into a professional passport you can share with confidence. Build a permanent, evidence-backed record that stays with you across every job and city.')}
                  </p>
                </ScrollReveal>

                <ScrollReveal delay={180}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3.5 sm:space-y-0 sm:space-x-4">
                    <Link
                      to={buildPassportHref}
                      className="inline-flex items-center justify-center space-x-2 px-8 py-4 rounded-xl bg-[#1E3B2B] text-white font-semibold text-base hover:bg-[#14281D] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(30,59,43,0.18)] group vouch-btn"
                    >
                      <span>{t('workersPage.createPassport', 'Create Your Passport')}</span>
                      <ArrowRight className="w-4 h-4 text-[#C27A38] group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a
                      href="#sample-passport"
                      onClick={scrollToSamplePassport}
                      className="inline-flex items-center justify-center space-x-2 px-6 py-4 rounded-xl border border-[#E5E1D8] bg-white text-[#121614] hover:bg-[#F4EFEB] text-base font-medium transition-colors vouch-btn"
                    >
                      <span>{t('workersPage.exploreSample', 'Explore Sample Passport')}</span>
                      <ChevronRight className="w-4 h-4 text-[#737A75]" />
                    </a>
                  </div>
                </ScrollReveal>
              </div>

              {/* Documentary Worker Photography with Demo Tag */}
              <div className="lg:col-span-5">
                <ScrollReveal delay={160} variant="image">
                  <div className="relative rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-lg bg-gray-100 aspect-[4/5] reveal-image-container">
                    <img
                      src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1000&auto=format&fit=crop&q=80"
                      alt="Skilled electrical technician working on main switchboard installation"
                      className="w-full h-full object-cover filter saturate-[0.95] reveal-image-zoom"
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-[#121614]/85 text-white backdrop-blur-sm p-3 rounded-xl border border-white/10 text-xs flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                        <span className="font-mono text-[11px]">DEMONSTRATION PREVIEW</span>
                      </div>
                      <span className="text-[#D4974C] font-mono text-[11px]">ELECTRICAL TRADE</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

            </div>
          </div>
        </section>


        {/* ==================================================
            SECTION 2: WHY SKILLED WORKERS NEED VOUCH
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E5E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal delay={0}>
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-3">
                  THE IDENTITY GAP IN SKILLED TRADES
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#121614] tracking-tight leading-[1.08] mb-6">
                  STOP STARTING FROM ZERO<br />
                  <span className="text-[#1E3B2B]">ON EVERY NEW JOBSITE.</span>
                </h2>
                <p className="text-lg sm:text-xl text-[#4A524D] leading-relaxed">
                  When you switch contractors or move to a new location, your hard work shouldn&apos;t get erased. Compare how tradespeople struggle under contractor-locked verbal references versus having a permanent, worker-owned professional passport.
                </p>
              </div>
            </ScrollReveal>

            {/* Editorial Contrast — Without vs With Vouch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* Without Vouch */}
              <ScrollReveal delay={100}>
                <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-2xl border border-[#E5E1D8] relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E1D8]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#9E4545] flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-[#9E4545]" />
                      <span>THE OLD WAY · DEPENDENT ON CONTRACTORS</span>
                    </span>
                    <span className="text-xs text-[#737A75]">Fragile & Lost Over Time</span>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0F0] text-[#9E4545] flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#121614] text-base mb-1">Paper Records & Verbal Claims</h4>
                        <p className="text-sm text-[#737A75] leading-relaxed">
                          Handwritten job receipts that get lost, or saying &quot;I worked 4 years on industrial switchboards&quot; with no proof when a new contractor doesn&apos;t know you.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0F0] text-[#9E4545] flex items-center justify-center shrink-0 mt-0.5">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#121614] text-base mb-1">Scattered Phone Galleries</h4>
                        <p className="text-sm text-[#737A75] leading-relaxed">
                          Photos trapped in old phone galleries, chat backups, and deleted group threads that can never be audited or presented cleanly.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF0F0] text-[#9E4545] flex items-center justify-center shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#121614] text-base mb-1">Employer-Locked Standing</h4>
                        <p className="text-sm text-[#737A75] leading-relaxed">
                          When you leave a company or a contractor shuts down, your standing and reputation reset to zero on every new site.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* With Vouch */}
              <ScrollReveal delay={200}>
                <div className="bg-[#F4EFEB] p-8 sm:p-10 rounded-2xl border-2 border-[#1E3B2B] shadow-lg relative overflow-hidden h-full">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E5E1D8]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E3B2B] flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>THE VOUCH WAY · WORKER-OWNED</span>
                    </span>
                    <span className="text-xs font-bold text-[#1E3B2B]">Permanent & Portable</span>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-[#EAE4DC] text-[#1E3B2B] flex items-center justify-center shrink-0 mt-0.5">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#121614] text-base mb-1">Structured Work Records</h4>
                        <p className="text-sm text-[#4A524D] leading-relaxed">
                          Every project, trade skill, and technical responsibility logged into an audit-ready, chronological history.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-[#EAE4DC] text-[#1E3B2B] flex items-center justify-center shrink-0 mt-0.5">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#121614] text-base mb-1">Photographic & Test Evidence</h4>
                        <p className="text-sm text-[#4A524D] leading-relaxed">
                          Real jobsite photos, test certificates, and handover sheets bound directly to demonstrated skills.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 rounded-lg bg-[#EAE4DC] text-[#1E3B2B] flex items-center justify-center shrink-0 mt-0.5">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#121614] text-base mb-1">Portable Professional Passport</h4>
                        <p className="text-sm text-[#4A524D] leading-relaxed">
                          One clean, shareable passport URL and QR code that you own permanently to prove your track record anywhere.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </section>


        {/* ==================================================
            SECTION 3: HOW WORKERS RECORD THEIR EXPERIENCE
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E5E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-5">
                <ScrollReveal delay={0}>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-3">
                    STEP 01 · RECORD WORK
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#121614] tracking-tight leading-[1.08] mb-6">
                    LOG YOUR WORK<br />
                    <span className="text-[#1E3B2B]">IN UNDER 2 MINUTES.</span>
                  </h2>
                  <p className="text-lg text-[#4A524D] leading-relaxed mb-6">
                    Log the real projects you&apos;ve completed. Whether it was a commercial panel retrofit, plumbing run, or site installation, every job builds permanent equity in your personal passport.
                  </p>
                  <div className="space-y-3 font-medium text-sm text-[#121614]">
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>Takes less than 2 minutes directly from your phone</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>Works with past projects or today&apos;s active site</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <span>Structures rough site details into standardized trade skills</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Visual Work-Record Composition */}
              <div className="lg:col-span-7">
                <ScrollReveal delay={120}>
                  <div className="bg-[#F4EFEB] rounded-2xl border-2 border-[#1E3B2B] shadow-xl p-6 sm:p-8 relative">
                    
                    {/* Record Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-[#E5E1D8] gap-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#1E3B2B] bg-[#EAE4DC] px-2.5 py-1 rounded">
                          SAMPLE WORK RECORD
                        </span>
                        <h3 className="font-display font-extrabold text-2xl text-[#121614] mt-2">
                          COMMERCIAL PANEL INSTALLATION
                        </h3>
                        <div className="flex items-center space-x-3 text-xs text-[#737A75] mt-1 font-mono">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Mangaluru</span>
                          </span>
                          <span>·</span>
                          <span>September 2026</span>
                        </div>
                      </div>
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#E5EFE8] text-[#1E3B2B] text-xs font-mono font-bold border border-[#059669]/30">
                        <Check className="w-3.5 h-3.5 text-[#059669]" />
                        <span>CONFIRMED RECORD</span>
                      </div>
                    </div>

                    {/* Scope & Quantity */}
                    <div className="py-5 border-b border-[#E5E1D8]">
                      <span className="text-xs font-mono uppercase text-[#737A75] block mb-1">SCOPE OF WORK</span>
                      <p className="text-base text-[#121614] font-medium">
                        6 electrical panels installed with 415V three-phase busbars, surge protection devices, and load balancing across 3 commercial floors.
                      </p>
                    </div>

                    {/* Associated Skills */}
                    <div className="py-5 border-b border-[#E5E1D8]">
                      <span className="text-xs font-mono uppercase text-[#737A75] block mb-2">DEMONSTRATED SKILLS</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E1D8] text-xs font-bold text-[#121614] flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Panel Installation</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E1D8] text-xs font-bold text-[#121614] flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#059669]" />
                          <span>Electrical Wiring</span>
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E1D8] text-xs font-bold text-[#121614]">
                          Load Balancing
                        </span>
                      </div>
                    </div>

                    {/* Attached Evidence & Confirmation Footprint */}
                    <div className="pt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-white border border-[#E5E1D8]">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#121614] mb-1">
                          <Camera className="w-4 h-4 text-[#1E3B2B]" />
                          <span>ATTACHED EVIDENCE</span>
                        </div>
                        <p className="text-xs text-[#737A75] font-mono">
                          4 photos · 1 test document (Megger Test)
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#E5EFE8] border border-[#059669]/20">
                        <div className="flex items-center space-x-2 text-xs font-bold text-[#1E3B2B] mb-1">
                          <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                          <span>CONFIRMED BY</span>
                        </div>
                        <p className="text-xs text-[#1E3B2B] font-medium">
                          ABC Electricals · Site Supervisor ✓
                        </p>
                      </div>
                    </div>

                  </div>
                </ScrollReveal>
              </div>

            </div>

          </div>
        </section>


        {/* ==================================================
            SECTION 4: HOW WORKERS COLLECT EVIDENCE
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E5E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal delay={0}>
              <div className="max-w-3xl mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-3">
                  STEP 02 · ATTACH EVIDENCE & EXPLAINABLE CONFIDENCE
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#121614] tracking-tight leading-[1.08] mb-6">
                  ATTACH REAL ON-SITE PROOF.<br />
                  <span className="text-[#1E3B2B]">LET YOUR CRAFT SPEAK.</span>
                </h2>
                <p className="text-lg sm:text-xl text-[#4A524D] leading-relaxed">
                  Contractors hire on verified proof, not empty claims. Attach jobsite photos, calibrated test readouts, and commissioning certificates directly to your skills.
                </p>
              </div>
            </ScrollReveal>

            {/* Visual Evidence Composition */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Evidence Media & Artifacts Showcase */}
              <div className="lg:col-span-7">
                <ScrollReveal delay={100}>
                  <div className="bg-[#F4EFEB] p-6 sm:p-8 rounded-2xl border border-[#E5E1D8] shadow-sm">
                    
                    {/* Evidence Category Selector */}
                    <div className="flex items-center space-x-2 pb-5 border-b border-[#E5E1D8] mb-6 overflow-x-auto">
                      <button
                        onClick={() => setActiveEvidenceTab('photo')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                          activeEvidenceTab === 'photo'
                            ? 'bg-[#1E3B2B] text-white'
                            : 'bg-white text-[#4A524D] hover:text-[#121614] border border-[#E5E1D8]'
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Jobsite Photo</span>
                      </button>
                      <button
                        onClick={() => setActiveEvidenceTab('document')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                          activeEvidenceTab === 'document'
                            ? 'bg-[#1E3B2B] text-white'
                            : 'bg-white text-[#4A524D] hover:text-[#121614] border border-[#E5E1D8]'
                        }`}
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Megger Test Certificate</span>
                      </button>
                      <button
                        onClick={() => setActiveEvidenceTab('confirmation')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
                          activeEvidenceTab === 'confirmation'
                            ? 'bg-[#1E3B2B] text-white'
                            : 'bg-white text-[#4A524D] hover:text-[#121614] border border-[#E5E1D8]'
                        }`}
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Supervisor Sign-Off</span>
                      </button>
                    </div>

                    {/* Active Evidence Display */}
                    {activeEvidenceTab === 'photo' && (
                      <div className="space-y-4">
                        <div className="rounded-xl overflow-hidden border border-[#E5E1D8] aspect-video relative bg-black/5">
                          <img
                            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
                            alt="Clean conduit routing and panel busbars"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 bg-[#121614]/85 text-white text-[11px] font-mono px-3 py-1 rounded backdrop-blur-xs">
                            Sample Item #01 · Main 415V LT Distribution Assembly
                          </div>
                        </div>
                        <p className="text-xs text-[#4A524D]">
                          High-resolution visual proof of conduit layout, color-coded phase wiring, and torque-sealed lugs.
                        </p>
                      </div>
                    )}

                    {activeEvidenceTab === 'document' && (
                      <div className="space-y-4">
                        <div className="p-6 rounded-xl bg-white border border-[#E5E1D8] font-mono text-xs">
                          <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-3 mb-3">
                            <span className="font-bold text-[#121614]">INSULATION RESISTANCE TEST REPORT</span>
                            <span className="text-[#059669] font-bold">PASSED (&lt; 0.85 MΩ)</span>
                          </div>
                          <div className="space-y-2 text-[#4A524D]">
                            <p>Project: Commercial Hub · Floor 2 & 3</p>
                            <p>Instrument: Fluke 1507 Calibrated Megohmmeter</p>
                            <p>Phase R-Y-B to Earth: 1.2 GΩ · Insulation Integrity 100%</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#4A524D]">
                          Technical documents and test certificates replace subjective claims with verifiable engineering proof.
                        </p>
                      </div>
                    )}

                    {activeEvidenceTab === 'confirmation' && (
                      <div className="space-y-4">
                        <div className="p-6 rounded-xl bg-[#E5EFE8] border border-[#059669]/20">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-[#1E3B2B] text-white flex items-center justify-center font-bold text-xs">
                              AE
                            </div>
                            <div>
                              <h4 className="font-bold text-[#121614] text-sm">ABC Electricals Pvt Ltd</h4>
                              <p className="text-xs text-[#1E3B2B] font-mono font-medium">Site Supervisor Confirmation ✓</p>
                            </div>
                          </div>
                          <p className="text-xs text-[#1E3B2B] italic">
                            &quot;Worker executed the complete commercial panel assembly and passed full load commissioning on schedule.&quot;
                          </p>
                        </div>
                        <p className="text-xs text-[#4A524D]">
                          Independent confirmation logged with supervisor name, organization, and timestamp.
                        </p>
                      </div>
                    )}

                  </div>
                </ScrollReveal>
              </div>

              {/* Explainable Skill Confidence Card (No Generic %) */}
              <div className="lg:col-span-5">
                <ScrollReveal delay={200}>
                  <div className="bg-[#F4EFEB] p-6 sm:p-8 rounded-2xl border-2 border-[#1E3B2B] shadow-lg">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#737A75] block mb-2">
                      SKILL ASSOCIATION & CONFIDENCE
                    </span>

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-extrabold text-2xl text-[#121614]">
                        Electrical Wiring
                      </h3>
                      <span className="px-3 py-1 rounded bg-[#E5EFE8] text-[#1E3B2B] font-mono text-xs font-bold border border-[#059669]/30">
                        HIGH CONFIDENCE
                      </span>
                    </div>

                    <p className="text-xs text-[#737A75] leading-relaxed mb-6">
                      Confidence on Vouch is strictly calculated from verified work volume and third-party confirmations — never arbitrary star ratings.
                    </p>

                    <div className="space-y-3 font-mono text-xs bg-white p-4 rounded-xl border border-[#E5E1D8]">
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]">
                        <span className="text-[#4A524D]">Work Records:</span>
                        <span className="font-bold text-[#121614]">8 logged records</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-[#E5E1D8]">
                        <span className="text-[#4A524D]">Evidence Items:</span>
                        <span className="font-bold text-[#121614]">12 photos & documents</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#4A524D]">Confirmations:</span>
                        <span className="font-bold text-[#059669]">3 supervisor sign-offs</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E5E1D8] text-xs text-[#4A524D] flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>Evidence confidence is fully explainable and auditable by hirers.</span>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

            </div>

          </div>
        </section>


        {/* ==================================================
            SECTION 5: HOW CONFIRMATIONS WORK
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E5E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6">
                <ScrollReveal delay={0}>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-3">
                    STEP 03 · ZERO-FRICTION CONFIRMATIONS
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#121614] tracking-tight leading-[1.08] mb-6">
                    ONE-TAP SUPERVISOR CONFIRMATIONS.<br />
                    <span className="text-[#1E3B2B]">ZERO HASSLE FOR YOUR CLIENTS.</span>
                  </h2>
                  <p className="text-lg text-[#4A524D] leading-relaxed mb-6">
                    Ask a supervisor, site engineer, or contractor to confirm the work you completed. They don&apos;t need to download an app, register, or fill out paperwork — a single tap via secure link verifies your record permanently.
                  </p>
                  <div className="p-4 rounded-xl bg-[#F4EFEB] border border-[#E5E1D8] text-xs text-[#4A524D] flex items-start space-x-3">
                    <Lock className="w-4 h-4 text-[#1E3B2B] shrink-0 mt-0.5" />
                    <span>
                      Confirmations are cryptographically signed, tamper-proof, and linked permanently to your Vouch passport.
                    </span>
                  </div>
                </ScrollReveal>
              </div>

              {/* Interactive Simple Confirmation Flow Simulator */}
              <div className="lg:col-span-6">
                <ScrollReveal delay={120}>
                  <div className="bg-[#F4EFEB] rounded-2xl border-2 border-[#1E3B2B] shadow-xl p-6 sm:p-8">
                    <div className="flex items-center justify-between pb-4 border-b border-[#E5E1D8] mb-6">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E3B2B]">
                        VERIFIER CONFIRMATION SIMULATOR
                      </span>
                      <span className="text-xs text-[#737A75] font-mono">DEMO INTERACTION</span>
                    </div>

                    {confirmedState === 'pending' ? (
                      <div className="space-y-6">
                        <div className="space-y-3 bg-white p-5 rounded-xl border border-[#E5E1D8]">
                          <p className="text-sm font-medium text-[#121614]">
                            <span className="font-bold text-[#1E3B2B]">Ravi Kumar (Sample Profile)</span> performed:
                          </p>
                          <h4 className="font-display font-extrabold text-xl text-[#121614]">
                            Commercial electrical installation
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#737A75] pt-2 border-t border-[#E5E1D8]">
                            <div>
                              <span className="text-[#4A524D] block">Role:</span>
                              <span className="font-bold text-[#121614]">Electrician</span>
                            </div>
                            <div>
                              <span className="text-[#4A524D] block">Location:</span>
                              <span className="font-bold text-[#121614]">Mangaluru</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setConfirmedState('confirmed')}
                          className="w-full py-4 rounded-xl bg-[#1E3B2B] text-white font-bold text-base hover:bg-[#14281D] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-sm vouch-btn"
                        >
                          <Check className="w-5 h-5 text-[#C27A38]" />
                          <span>[ SIMULATE 1-TAP CONFIRMATION ]</span>
                        </button>
                        <p className="text-[11px] text-center text-[#737A75]">
                          Tap the button above to simulate how a supervisor confirms your record with one touch.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-[#E5EFE8] p-6 rounded-xl border-2 border-[#059669]/40 text-center">
                          <div className="w-12 h-12 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto mb-3">
                            <Check className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E3B2B] block mb-1">
                            ✓ WORK CONFIRMED (DEMO)
                          </span>
                          <h4 className="font-display font-bold text-lg text-[#121614]">
                            Confirmed by ABC Electricals
                          </h4>
                          <p className="text-xs text-[#1E3B2B] font-mono mt-1">
                            Supervisor · Signed on 14 Sept 2026
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2">
                          <span className="text-[#059669] font-bold">Evidence confidence updated to HIGH.</span>
                          <button
                            onClick={() => setConfirmedState('pending')}
                            className="text-[#737A75] hover:text-[#121614] underline font-mono"
                          >
                            Reset Demo
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </ScrollReveal>
              </div>

            </div>

          </div>
        </section>


        {/* ==================================================
            SECTION 6: SAMPLE PROFESSIONAL PASSPORT (MAIN FOCUS)
            ================================================== */}
        <section id="sample-passport" className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E5E1D8] scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal delay={0}>
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-3">
                  STEP 04 · SAMPLE PROFESSIONAL PASSPORT
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#121614] tracking-tight leading-[1.08] mb-4">
                  THE VOUCH PROFESSIONAL PASSPORT.
                </h2>
                <p className="text-lg text-[#4A524D] leading-relaxed">
                  Your Vouch Passport unites your verified projects, on-site test evidence, and supervisor sign-offs into one portable credential that you can present to employers.
                </p>
              </div>
            </ScrollReveal>

            {/* Clear Sample Demonstration Notice Banner */}
            <ScrollReveal delay={60}>
              <div className="mb-6 p-4 rounded-2xl bg-[#F4EFEB] border border-[#E5E1D8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2.5 text-[#1E3B2B]">
                  <Info className="w-4 h-4 text-[#C27A38] shrink-0" />
                  <span className="font-mono font-bold uppercase tracking-wider">
                    SAMPLE PASSPORT · DEMONSTRATION DATA
                  </span>
                </div>
                <p className="text-[#737A75] sm:text-right">
                  This example illustrates how a VOUCH Professional Passport looks. Information shown is fictional.
                </p>
              </div>
            </ScrollReveal>

            {/* Refined Vouch Professional Passport Card */}
            <ScrollReveal delay={120} variant="passport">
              <div className="bg-white rounded-3xl border-2 border-[#1E3B2B] shadow-[0_20px_50px_rgba(18,22,20,0.08)] p-6 sm:p-10 relative overflow-hidden">
                
                {/* Background Security Watermark Pattern */}
                <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-[0.03]">
                  <ShieldCheck className="w-96 h-96 text-[#1E3B2B]" />
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-[#E5E1D8] gap-6 relative z-10">
                  <div className="flex items-center space-x-5">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#1E3B2B] shadow-sm shrink-0 relative bg-[#F4EFEB]">
                      <img
                        src="https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=300&auto=format&fit=crop&q=80"
                        alt="Demonstration worker portrait"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-[#121614]/80 text-[8px] font-mono text-center text-white py-0.5 uppercase tracking-wider">
                        Sample
                      </div>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded bg-[#1E3B2B] text-white text-[10px] font-mono uppercase tracking-wider font-bold">
                          SAMPLE PASSPORT
                        </span>
                        <span className="text-xs font-mono text-[#737A75] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E5E1D8]">
                          SAMPLE ID: VOUCH-DEMO-8821
                        </span>
                      </div>
                      <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121614]">
                        RAVI KUMAR
                      </h3>
                      <p className="text-sm text-[#4A524D] font-medium">
                        Electrician · 7 years trade experience · Mangaluru
                      </p>
                    </div>
                  </div>

                  {/* Demo Card Action Button */}
                  <div className="flex flex-col sm:items-end space-y-2 w-full sm:w-auto">
                    <Link
                      to={buildPassportHref}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1E3B2B] text-white font-bold text-xs hover:bg-[#14281D] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 shadow-sm vouch-btn"
                    >
                      <span>CREATE YOUR OWN PASSPORT</span>
                      <ArrowRight className="w-4 h-4 text-[#C27A38]" />
                    </Link>
                    <span className="text-[11px] text-[#737A75] font-mono text-center sm:text-right">
                      * Demo preview only · Sign up to share your passport
                    </span>
                  </div>
                </div>

                {/* Passport Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-[#E5E1D8] relative z-10">
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                    <span className="text-[10px] font-mono uppercase text-[#737A75] block mb-1">WORK HISTORY</span>
                    <div className="font-display font-extrabold text-2xl text-[#121614]">12</div>
                    <span className="text-xs text-[#4A524D]">work records</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                    <span className="text-[10px] font-mono uppercase text-[#737A75] block mb-1">EVIDENCE</span>
                    <div className="font-display font-extrabold text-2xl text-[#121614]">18</div>
                    <span className="text-xs text-[#4A524D]">photos & test files</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                    <span className="text-[10px] font-mono uppercase text-[#737A75] block mb-1">CONFIRMATIONS</span>
                    <div className="font-display font-extrabold text-2xl text-[#059669]">8</div>
                    <span className="text-xs text-[#059669] font-medium">supervisor sign-offs</span>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8]">
                    <span className="text-[10px] font-mono uppercase text-[#737A75] block mb-1">EXPERIENCE</span>
                    <div className="font-display font-extrabold text-2xl text-[#121614]">7 yrs</div>
                    <span className="text-xs text-[#4A524D]">verified trade time</span>
                  </div>
                </div>

                {/* Demonstrated Skills Breakdown */}
                <div className="pt-8 space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#737A75] font-bold block">
                      DEMONSTRATED SKILLS & EVIDENCE CONFIDENCE
                    </span>
                    <span className="text-[11px] font-mono text-[#737A75]">
                      ILLUSTRATIVE DEMO STATUSES
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-[#121614] text-sm">Electrical Wiring</h4>
                        <span className="text-[10px] font-mono font-bold bg-[#E5EFE8] text-[#1E3B2B] px-2 py-0.5 rounded border border-[#059669]/30">
                          HIGH CONFIDENCE
                        </span>
                      </div>
                      <p className="text-xs text-[#737A75]">
                        8 records · 12 photos · 3 confirmations
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-[#121614] text-sm">Panel Installation</h4>
                        <span className="text-[10px] font-mono font-bold bg-[#E5EFE8] text-[#1E3B2B] px-2 py-0.5 rounded border border-[#059669]/30">
                          HIGH CONFIDENCE
                        </span>
                      </div>
                      <p className="text-xs text-[#737A75]">
                        6 records · 10 photos · 3 confirmations
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-[#121614] text-sm">Troubleshooting</h4>
                        <span className="text-[10px] font-mono font-bold bg-[#F4EFEB] text-[#C27A38] px-2 py-0.5 rounded border border-[#E5E1D8]">
                          BUILDING EVIDENCE
                        </span>
                      </div>
                      <p className="text-xs text-[#737A75]">
                        2 records · 3 photos · 1 confirmation
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </section>


        {/* ==================================================
            SECTION 7: PORTABILITY (One Identity, Every Job)
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#E5E1D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <ScrollReveal delay={0}>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-3">
                  PORTABLE BETWEEN EMPLOYERS, PROJECTS & CITIES
                </span>
                <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[#121614] tracking-tight leading-[1.08] mb-4">
                  ONE IDENTITY.<br />
                  <span className="text-[#1E3B2B]">EVERY JOB.</span>
                </h2>
                <p className="text-lg sm:text-xl text-[#4A524D] leading-relaxed">
                  Your professional standing shouldn&apos;t reset to zero whenever a project wraps up, you shift contractors, or move to another city.
                </p>
              </div>
            </ScrollReveal>

            {/* Visual Portability Progression */}
            <ScrollReveal delay={120}>
              <div className="max-w-4xl mx-auto bg-[#F4EFEB] p-8 sm:p-12 rounded-3xl border-2 border-[#1E3B2B] shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-center">
                  
                  {/* Step 1 */}
                  <div className="p-4 rounded-xl bg-white border border-[#E5E1D8]">
                    <span className="text-[10px] font-mono font-bold text-[#737A75] block mb-1">PHASE 01</span>
                    <h4 className="font-bold text-sm text-[#121614]">Contractor 01</h4>
                    <p className="text-[11px] text-[#737A75] mt-1">Industrial Wiring</p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex justify-center text-[#1E3B2B] font-bold">
                    <ArrowRight className="w-5 h-5 text-[#C27A38]" />
                  </div>

                  {/* Center Constant: Vouch Passport */}
                  <div className="p-6 rounded-2xl bg-[#1E3B2B] text-white shadow-md border-2 border-[#C27A38]">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#C27A38] block mb-1 font-bold">
                      PERMANENT ASSET
                    </span>
                    <h3 className="font-display font-extrabold text-base text-white">
                      VOUCH PASSPORT
                    </h3>
                    <p className="text-[11px] text-[#E5E1D8] mt-1">Follows the worker everywhere</p>
                  </div>

                  {/* Arrow */}
                  <div className="hidden md:flex justify-center text-[#1E3B2B] font-bold">
                    <ArrowRight className="w-5 h-5 text-[#C27A38]" />
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-xl bg-white border border-[#E5E1D8]">
                    <span className="text-[10px] font-mono font-bold text-[#737A75] block mb-1">PHASE 02</span>
                    <h4 className="font-bold text-sm text-[#121614]">New Project / City</h4>
                    <p className="text-[11px] text-[#737A75] mt-1">Contractors 02 & 03</p>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-[#E5E1D8] text-center">
                  <p className="text-sm text-[#4A524D] max-w-xl mx-auto">
                    When you walk onto a new jobsite or meet a new hiring contractor, your 7 years of evidence and supervisor confirmations speak for you on day one.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </section>


        {/* ==================================================
            SECTION 8: FINAL WORKER CTA
            ================================================== */}
        <section className="py-20 sm:py-28 bg-[#FAF8F5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <ScrollReveal delay={0}>
              <span className="text-xs font-mono uppercase tracking-widest text-[#1E3B2B] font-bold block mb-4">
                100% FREE FOR TRADESPEOPLE
              </span>
              
              <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-[#121614] tracking-tight leading-[1.06] mb-6">
                YOUR CRAFT HAS REAL VALUE.<br />
                <span className="text-[#1E3B2B]">START YOUR WORKER PASSPORT.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <p className="text-lg sm:text-xl text-[#4A524D] leading-relaxed mb-10 max-w-2xl mx-auto">
                Join skilled electricians, plumbers, carpenters, and technicians taking ownership of their work history. It takes just 3 minutes to build your permanent passport.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to={buildPassportHref}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-9 py-4 rounded-xl bg-[#1E3B2B] text-white font-bold text-base hover:bg-[#14281D] active:scale-[0.98] transition-all shadow-md group vouch-btn"
                >
                  <span>Create Your Passport</span>
                  <ArrowRight className="w-4 h-4 text-[#C27A38] group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-4 rounded-xl border border-[#E5E1D8] bg-white text-[#121614] hover:bg-[#F4EFEB] text-base font-medium transition-colors vouch-btn"
                >
                  <span>How Vouch Works</span>
                  <ChevronRight className="w-4 h-4 text-[#737A75]" />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
};

export default WorkersPage;
