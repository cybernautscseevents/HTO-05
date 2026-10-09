import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Check, 
  Smartphone, 
  Paperclip, 
  CheckCheck, 
  QrCode, 
  PlusCircle, 
  FileCheck2,
  Calendar,
  Wifi,
  Signal
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface StepStory {
  num: string;
  stage: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export const HowItWorksSection: React.FC = () => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const steps: StepStory[] = [
    {
      num: '01',
      stage: t('howItWorksSec.s1Stage'),
      title: `01 — ${t('howItWorksSec.s1Stage')}`,
      tagline: t('howItWorksSec.s1Tagline'),
      description: t('howItWorksSec.s1Desc'),
      bullets: language === 'hi' ? [
        'साइट की जगह व ग्राहक / ठेकेदार का नाम',
        'विशिष्ट ट्रेड भूमिका (लीड वेल्डर, वायरमैन, फिटर)',
        'काम की मात्रा (400 मीटर कंड्यूट पाइप, 6 पैनल)',
        'साइट से सीधे समय-मुहर लगी प्रविष्टि'
      ] : [
        'Site location & project client attribution',
        'Specific trade role (Lead Welder, Wireman, Fitter)',
        'Quantitative deliverables (400m SS-316L conduit, 6 panels)',
        'Direct timestamped entry from the jobsite'
      ],
    },
    {
      num: '02',
      stage: t('howItWorksSec.s2Stage'),
      title: `02 — ${t('howItWorksSec.s2Stage')}`,
      tagline: t('howItWorksSec.s2Tagline'),
      description: t('howItWorksSec.s2Desc'),
      bullets: language === 'hi' ? [
        'साइट की फ़ोटो: वायरिंग व इंस्टॉलेशन का साफ काम',
        'मीटर रीडिंग (इन्सुलेशन व प्रेशर टेस्ट रिकॉर्ड)',
        'स्थान (जीपीएस) और तारीख की छेड़छाड़-मुक्त मुहर',
        'निरीक्षण पर्चियां और ग्राहक की हस्ताक्षर रसीद'
      ] : [
        'Jobsite installation photos showing weld root pass & clean cable dressing',
        'Calibrated meter readings (Megger insulation 1.84 Ω, Hydrostatic 42.0 Bar)',
        'GPS geotag coordinates & tamper-proof timestamps',
        'Direct physical inspection vouchers & client sign-off sheets'
      ],
    },
    {
      num: '03',
      stage: t('howItWorksSec.s3Stage'),
      title: `03 — ${t('howItWorksSec.s3Stage')}`,
      tagline: t('howItWorksSec.s3Tagline'),
      description: t('howItWorksSec.s3Desc'),
      bullets: language === 'hi' ? [
        'व्हाट्सएप/एसएमएस लिंक से बिना ऐप डाउनलोड किए पुष्टि',
        'सत्यापनकर्ता का नाम, पद और संगठन की सीधी जानकारी',
        'सुरक्षा मानकों के पालन पर सुपरवाइज़र की लिखित टिप्पणी',
        'स्थायी रूप से दर्ज फोन नंबर व पुष्टिकरण रिकॉर्ड'
      ] : [
        'Works via simple WhatsApp/SMS browser link — no verifier login needed',
        'Legal attribution of verifier role, full name, and organization',
        'Written supervisor notes confirming compliance with safety codes',
        'Cryptographic hash & verifiable phone record recorded permanently'
      ],
    },
    {
      num: '04',
      stage: t('howItWorksSec.s4Stage'),
      title: `04 — ${t('howItWorksSec.s4Stage')}`,
      tagline: t('howItWorksSec.s4Tagline'),
      description: t('howItWorksSec.s4Desc'),
      bullets: language === 'hi' ? [
        'सबूतों पर आधारित हुनर विश्वास रेटिंग (उच्च विश्वसनीयता)',
        'पहली ही मुलाकात में ठेकेदार के लिए त्वरित क्यूआर कोड',
        'आजीवन स्वामित्व: किसी पुराने ठेकेदार पर निर्भर नहीं',
        'सुरक्षित व पोर्टेबल पहचान जो हमेशा आपके साथ रहे'
      ] : [
        'Evidence-calculated skill confidence ratings (94% HIGH CONFIDENCE)',
        'Instant QR code scan for contractors on day one of a project',
        'Lifelong ownership: independent of any past employer or broker',
        'Tamper-evident, portable credential that belongs to you forever'
      ],
    },
  ];

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Track resize
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Track vertical scroll
    const handleScroll = () => {
      if (!containerRef.current || isReducedMotion || window.innerWidth < 1024) return;

      const rect = containerRef.current.getBoundingClientRect();
      const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScroll <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));

      // 4-step vertical progression threshold
      if (progress < 0.25) {
        setActiveStep(0);
      } else if (progress < 0.50) {
        setActiveStep(1);
      } else if (progress < 0.75) {
        setActiveStep(2);
      } else {
        setActiveStep(3);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReducedMotion]);

  // Click to scroll to a specific stage vertically
  const scrollToStage = (index: number) => {
    setActiveStep(index);
    if (!containerRef.current || isReducedMotion || window.innerWidth < 1024) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = scrollTop + rect.top;
    const totalScroll = containerRef.current.offsetHeight - window.innerHeight;

    const fractions = [0.06, 0.35, 0.62, 0.90];
    const targetScrollY = containerTop + fractions[index] * totalScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth',
    });
  };

  const isDesktop = windowWidth >= 1024;

  return (
    <section 
      id="how-it-works-experience"
      ref={containerRef}
      className={`relative bg-[#F5F2EB] text-[#141715] ${
        isDesktop && !isReducedMotion ? 'min-h-[400vh]' : 'py-16 sm:py-24'
      }`}
      aria-label="How Vouch Works: Vertical Storytelling"
    >
      {/* DESKTOP VIEW: STICKY TWO-COLUMN VERTICAL SCROLL STORY */}
      {isDesktop && !isReducedMotion ? (
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden py-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full h-full flex flex-col justify-between">
            
            {/* Top Stage Indicator Bar with Vertical Connecting Concept */}
            <div className="shrink-0 flex items-center justify-between pb-4 border-b border-[#DFD9CE]">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-[#245E3F]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#162B22] font-bold">
                  {t('howItWorksSec.pipelineTag')}
                </span>
              </div>

              {/* Step indicator buttons */}
              <div 
                role="tablist"
                aria-label="Pipeline stages"
                className="flex items-center space-x-2 bg-[#F5F2EB] p-1 rounded-full border border-[#DFD9CE]"
              >
                {steps.map((st, idx) => (
                  <button
                    key={st.num}
                    role="tab"
                    aria-selected={activeStep === idx}
                    onClick={() => scrollToStage(idx)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                      activeStep === idx
                        ? 'bg-[#162B22] text-white shadow-xs'
                        : 'text-[#727A75] hover:text-[#141715] hover:bg-white/60'
                    }`}
                  >
                    <span>{st.num}</span>
                    <span>{st.stage}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Stage: Two-Column Composition */}
            <div className="flex-1 grid grid-cols-12 gap-12 items-center my-auto py-4">
              
              {/* LEFT COLUMN: Prominent Smartphone Mockup with Vertical Story Transitions */}
              <div className="col-span-6 flex justify-center items-center">
                <div className="relative w-[340px] xl:w-[370px] h-[640px] xl:h-[680px] bg-[#141715] rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-[4px] border-[#2A3038] ring-1 ring-black/40 flex flex-col select-none">
                  
                  {/* Dynamic Island / Notch */}
                  <div className="w-28 h-5 bg-[#141715] rounded-full mx-auto mb-1 flex items-center justify-center space-x-2 shrink-0 z-30">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1C2024]" />
                    <div className="w-2 h-2 rounded-full bg-[#1A3828]/50" />
                  </div>

                  {/* Phone Screen Display */}
                  <div className="flex-1 bg-[#F5F2EB] rounded-[42px] overflow-hidden flex flex-col border border-black/5 relative">
                    
                    {/* iOS Status Bar */}
                    <div className="flex justify-between items-center px-6 pt-2.5 pb-1 text-[11px] font-semibold text-[#141715] shrink-0 z-20">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1.5 text-[#141715]">
                        <Signal className="w-3.5 h-3.5 fill-current" />
                        <Wifi className="w-3.5 h-3.5" />
                        <Battery className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {/* Dynamic Step Content: Smooth Vertical Transition */}
                    <div className="flex-1 relative overflow-hidden">
                      {steps.map((st, idx) => {
                        const isActive = activeStep === idx;
                        const isPrev = activeStep > idx;
                        
                        return (
                          <div
                            key={st.num}
                            className={`absolute inset-0 p-4 flex flex-col justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              isActive
                                ? 'opacity-100 translate-y-0 scale-100 z-10 pointer-events-auto'
                                : isPrev
                                  ? 'opacity-0 -translate-y-8 scale-95 z-0 pointer-events-none'
                                  : 'opacity-0 translate-y-8 scale-95 z-0 pointer-events-none'
                            }`}
                          >
                            {idx === 0 && <PhoneStepWork />}
                            {idx === 1 && <PhoneStepEvidence />}
                            {idx === 2 && <PhoneStepConfirmation />}
                            {idx === 3 && <PhoneStepPassport />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Home Indicator Bar */}
                    <div className="w-32 h-1 bg-[#141715]/25 rounded-full mx-auto my-1.5 shrink-0" />
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Step Number, Title, Short Explanation & Supporting Details */}
              <div className="col-span-6 pl-4 flex flex-col justify-center">
                <div className="relative">
                  
                  {/* Step Numeral & Stage Badge */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-4xl xl:text-5xl font-display font-black text-[#162B22]">
                      {steps[activeStep].num}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-[#E5EFE8] text-[#245E3F] font-bold border border-[#245E3F]/20">
                      STAGE {activeStep + 1} OF 04
                    </span>
                  </div>

                  {/* Stage Title */}
                  <h3 className="font-display font-extrabold text-3xl xl:text-4xl text-[#141715] tracking-tight mb-3">
                    {steps[activeStep].stage}
                  </h3>

                  {/* Primary Tagline */}
                  <p className="text-lg xl:text-xl font-bold text-[#162B22] leading-snug mb-4">
                    {steps[activeStep].tagline}
                  </p>

                  {/* Narrative Paragraph */}
                  <p className="text-sm xl:text-base text-[#484F4A] leading-relaxed mb-6">
                    {steps[activeStep].description}
                  </p>

                  {/* Supporting Specification Points */}
                  <div className="space-y-2.5 pt-4 border-t border-[#DFD9CE]">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#727A75] block">
                      VERIFICATION CRITERIA:
                    </span>
                    {steps[activeStep].bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-2.5 text-xs xl:text-sm text-[#141715]">
                        <span className="w-5 h-5 rounded-full bg-[#E5EFE8] text-[#245E3F] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                          ✓
                        </span>
                        <span className="leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Progress Bar & Step Tracker */}
            <div className="shrink-0 flex items-center justify-between pt-4 border-t border-[#DFD9CE]">
              <div className="flex items-center space-x-3 font-mono text-xs">
                <span className="font-bold text-[#162B22]">
                  STEP {steps[activeStep].num} OF 04
                </span>
                <span className="text-stone-300">/</span>
                <span className="text-[#727A75] font-semibold">
                  {steps[activeStep].stage}
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-48 xl:w-64 h-1.5 bg-[#DFD9CE] rounded-full overflow-hidden mx-4">
                <div 
                  className="h-full bg-[#162B22] transition-all duration-500 rounded-full"
                  style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
                />
              </div>

              <span className="font-mono text-xs text-[#727A75]">
                SCROLL DOWN TO ADVANCE
              </span>
            </div>

          </div>
        </div>
      ) : (
        /* MOBILE & REDUCED MOTION VIEW: CLEAN VERTICAL STORYBOARD STACK */
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <ol className="space-y-16">
            {steps.map((st, i) => (
              <li 
                key={st.num}
                className="bg-white rounded-[36px] p-6 sm:p-8 border border-[#DFD9CE] shadow-sm flex flex-col space-y-6"
              >
                {/* Header with Step Circle & Stage Name */}
                <div className="flex items-center justify-between border-b border-[#ECE7DE] pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-full bg-[#162B22] text-white font-display font-black text-sm flex items-center justify-center shadow-xs">
                      {st.num}
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-xl text-[#141715]">
                        {st.stage}
                      </h3>
                      <p className="text-xs font-semibold text-[#162B22]">
                        {st.tagline}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold bg-[#E5EFE8] text-[#245E3F] px-2.5 py-1 rounded-full border border-[#245E3F]/20">
                    STAGE {i + 1}
                  </span>
                </div>

                {/* Smartphone Mockup */}
                <div className="flex justify-center my-2">
                  <div className="w-[300px] sm:w-[330px] h-[580px] bg-[#141715] rounded-[44px] p-2.5 shadow-xl border-[3px] border-[#2A3038] flex flex-col">
                    <div className="w-24 h-4 bg-[#141715] rounded-full mx-auto mb-1 flex items-center justify-center space-x-1 shrink-0" />
                    <div className="flex-1 bg-[#F5F2EB] rounded-[34px] overflow-hidden p-3.5 flex flex-col justify-between border border-black/5">
                      {i === 0 && <PhoneStepWork />}
                      {i === 1 && <PhoneStepEvidence />}
                      {i === 2 && <PhoneStepConfirmation />}
                      {i === 3 && <PhoneStepPassport />}
                    </div>
                    <div className="w-28 h-1 bg-[#141715]/25 rounded-full mx-auto my-1 shrink-0" />
                  </div>
                </div>

                {/* Narrative Description & Specifications */}
                <div className="space-y-4 pt-2 border-t border-[#ECE7DE]">
                  <p className="text-sm text-[#484F4A] leading-relaxed">
                    {st.description}
                  </p>
                  <div className="space-y-2">
                    {st.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start space-x-2 text-xs text-[#141715]">
                        <Check className="w-4 h-4 text-[#245E3F] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};

/* =========================================================================
   PHONE STEP 01 — WORK
   VOUCH FIELD LOG: Worker, Trade, Project, Location, Scope, Status
========================================================================= */
const PhoneStepWork: React.FC = () => (
  <div className="h-full flex flex-col justify-between text-left space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between pb-2 border-b border-[#DFD9CE]">
      <div className="flex items-center space-x-1.5">
        <Smartphone className="w-4 h-4 text-[#162B22]" />
        <span className="text-[11px] font-mono font-bold text-[#162B22] uppercase">VOUCH FIELD LOG</span>
      </div>
      <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
        ● LOGGED
      </span>
    </div>

    {/* Worker Card */}
    <div className="bg-[#E6EDE8] p-3 rounded-2xl border border-[#DFD9CE] shadow-xs space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#141715]">Ravi Kumar</span>
        <span className="text-[10px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] px-1.5 py-0.5 rounded">
          Welder
        </span>
      </div>
      <p className="text-[11px] text-[#727A75]">Industrial TIG & High-Pressure Conduit</p>
    </div>

    {/* Project Record Details */}
    <div className="bg-[#E6EDE8] p-3.5 rounded-2xl border border-[#DFD9CE] space-y-2.5 shadow-xs flex-1">
      <div>
        <span className="text-[10px] font-mono text-[#727A75] uppercase block">PROJECT</span>
        <span className="text-xs font-bold text-[#141715] leading-tight block">
          High-Pressure Steam Conduit Installation
        </span>
      </div>

      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-100">
        <div>
          <span className="text-[9px] font-mono text-[#727A75] block">LOCATION</span>
          <span className="font-semibold text-[#141715] flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#C2672B]" />
            Dahej, Gujarat
          </span>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono text-[#727A75] block">TIMESTAMP</span>
          <span className="font-mono text-[#727A75] text-[10px]">Today · 08:42</span>
        </div>
      </div>

      <div className="pt-1 border-t border-stone-100">
        <span className="text-[9px] font-mono text-[#727A75] block">WORK COMPLETED</span>
        <div className="bg-stone-50 p-2 rounded-lg mt-1 border border-stone-200 text-[11px] font-mono text-[#162B22] font-semibold">
          400m SS-316L conduit (Grade 316)
        </div>
      </div>
    </div>

    {/* Status Footer */}
    <div className="bg-[#E5EFE8] p-2.5 rounded-xl border border-[#245E3F]/20 flex items-center justify-between">
      <span className="text-[10px] font-mono text-[#245E3F] font-bold">
        ✓ Work record created
      </span>
      <span className="text-[10px] font-bold text-[#162B22]">
        Ready for proof →
      </span>
    </div>
  </div>
);

/* =========================================================================
   PHONE STEP 02 — EVIDENCE
   EVIDENCE ATTACHED: Site photo, Inspection record, Test reading, GPS
========================================================================= */
const PhoneStepEvidence: React.FC = () => (
  <div className="h-full flex flex-col justify-between text-left space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between pb-2 border-b border-[#DFD9CE]">
      <div className="flex items-center space-x-1.5">
        <Paperclip className="w-4 h-4 text-[#162B22]" />
        <span className="text-[11px] font-mono font-bold text-[#162B22] uppercase">EVIDENCE ATTACHED</span>
      </div>
      <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
        3 ARTIFACTS
      </span>
    </div>

    {/* Photograph Artifact Preview */}
    <div className="bg-[#E6EDE8] p-2.5 rounded-2xl border border-[#DFD9CE] shadow-xs space-y-1.5">
      <div className="flex items-center justify-between text-[10px] font-mono text-[#245E3F] font-bold">
        <span>✓ Site photograph attached</span>
        <span className="text-[#727A75]">Weld Root Pass</span>
      </div>
      <div className="h-24 bg-stone-900 rounded-xl overflow-hidden relative flex items-center justify-center border border-stone-800">
        <div className="absolute inset-0 bg-linear-to-tr from-stone-950 via-stone-800 to-stone-700 opacity-90" />
        <div className="relative text-center px-2">
          <span className="text-[10px] font-mono text-emerald-400 font-bold block">
            [ PHOTO: WELD ROOT BEAD ]
          </span>
          <span className="text-[9px] font-mono text-stone-300 block">
            SS-316L Joint #42 · Zero Porosity
          </span>
        </div>
      </div>
    </div>

    {/* Empirical Test Readings */}
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-[#E6EDE8] p-2.5 rounded-2xl border border-[#DFD9CE] shadow-xs">
        <span className="text-[9px] font-mono text-[#727A75] block">✓ TEST READING</span>
        <span className="text-sm font-mono font-black text-[#162B22] block">1.84 Ω</span>
        <span className="text-[9px] text-[#245E3F] font-bold block">Megger Insulation Pass</span>
      </div>
      <div className="bg-[#E6EDE8] p-2.5 rounded-2xl border border-[#DFD9CE] shadow-xs">
        <span className="text-[9px] font-mono text-[#727A75] block">✓ PRESSURE TEST</span>
        <span className="text-sm font-mono font-black text-[#162B22] block">42.0 Bar</span>
        <span className="text-[9px] text-[#245E3F] font-bold block">Hydrostatic 4hr Hold</span>
      </div>
    </div>

    {/* Geotag & Metadata */}
    <div className="bg-white p-2 rounded-xl border border-[#DFD9CE] space-y-0.5 text-[9px] font-mono text-[#727A75]">
      <div className="flex justify-between">
        <span>✓ Location:</span>
        <span className="text-[#141715] font-semibold">21.7051° N, 72.5932° E</span>
      </div>
      <div className="flex justify-between">
        <span>✓ Date & Time:</span>
        <span className="text-[#141715] font-semibold">14-Oct-2026 · 14:22 IST</span>
      </div>
    </div>

    {/* Status Footer */}
    <div className="bg-[#E5EFE8] p-2 rounded-xl border border-[#245E3F]/20 text-center text-[10px] font-mono text-[#245E3F] font-bold">
      ✓ Technical proof attached
    </div>
  </div>
);

/* =========================================================================
   PHONE STEP 03 — CONFIRMATION
   CONFIRM WORK: Verifier, Quote, Organization, Sign-off Button
========================================================================= */
const PhoneStepConfirmation: React.FC = () => (
  <div className="h-full flex flex-col justify-between text-left space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between pb-2 border-b border-[#DFD9CE]">
      <div className="flex items-center space-x-1.5">
        <CheckCheck className="w-4 h-4 text-[#245E3F]" />
        <span className="text-[11px] font-mono font-bold text-[#162B22] uppercase">CONFIRM WORK</span>
      </div>
      <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
        ONE-TAP LINK
      </span>
    </div>

    {/* Verifier Attribution Card */}
    <div className="bg-[#E6EDE8] p-3 rounded-2xl border border-[#DFD9CE] shadow-xs space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#141715]">Arjun Verma</span>
        <span className="text-[9px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] px-1.5 py-0.5 rounded">
          VERIFIED
        </span>
      </div>
      <p className="text-[10px] font-medium text-[#162B22]">Chief Quality Engineer</p>
      <p className="text-[10px] text-[#727A75]">Apex Infrastructure Ltd. / L&T</p>
    </div>

    {/* Review Project Card */}
    <div className="bg-[#E6EDE8] p-3.5 rounded-2xl border border-[#DFD9CE] space-y-2 shadow-xs flex-1">
      <span className="text-[10px] font-mono text-[#727A75] uppercase block">REVIEWED PROJECT</span>
      <p className="text-xs font-bold text-[#141715] leading-tight">
        High-Pressure Steam Conduit Installation
      </p>

      {/* Verifier Statement */}
      <div className="bg-[#F5F2EB] p-2.5 rounded-xl border border-[#DFD9CE] mt-1.5">
        <span className="text-[9px] font-mono uppercase text-[#727A75] block mb-1">SUPERVISOR STATEMENT:</span>
        <p className="text-[11px] text-[#141715] italic leading-snug">
          &quot;Conduit routing and live circuit test witnessed and approved adhering strictly to safety code.&quot;
        </p>
      </div>

      <div className="flex items-center justify-between text-[9px] font-mono text-[#727A75] pt-1">
        <span>✓ Verified on site</span>
        <span>Date: 14-Oct-2026</span>
      </div>
    </div>

    {/* Prominent Confirm Button */}
    <div className="bg-[#162B22] text-white p-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-sm">
      <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
      <span className="text-xs font-bold font-mono tracking-wider">
        [ CONFIRM WORK ]
      </span>
    </div>
  </div>
);

/* =========================================================================
   PHONE STEP 04 — PASSPORT
   VOUCH PROFESSIONAL PASSPORT: Ravi Kumar, Skills, Confidence, QR
========================================================================= */
const PhoneStepPassport: React.FC = () => (
  <div className="h-full flex flex-col justify-between text-left space-y-3">
    {/* Header */}
    <div className="flex items-center justify-between pb-2 border-b border-[#DFD9CE]">
      <div className="flex items-center space-x-1.5">
        <ShieldCheck className="w-4 h-4 text-[#162B22]" />
        <span className="text-[11px] font-mono font-bold text-[#162B22] uppercase">VOUCH PASSPORT</span>
      </div>
      <span className="text-[9px] font-mono font-bold text-[#C2672B]">
        VOUCH-IN-2026-8842
      </span>
    </div>

    {/* Worker Identity */}
    <div className="bg-[#E6EDE8] p-3 rounded-2xl border border-[#DFD9CE] shadow-xs space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#141715]">Ravi Kumar</span>
        <span className="text-[9px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] px-1.5 py-0.5 rounded">
          ACTIVE
        </span>
      </div>
      <p className="text-[10px] text-[#484F4A] font-medium">Welder · 7 Years Experience</p>
    </div>

    {/* Demonstrated Skills Confidence */}
    <div className="bg-[#E6EDE8] p-3.5 rounded-2xl border border-[#DFD9CE] space-y-2 shadow-xs flex-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-[#727A75] uppercase">DEMONSTRATED SKILLS</span>
        <span className="text-[10px] font-mono font-bold text-[#245E3F]">
          HIGH CONFIDENCE
        </span>
      </div>

      <div className="space-y-1.5 pt-1">
        <div>
          <div className="flex justify-between text-[10px] font-semibold text-[#141715] mb-0.5">
            <span>TIG Welding (SS-316L)</span>
            <span className="font-mono text-[#245E3F]">94%</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#245E3F] h-full w-[94%] rounded-full" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-semibold text-[#141715] mb-0.5">
            <span>High-Pressure Conduit</span>
            <span className="font-mono text-[#245E3F]">91%</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#245E3F] h-full w-[91%] rounded-full" />
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-stone-100 text-[9px] font-mono text-[#727A75] flex justify-between">
        <span>12 Work records</span>
        <span>18 Evidence</span>
        <span>5 Confirmations</span>
      </div>
    </div>

    {/* Share Passport / QR Card */}
    <div className="bg-[#162B22] text-white p-2.5 rounded-xl flex items-center justify-between shadow-xs">
      <div className="flex items-center space-x-2">
        <QrCode className="w-4 h-4 text-emerald-300" />
        <span className="text-[10px] font-mono font-bold">SHARE PASSPORT / QR</span>
      </div>
      <span className="text-[9px] font-mono bg-white/15 px-2 py-0.5 rounded text-white">
        SCAN READY
      </span>
    </div>
  </div>
);

export default HowItWorksSection;
