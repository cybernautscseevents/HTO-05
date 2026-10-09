import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';
import { ScrollReveal } from '../../components/ScrollReveal';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { api, WorkerOnboardingPayload, WorkerProfileResponse } from '../../services/api';
import { 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Briefcase, 
  MapPin, 
  Layers, 
  Camera, 
  CheckCheck, 
  FileCheck,
  Sparkles,
  Mic,
  MicOff,
  Loader2,
  ExternalLink,
  AlertCircle,
  Plus,
  Trash2,
  Phone,
  HelpCircle,
  Languages,
  X
} from 'lucide-react';

export interface WorkExperienceItem {
  id: string;
  title: string;
  employer: string;
  role: string;
  location: string;
  description: string;
  evidenceUrl: string;
  evidenceTitle: string;
  evidenceType: string;
  evidenceDescription: string;
  verifierName: string;
  verifierRole: string;
}

export const BuildPassportPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    worker, 
    currentUser, 
    isAuthenticated, 
    activeRole, 
    setActiveRole, 
    setIsAuthenticated, 
    refreshData,
    logout,
    isLoading
  } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = (searchParams.get('email') || '').trim();

  // Redirect unauthenticated visitors to /login unless routed with an email to onboard
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !emailParam) {
      navigate('/login?redirect=/build-passport', { replace: true });
    }
  }, [isAuthenticated, isLoading, emailParam, navigate]);

  // If contractor mistakenly opens build passport, redirect to contractor portal
  useEffect(() => {
    if (!isLoading && isAuthenticated && activeRole === 'contractor') {
      navigate('/contractor', { replace: true });
    }
  }, [isAuthenticated, isLoading, activeRole, navigate]);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State - Pre-fills from authenticated currentUser or email query param
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || emailParam);
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [trade, setTrade] = useState('Electrician');
  const [experienceYears, setExperienceYears] = useState('');
  const [location, setLocation] = useState('');
  
  // Languages State
  const commonLanguages = [
    'Kannada',
    'Hindi',
    'English',
    'Tamil',
    'Telugu',
    'Malayalam',
    'Marathi',
    'Bengali',
    'Gujarati',
    'Odia',
    'Punjabi'
  ];
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguage, setCustomLanguage] = useState('');

  // Sync state if currentUser hydrates after initial mount
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name && !name) setName(currentUser.name);
      if (currentUser.email && !email) setEmail(currentUser.email);
    }
  }, [currentUser]);

  // AI Extraction State
  const [aiTextPrompt, setAiTextPrompt] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Voice Recording State using Browser SpeechRecognition
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdProfile, setCreatedProfile] = useState<WorkerProfileResponse | null>(null);

  // Validation States
  const [experienceError, setExperienceError] = useState<string | null>(null);

  const handleGoToLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isAuthenticated) {
        await logout();
      }
    } catch (err) {
      console.warn('Logout warning when navigating to login:', err);
    }
    navigate('/login');
  };
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Selected Skills - Starts Empty
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Trade-specific answers bank
  const [tradeAnswers, setTradeAnswers] = useState<Record<string, string[]>>({});

  // Multiple Work Experiences - Starts with 1 empty item
  const [workExperiences, setWorkExperiences] = useState<WorkExperienceItem[]>([
    {
      id: 'work_1',
      title: '',
      employer: '',
      role: '',
      location: '',
      description: '',
      evidenceUrl: '',
      evidenceTitle: '',
      evidenceType: 'PHOTO',
      evidenceDescription: '',
      verifierName: '',
      verifierRole: '',
    }
  ]);

  const availableTrades = [
    'Electrician',
    'Plumber',
    'Welder',
    'Carpenter',
    'Mason',
    'Solar Technician',
    'HVAC Technician',
    'Painter',
  ];

  const skillOptionsByTrade: Record<string, string[]> = {
    Electrician: [
      'Electrical Wiring',
      'Panel Installation',
      'AC Feeds & Isolators',
      'Motor Rewind & Repair',
      'Earthing & Megger Testing',
      'LT Switchgear Commissioning',
    ],
    Plumber: [
      'CPVC Line Piping',
      'Pressure Testing',
      'Sanitary Fixtures',
      'Drainage Grading',
      'Solar Water Heaters',
      'Water Pump Maintenance',
    ],
    Welder: [
      'SMAW Arc Welding',
      'MIG Welding',
      'TIG Stainless Welding',
      'Structural Steel Fabrication',
      'Pipe Joint Welding',
      'Gas Cutting',
    ],
    Carpenter: [
      'Modular Cabinetry',
      'Architectural Joinery',
      'Formwork & Shuttering',
      'Wood Polishing',
      'Power Tool Operation',
      'Hardware Fitting',
    ],
    Mason: [
      'Brick & Block Masonry',
      'Plastering & Rendering',
      'Tile & Stone Laying',
      'Concrete Pouring & Leveling',
      'Waterproofing Application',
      'Plumb & Spirit Leveling',
    ],
    'Solar Technician': [
      'PV Module Mounting',
      'Solar Inverter Wiring',
      'DC Combiner Box Setup',
      'Net Metering Integration',
      'Array Troubleshooting',
      'Battery Bank Installation',
    ],
    'HVAC Technician': [
      'Split AC Installation',
      'VRF System Servicing',
      'Refrigerant Gas Charging',
      'Ductwork Installation',
      'Compressor Diagnostics',
      'Thermostat & Control Wiring',
    ],
    Painter: [
      'Wall Putty Application',
      'Interior Emulsion Painting',
      'Exterior Weather Coating',
      'Waterproof Coating',
      'Airless Spray Application',
      'Wood & Metal Enamel Polish',
    ],
    default: [
      'Site Safety Compliance',
      'Material Handling',
      'Blueprint Reading',
      'Quality Inspection',
    ]
  };

  const tradeQuestionBank: Record<string, { id: string; question: string; options: string[] }[]> = {
    Electrician: [
      {
        id: 'elec_voltage',
        question: 'What voltage systems do you primarily work on?',
        options: ['Single-phase (230V residential)', 'Three-phase (415V commercial/industrial)', 'High tension (11kV+)']
      },
      {
        id: 'elec_tools',
        question: 'Which specialized testing equipment do you operate?',
        options: ['Megger / Insulation Tester', 'Digital Multimeter & Clamp Meter', 'Earth Resistance Tester', 'Cable Fault Locator']
      },
      {
        id: 'elec_license',
        question: 'Do you hold an electrical license or supervisor permit?',
        options: ['Wireman Permit / License', 'Electrical Supervisor Permit', 'ITI / Diploma Certificate', 'No formal permit']
      }
    ],
    Plumber: [
      {
        id: 'plumb_materials',
        question: 'Which piping systems do you work with most?',
        options: ['CPVC & UPVC pipelines', 'GI & Cast Iron pipes', 'PEX / PPR plumbing', 'Concealed copper piping']
      },
      {
        id: 'plumb_pressure',
        question: 'Do you perform hydrostatic pressure testing for leak detection?',
        options: ['Yes, using manual/hydraulic test pump', 'Visual inspection & line gravity test', 'In collaboration with senior engineer']
      },
      {
        id: 'plumb_install',
        question: 'Which installations do you specialize in?',
        options: ['Sanitary fixtures & concealed valves', 'Overhead & underground tank pumps', 'Solar water heating manifolds', 'Sewage & stormwater drainage']
      }
    ],
    Welder: [
      {
        id: 'weld_process',
        question: 'Which welding processes are you skilled in?',
        options: ['SMAW / Shielded Metal Arc (Stick)', 'MIG / GMAW (Gas Metal Arc)', 'TIG / GTAW (Gas Tungsten Arc)', 'Oxy-Acetylene Cutting & Gas Welding']
      },
      {
        id: 'weld_position',
        question: 'What welding positions are you comfortable working in?',
        options: ['Flat & Horizontal (1G, 2G)', 'Vertical & Overhead (3G, 4G)', 'Pipe all-position (5G, 6G)']
      },
      {
        id: 'weld_metals',
        question: 'Which materials do you commonly fabricate?',
        options: ['Mild Carbon Steel (MS)', 'Stainless Steel (SS 304/316)', 'Structural I-Beams & Truss sections', 'Aluminium Alloys']
      }
    ],
    Carpenter: [
      {
        id: 'carp_types',
        question: 'What is your primary carpentry specialization?',
        options: ['Modular kitchen & cabinet making', 'Door/window frames & architectural woodwork', 'Shuttering & concrete formwork', 'Hardwood furniture & polishing']
      },
      {
        id: 'carp_tools',
        question: 'Which power tools do you routinely operate?',
        options: ['Table saw & miter saw', 'Router & trimmer', 'Planer & joiner', 'Pneumatic nailer & compressor']
      },
      {
        id: 'carp_materials',
        question: 'Which sheet goods and timber do you work with?',
        options: ['BWP/BWR Plywood & Marine Ply', 'MDF / HDHMR boards', 'Teak & hardwood timber', 'Laminates & acrylic sheets']
      }
    ],
    Mason: [
      {
        id: 'mason_work',
        question: 'What types of masonry work do you execute?',
        options: ['Red brick & fly-ash brick masonry', 'AAC block & hollow concrete block masonry', 'Stone rubble masonry & boundary walls', 'Plastering & ceiling rendering']
      },
      {
        id: 'mason_mix',
        question: 'Do you supervise cement mortar and concrete mix ratios?',
        options: ['Yes (1:3, 1:4, 1:6 mortar ratios)', 'Yes, RMC pouring & vibrator compaction', 'Basic helper-assisted mixing']
      },
      {
        id: 'mason_tools',
        question: 'Which leveling and alignment tools do you use on site?',
        options: ['Spirit level & plumb bob (साहुल)', 'Water tube leveling', 'Laser level tool', 'Right-angle square (गुनिया)']
      }
    ],
    'Solar Technician': [
      {
        id: 'solar_type',
        question: 'Which solar installations have you completed?',
        options: ['Rooftop on-grid PV systems', 'Off-grid battery storage systems', 'Commercial/Industrial megawatt plants', 'Solar water pumps for agriculture']
      },
      {
        id: 'solar_inverter',
        question: 'Which inverter and balance of system (BOS) equipment do you configure?',
        options: ['String inverters & micro-inverters', 'Hybrid solar inverters', 'DC combiner boxes & surge arrestors', 'Net-metering bidirectional meters']
      },
      {
        id: 'solar_safety',
        question: 'What safety gear or roof fall protection do you utilize?',
        options: ['Full-body harness & safety lifeline', 'PV DC isolation lock-out tag-out (LOTO)', 'Standard PPE (helmet, gloves, boots)']
      }
    ],
    'HVAC Technician': [
      {
        id: 'hvac_systems',
        question: 'Which HVAC systems do you service and install?',
        options: ['Split & multi-split air conditioners', 'VRF / VRV commercial multi-systems', 'Chiller plants & cooling towers', 'Ductable packaged units']
      },
      {
        id: 'hvac_refrigerant',
        question: 'Which refrigerants do you charge and recover?',
        options: ['R-32 & R-410A eco refrigerants', 'R-134a commercial chillers', 'R-22 legacy units', 'Pressure vacuum leak testing']
      },
      {
        id: 'hvac_diagnostics',
        question: 'What diagnostic tools do you operate?',
        options: ['Digital manifold gauge set', 'Vacuum micron gauge', 'Airflow anemometer & CFM hood', 'Thermal imaging leak camera']
      }
    ],
    Painter: [
      {
        id: 'paint_surface',
        question: 'What surface prep and finishing techniques do you master?',
        options: ['Wall putty & primer sanding (smooth finish)', 'Waterproofing & damp-proofing treatment', 'Exterior weather-coat texturing', 'Wood polish (PU/melamine) & metal enamel']
      },
      {
        id: 'paint_application',
        question: 'Which application methods do you use?',
        options: ['Airless paint sprayer', 'Roller & precision cut-in brush', 'Texture trowel & patterned rollers']
      },
      {
        id: 'paint_safety',
        question: 'What access equipment do you work on for high-reach projects?',
        options: ['H-frame scaffolding', 'Suspended cradle / jhula', 'Extension ladders & mobile towers']
      }
    ]
  };

  const currentTradeSkills = skillOptionsByTrade[trade] || skillOptionsByTrade['default'];
  const currentTradeQuestions = tradeQuestionBank[trade] || [];

  // Experience Validation handler (0 to 80 numeric only)
  const handleExperienceChange = (val: string) => {
    if (val === '') {
      setExperienceYears('');
      setExperienceError(null);
      return;
    }

    if (!/^\d+$/.test(val)) {
      setExperienceError('Experience must be between 0 and 80 years.');
      return;
    }

    const num = parseInt(val, 10);
    setExperienceYears(val);

    if (num < 0 || num > 80) {
      setExperienceError('Experience must be between 0 and 80 years.');
    } else {
      setExperienceError(null);
    }
  };

  // Phone Validation handler
  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (!val.trim()) {
      setPhoneError(null);
      return;
    }
    if (!/^[\d+\s\-()]{7,18}$/.test(val.trim())) {
      setPhoneError('Please enter a valid phone number (e.g. +91 98450 71234)');
    } else {
      setPhoneError(null);
    }
  };

  // Language management
  const toggleLanguage = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleAddCustomLanguage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customLanguage.trim();
    if (clean && !selectedLanguages.includes(clean)) {
      setSelectedLanguages(prev => [...prev, clean]);
      setCustomLanguage('');
    }
  };

  // Work experience management
  const handleAddWorkExperience = () => {
    if (workExperiences.length >= 5) return;
    setWorkExperiences(prev => [
      ...prev,
      {
        id: `work_${Date.now()}`,
        title: '',
        employer: '',
        role: '',
        location: '',
        description: '',
        evidenceUrl: '',
        evidenceTitle: '',
        evidenceType: 'PHOTO',
        evidenceDescription: '',
        verifierName: '',
        verifierRole: '',
      }
    ]);
  };

  const handleRemoveWorkExperience = (id: string) => {
    if (workExperiences.length <= 1) return;
    setWorkExperiences(prev => prev.filter(w => w.id !== id));
  };

  const handleUpdateWorkExperience = (id: string, field: keyof WorkExperienceItem, value: any) => {
    setWorkExperiences(prev => prev.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  // Trade question answer toggle
  const toggleTradeAnswer = (questionId: string, option: string) => {
    setTradeAnswers(prev => {
      const existing = prev[questionId] || [];
      const updated = existing.includes(option)
        ? existing.filter(o => o !== option)
        : [...existing, option];
      return { ...prev, [questionId]: updated };
    });
  };

  // Step 1 Validation & Proceed
  const handleNextStep1 = () => {
    if (!name.trim()) {
      setFormError('Please enter your full legal name.');
      return;
    }
    if (!trade) {
      setFormError('Please select your primary profession / trade.');
      return;
    }
    if (experienceYears.trim() === '') {
      setExperienceError('Experience must be between 0 and 80 years.');
      return;
    }

    const num = parseInt(experienceYears, 10);
    if (isNaN(num) || num < 0 || num > 80 || !/^\d+$/.test(experienceYears.trim())) {
      setExperienceError('Experience must be between 0 and 80 years.');
      return;
    }

    if (phoneError) {
      return;
    }

    setFormError(null);
    setExperienceError(null);
    setStep(2);
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // AI Extraction Handler
  const handleAIExtract = async (textToExtract?: string) => {
    const text = (textToExtract || aiTextPrompt).trim();
    if (!text) return;

    setIsExtracting(true);
    setAiFeedback(null);

    try {
      const extracted = await api.extractProfile(text);
      let updatedCount = 0;

      if (extracted.occupation) {
        const matched = availableTrades.find(
          t => t.toLowerCase() === extracted.occupation!.toLowerCase()
        ) || (extracted.occupation.charAt(0).toUpperCase() + extracted.occupation.slice(1));
        setTrade(matched);
        updatedCount++;
      }

      if (extracted.experience_years_claimed !== null && extracted.experience_years_claimed !== undefined) {
        setExperienceYears(String(extracted.experience_years_claimed));
        updatedCount++;
      }

      if (extracted.location) {
        setLocation(extracted.location);
        updatedCount++;
      }

      if (extracted.languages && extracted.languages.length > 0) {
        setSelectedLanguages(prev => Array.from(new Set([...prev, ...extracted.languages])));
        updatedCount += extracted.languages.length;
      }

      if (extracted.skills && extracted.skills.length > 0) {
        const formattedSkills = extracted.skills.map(
          s => s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        );
        setSelectedSkills(prev => Array.from(new Set([...prev, ...formattedSkills])));
        updatedCount += extracted.skills.length;
      }

      setAiFeedback(`Extracted claims successfully: updated occupation, experience, location, ${extracted.languages?.length || 0} languages, and ${extracted.skills.length} skills for your review.`);
    } catch (err: any) {
      console.warn('AI Profile extraction error:', err);
      setAiFeedback('AI extraction service temporarily unavailable. You can fill the details manually below.');
    } finally {
      setIsExtracting(false);
    }
  };

  // Voice Recording Handler via Browser SpeechRecognition (reusing proven AddWork pattern)
  const handleToggleVoice = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAiFeedback('Voice input is not supported in this browser. You can type instead.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setAiFeedback('Listening...');
      };

      recognition.onresult = async (event: any) => {
        setIsRecording(false);
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript && transcript.trim()) {
          setAiTextPrompt(transcript);
          setAiFeedback(`Heard: "${transcript}". Extracting profile details...`);
          await handleAIExtract(transcript);
        } else {
          setAiFeedback('No speech detected. Please try again or type instead.');
        }
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        if (event.error === 'no-speech') {
          setAiFeedback('No speech detected. Please try again or type instead.');
        } else {
          setAiFeedback('Voice input unavailable. You can type instead.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsRecording(false);
      setAiFeedback('Voice input unavailable. You can type instead.');
    }
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const cleanEmail = (email || currentUser?.email || '').trim().toLowerCase();
      
      // Build initial_works array (up to 5 entries)
      const initialWorksPayload = workExperiences
        .filter(w => w.title.trim().length > 0)
        .map(w => ({
          title: w.title.trim(),
          employer: w.employer.trim() || undefined,
          role: w.role.trim() || undefined,
          description: w.description.trim() || undefined,
          location: w.location.trim() || location.trim() || undefined,
          imageUrl: w.evidenceUrl.trim() || undefined,
          evidence_url: w.evidenceUrl.trim() || undefined,
          evidence_title: w.evidenceTitle.trim() || undefined,
          evidence_type: w.evidenceType || 'PHOTO',
          evidence_description: w.evidenceDescription.trim() || undefined,
          skills: selectedSkills,
          verifierName: w.verifierName.trim() || undefined,
          verifierRole: w.verifierRole.trim() || undefined,
        }));

      const payload: WorkerOnboardingPayload = {
        name: (name || currentUser?.name || 'Skilled Worker').trim(),
        trade: trade.trim() || 'Electrician',
        experience_years: parseInt(experienceYears, 10) || 0,
        location: location.trim() || 'India',
        email: cleanEmail || undefined,
        phone: phone.trim() || undefined,
        skills: selectedSkills,
        languages: selectedLanguages,
        initial_work: initialWorksPayload[0] || undefined,
        initial_works: initialWorksPayload.length > 0 ? initialWorksPayload : undefined,
      };

      // Persist to backend: POST /api/workers
      const created = await api.createWorker(payload);
      setCreatedProfile(created);

      // Save active worker ID & email to localStorage so profile survives page reload
      const finalWorkerId = created.id || currentUser?.worker_id;
      if (finalWorkerId) {
        localStorage.setItem('vouch_active_worker_id', finalWorkerId);
      }
      if (cleanEmail) {
        localStorage.setItem('vouch_user_email', cleanEmail);
      }

      setIsAuthenticated(true);
      setActiveRole('worker');

      // Refresh global context from backend
      await refreshData();

      setStep(4);
    } catch (err: any) {
      console.error('Failed to create worker profile:', err);
      setSubmitError(err?.message || 'Could not save profile to the server. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#162B22] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono uppercase text-[#727A75]">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  // Do not render if unauthenticated unless arriving with an email to build passport
  if (!isAuthenticated && !emailParam) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col">
      <PublicNavbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-20 animate-page-enter">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <ScrollReveal delay={0}>
            {/* Progress Indicator */}
            <div className="mb-10">
              <div className="flex items-center justify-between text-xs font-mono text-[#727A75] mb-2">
                <span className="font-bold text-[#162B22]">PASSPORT ONBOARDING</span>
                <span>STEP {step} OF 4</span>
              </div>
              <div className="w-full h-1.5 bg-[#DFD9CE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#162B22] transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-[#E6EDE8] rounded-3xl p-6 sm:p-10 border border-[#DFD9CE] shadow-[0_20px_50px_rgba(18,22,20,0.06)]">
            
            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div>
                <div className="mb-8">
                  <span className="text-xs font-mono text-[#245E3F] font-bold uppercase tracking-wider block mb-1">
                    {t('buildPassport.badge')} · {t('buildPassport.step1')}
                  </span>
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715]">
                    {t('buildPassport.title')}
                  </h1>
                  <p className="text-sm text-[#484F4A] mt-2">
                    Enter your real trade identity. Your passport belongs to you and will accompany you across every future employer.
                  </p>
                </div>

                {/* AI / Voice Assist Box */}
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#162B22] flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C2672B]" />
                      <span>{t('buildPassport.aiAssistantTitle')}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#727A75]">HINDI / ENGLISH / HINGLISH</span>
                  </div>
                  <p className="text-xs text-[#525B54] mb-3">
                    {t('buildPassport.aiAssistantDesc')}
                  </p>
                  <div className="relative mb-3">
                    <textarea
                      rows={2}
                      value={aiTextPrompt}
                      onChange={(e) => setAiTextPrompt(e.target.value)}
                      placeholder={t('buildPassport.aiPlaceholder')}
                      className="w-full p-3 pr-12 rounded-xl border border-[#D8D2C5] bg-white text-xs text-[#121614] placeholder-[#8C938E] focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none resize-none"
                    />
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      title={isRecording ? "Stop recording" : "Use voice"}
                      className={`absolute right-2.5 top-2.5 p-2 rounded-lg transition-colors cursor-pointer ${
                        isRecording 
                          ? 'bg-red-600 text-white animate-pulse' 
                          : 'bg-[#1E3B2B] text-white hover:bg-[#14281D]'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleAIExtract()}
                      disabled={isExtracting || isRecording || !aiTextPrompt.trim()}
                      className="px-4 py-2 rounded-lg bg-[#1E3B2B] text-white text-xs font-bold hover:bg-[#14281D] disabled:opacity-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
                    >
                      {isExtracting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{t('buildPassport.extracting')}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#C2672B]" />
                          <span>{t('buildPassport.extractBtn')}</span>
                        </>
                      )}
                    </button>
                    {aiFeedback && (
                      <p className="text-xs text-[#162B22] font-medium flex-1 sm:text-right">
                        {aiFeedback}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-mono uppercase text-[#727A75] block mb-1 font-semibold">
                      {t('buildPassport.fullName')}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFormError(null);
                      }}
                      placeholder={t('signup.namePlaceholder')}
                      className="w-full p-3.5 rounded-xl border border-[#DFD9CE] text-sm font-semibold focus:border-[#162B22] focus:ring-1 focus:ring-[#162B22] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                        {t('login.email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login.emailPlaceholder')}
                        className="w-full p-3.5 rounded-xl border border-[#E5E1D8] text-sm font-semibold focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold flex items-center justify-between">
                        <span>{t('buildPassport.phone')}</span>
                        <span className="text-[10px] text-[#737A75]">SMS</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="e.g. +91 98450 71234"
                        className={`w-full p-3.5 rounded-xl border text-sm font-semibold focus:outline-none transition-colors ${
                          phoneError 
                            ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                            : 'border-[#E5E1D8] focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B]'
                        }`}
                      />
                      {phoneError && (
                        <p className="text-xs text-red-600 mt-1 font-medium">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                        {t('buildPassport.primaryTrade')}
                      </label>
                      <select
                        value={trade}
                        onChange={(e) => {
                          setTrade(e.target.value);
                          setFormError(null);
                        }}
                        className="w-full p-3.5 rounded-xl border border-[#DFD9CE] text-sm font-semibold focus:border-[#162B22] focus:ring-1 focus:ring-[#162B22] focus:outline-none bg-white text-[#141715]"
                      >
                        {availableTrades.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-mono uppercase text-[#727A75] block mb-1 font-semibold">
                        {t('buildPassport.yearsExperience')}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={experienceYears}
                        onChange={(e) => handleExperienceChange(e.target.value)}
                        placeholder="0 to 80"
                        className={`w-full p-3.5 rounded-xl border text-sm font-semibold focus:outline-none transition-colors ${
                          experienceError
                            ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-[#DFD9CE] focus:border-[#162B22] focus:ring-1 focus:ring-[#162B22]'
                        }`}
                      />
                      {experienceError && (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          {experienceError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                      {t('buildPassport.location')}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('buildPassport.locationPlaceholder')}
                      className="w-full p-3.5 rounded-xl border border-[#E5E1D8] text-sm font-semibold focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                    />
                  </div>

                  {/* Languages UI */}
                  <div>
                    <label className="text-xs font-mono uppercase text-[#737A75] block mb-2 font-semibold flex items-center justify-between">
                      <span className="flex items-center space-x-1.5">
                        <Languages className="w-3.5 h-3.5 text-[#1E3B2B]" />
                        <span>{t('buildPassport.languagesSpoken')}</span>
                      </span>
                      <span className="text-[10px] text-[#737A75]">Select all that apply</span>
                    </label>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {commonLanguages.map(lang => {
                        const isSelected = selectedLanguages.includes(lang);
                        return (
                          <button
                            type="button"
                            key={lang}
                            onClick={() => toggleLanguage(lang)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#1E3B2B] border-[#1E3B2B] text-white'
                                : 'bg-white border-[#E5E1D8] text-[#4A524D] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{lang}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomLanguage();
                          }
                        }}
                        placeholder="Add another language (e.g. Tulu, Konkani, Marwari)..."
                        className="flex-1 p-2.5 rounded-xl border border-[#E5E1D8] text-xs font-medium focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddCustomLanguage()}
                        disabled={!customLanguage.trim()}
                        className="px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E1D8] text-xs font-bold text-[#1E3B2B] hover:bg-[#E5E1D8] disabled:opacity-50 cursor-pointer"
                      >
                        Add
                      </button>
                    </div>

                    {selectedLanguages.length > 0 && (
                      <p className="text-[11px] text-[#737A75] mt-2 font-mono">
                        Active languages: <span className="font-semibold text-[#1E3B2B]">{selectedLanguages.join(', ')}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#ECE7DE] flex items-center justify-between">
                  <span className="text-xs text-[#727A75]">
                    {t('buildPassport.alreadyRegistered')}{' '}
                    <Link
                      to="/login"
                      onClick={handleGoToLogin}
                      className="text-[#162B22] font-bold underline cursor-pointer"
                    >
                      {t('buildPassport.logInLink')}
                    </Link>
                  </span>
                  <button
                    onClick={handleNextStep1}
                    className="px-7 py-3.5 rounded-xl bg-[#162B22] text-white font-bold text-sm hover:bg-[#102019] transition-colors flex items-center space-x-2 cursor-pointer shadow-sm vouch-btn"
                  >
                    <span>{t('common.next')}: {t('common.skills')}</span>
                    <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Demonstrated Skills & Trade-Specific Questions */}
            {step === 2 && (
              <div>
                <div className="mb-8">
                  <span className="text-xs font-mono text-[#059669] font-bold uppercase tracking-wider block mb-1">
                    STEP 02 · TRADE COMPETENCIES & SPECIALIZATION
                  </span>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121614]">
                    WHAT ARE YOUR CORE {trade.toUpperCase()} CAPABILITIES?
                  </h2>
                  <p className="text-sm text-[#484F4A] mt-2">
                    Select the specific skills you demonstrate on-site. You will anchor these skills with evidence in the next step.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="text-xs font-mono uppercase text-[#737A75] block mb-2 font-semibold">
                    Core Technical Skills ({trade})
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentTradeSkills.map((sk) => {
                      const isSelected = selectedSkills.includes(sk);
                      return (
                        <div
                          key={sk}
                          onClick={() => toggleSkill(sk)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#1E3B2B] bg-[#EBF6EE] ring-1 ring-[#1E3B2B]'
                              : 'border-[#E5E1D8] hover:bg-gray-50'
                          }`}
                        >
                          <span className="text-sm font-bold text-[#121614]">{sk}</span>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isSelected ? 'bg-[#1E3B2B] border-[#1E3B2B] text-white' : 'border-gray-300'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trade-Specific Onboarding Questions (Non-mandatory question bank) */}
                {currentTradeQuestions.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-[#ECE8E0] space-y-5">
                    <div>
                      <div className="flex items-center space-x-1.5 mb-1">
                        <HelpCircle className="w-4 h-4 text-[#C27A38]" />
                        <span className="text-xs font-mono uppercase text-[#1E3B2B] font-bold">
                          TRADE SPECIALIZATION QUESTIONS (OPTIONAL)
                        </span>
                      </div>
                      <p className="text-xs text-[#737A75]">
                        Help contractors understand your specialized equipment and techniques.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {currentTradeQuestions.map((q) => {
                        const selectedOptions = tradeAnswers[q.id] || [];
                        return (
                          <div key={q.id} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8]">
                            <p className="text-xs font-bold text-[#121614] mb-2.5">
                              {q.question}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {q.options.map((opt) => {
                                const isOptSelected = selectedOptions.includes(opt);
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => toggleTradeAnswer(q.id, opt)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                                      isOptSelected
                                        ? 'bg-[#1E3B2B] border-[#1E3B2B] text-white'
                                        : 'bg-white border-[#E5E1D8] text-[#4A524D] hover:bg-[#F5F2EB]'
                                    }`}
                                  >
                                    {isOptSelected ? '✓ ' : ''}{opt}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-[#ECE8E0] flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl border border-[#DFD9CE] text-xs font-bold text-[#484F4A] hover:bg-gray-50 flex items-center space-x-1 cursor-pointer vouch-btn"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={selectedSkills.length === 0}
                    className="px-7 py-3.5 rounded-xl bg-[#162B22] text-white font-bold text-sm hover:bg-[#102019] disabled:opacity-50 transition-colors flex items-center space-x-2 cursor-pointer shadow-sm vouch-btn"
                  >
                    <span>Next: Add Work Experiences</span>
                    <ArrowRight className="w-4 h-4 text-[#C27A38]" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Multiple Work Records & Supporting Evidence */}
            {step === 3 && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#059669] font-bold uppercase tracking-wider block mb-1">
                      STEP 03 · VERIFIED WORK EXPERIENCES
                    </span>
                    <span className="text-xs font-mono text-[#737A75]">
                      {workExperiences.length} of 5 ENTRIES
                    </span>
                  </div>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#121614]">
                    ATTACH YOUR COMPLETED WORK & EVIDENCE
                  </h2>
                  <p className="text-sm text-[#4A524D] mt-2">
                    Enter up to 5 real projects you have executed. You can attach photos or documents to anchor each project with verifiable empirical proof.
                  </p>
                </div>

                <div className="space-y-6">
                  {workExperiences.map((w, index) => (
                    <div 
                      key={w.id} 
                      className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E1D8] shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-[#ECE8E0]">
                        <span className="text-xs font-mono uppercase font-bold text-[#1E3B2B] flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-[#C27A38]" />
                          <span>WORK EXPERIENCE #{index + 1}</span>
                        </span>
                        {workExperiences.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveWorkExperience(w.id)}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                          Project / Work Title *
                        </label>
                        <input
                          type="text"
                          value={w.title}
                          onChange={(e) => handleUpdateWorkExperience(w.id, 'title', e.target.value)}
                          placeholder="e.g. 3BHK Conduit Wiring & Main Distribution Board"
                          className="w-full p-3.5 rounded-xl border border-[#E5E1D8] bg-white text-sm font-semibold focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                            Employer / Client / Contractor
                          </label>
                          <input
                            type="text"
                            value={w.employer}
                            onChange={(e) => handleUpdateWorkExperience(w.id, 'employer', e.target.value)}
                            placeholder="e.g. Metro Infra Contracting"
                            className="w-full p-3.5 rounded-xl border border-[#E5E1D8] bg-white text-sm font-semibold focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                            Your Role
                          </label>
                          <input
                            type="text"
                            value={w.role}
                            onChange={(e) => handleUpdateWorkExperience(w.id, 'role', e.target.value)}
                            placeholder="e.g. Lead Electrician"
                            className="w-full p-3.5 rounded-xl border border-[#E5E1D8] bg-white text-sm font-semibold focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                          Job Location
                        </label>
                        <input
                          type="text"
                          value={w.location}
                          onChange={(e) => handleUpdateWorkExperience(w.id, 'location', e.target.value)}
                          placeholder={location || "e.g. Kadri Hills, Mangaluru"}
                          className="w-full p-3.5 rounded-xl border border-[#E5E1D8] bg-white text-sm font-semibold focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                          Technical Scope of Work
                        </label>
                        <textarea
                          rows={2}
                          value={w.description}
                          onChange={(e) => handleUpdateWorkExperience(w.id, 'description', e.target.value)}
                          placeholder="Describe conduit cabling, panel connections, safety grounding, or equipment serviced..."
                          className="w-full p-3 rounded-xl border border-[#E5E1D8] bg-white text-sm font-medium focus:border-[#1E3B2B] focus:ring-1 focus:ring-[#1E3B2B] focus:outline-none resize-none"
                        />
                      </div>

                      {/* Supporting Evidence Section */}
                      <div className="pt-3 border-t border-[#ECE8E0] space-y-3">
                        <span className="text-[11px] font-mono uppercase text-[#1E3B2B] font-bold flex items-center space-x-1.5">
                          <Camera className="w-3.5 h-3.5 text-[#C27A38]" />
                          <span>SUPPORTING EVIDENCE (OPTIONAL PHOTO OR DOCUMENT)</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                              Evidence Type
                            </label>
                            <select
                              value={w.evidenceType}
                              onChange={(e) => handleUpdateWorkExperience(w.id, 'evidenceType', e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-semibold focus:border-[#1E3B2B] focus:outline-none"
                            >
                              <option value="PHOTO">Jobsite Photo</option>
                              <option value="CERTIFICATE">Completion Certificate</option>
                              <option value="DOCUMENT">Work Order / Invoice</option>
                              <option value="DECLARATION">Self Declaration</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                              Photo / Document URL
                            </label>
                            <input
                              type="url"
                              value={w.evidenceUrl}
                              onChange={(e) => handleUpdateWorkExperience(w.id, 'evidenceUrl', e.target.value)}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full p-2.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-medium focus:border-[#1E3B2B] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                            Evidence Caption / Short Description
                          </label>
                          <input
                            type="text"
                            value={w.evidenceDescription}
                            onChange={(e) => handleUpdateWorkExperience(w.id, 'evidenceDescription', e.target.value)}
                            placeholder="e.g. Sub-panel conduit cabling and color code routing"
                            className="w-full p-2.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-medium focus:border-[#1E3B2B] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Site Verifier Section */}
                      <div className="pt-3 border-t border-[#ECE8E0] space-y-3">
                        <span className="text-[11px] font-mono uppercase text-[#1E3B2B] font-bold flex items-center space-x-1.5">
                          <CheckCheck className="w-3.5 h-3.5 text-[#059669]" />
                          <span>SITE VERIFIER / VOUCHER (OPTIONAL)</span>
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                              Supervisor / Verifier Name
                            </label>
                            <input
                              type="text"
                              value={w.verifierName}
                              onChange={(e) => handleUpdateWorkExperience(w.id, 'verifierName', e.target.value)}
                              placeholder="e.g. Anil Sharma"
                              className="w-full p-2.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-medium focus:border-[#1E3B2B] focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-mono uppercase text-[#737A75] block mb-1 font-semibold">
                              Verifier Role
                            </label>
                            <input
                              type="text"
                              value={w.verifierRole}
                              onChange={(e) => handleUpdateWorkExperience(w.id, 'verifierRole', e.target.value)}
                              placeholder="e.g. Site Supervisor"
                              className="w-full p-2.5 rounded-xl border border-[#E5E1D8] bg-white text-xs font-medium focus:border-[#1E3B2B] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add another work experience button (max 5) */}
                  {workExperiences.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddWorkExperience}
                      className="w-full py-3.5 rounded-2xl border-2 border-dashed border-[#D8D2C5] text-xs font-bold text-[#1E3B2B] hover:bg-[#FAF8F5] transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-[#C27A38]" />
                      <span>+ Add Another Work Experience (Up to 5 Projects)</span>
                    </button>
                  )}
                </div>

                {submitError && (
                  <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-[#ECE7DE] flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="px-5 py-3 rounded-xl border border-[#DFD9CE] text-xs font-bold text-[#484F4A] hover:bg-gray-50 flex items-center space-x-1 cursor-pointer vouch-btn disabled:opacity-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={handleFinishOnboarding}
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl bg-[#162B22] text-white font-bold text-sm hover:bg-[#102019] transition-colors flex items-center space-x-2 cursor-pointer shadow-md vouch-btn disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating Passport Ledger...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate My Passport</span>
                        <Sparkles className="w-4 h-4 text-[#C2672B]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success Passport Generated */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E5EFE8] flex items-center justify-center text-[#245E3F] mx-auto mb-4 border border-[#245E3F]/20">
                  <ShieldCheck className="w-9 h-9" />
                </div>

                <span className="text-xs font-mono text-[#245E3F] font-bold uppercase tracking-wider block mb-1">
                  PASSPORT SUCCESSFULLY MINTED
                </span>

                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] mb-3">
                  WELCOME TO VOUCH, {(createdProfile?.name || name || 'WORKER').toUpperCase()}!
                </h2>

                <p className="text-sm text-[#4A524D] max-w-md mx-auto leading-relaxed mb-6">
                  Your professional identity and verified work history have been persisted to Firestore. Your profile survives reloads and can be independently verified across all employers.
                </p>

                {/* Passport Card Mini-Preview */}
                <div className="bg-[#F5F2EB] p-5 rounded-2xl border border-[#DFD9CE] max-w-md mx-auto mb-8 text-left shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DE] mb-3">
                    <span className="text-xs font-mono font-bold text-[#162B22]">
                      {createdProfile?.public_slug ? createdProfile.public_slug.toUpperCase() : 'VOUCH-IN-2026-8842'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F]">
                      VERIFIED HOLDER
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#141715]">{createdProfile?.name || name || 'Verified Worker'}</h3>
                  <p className="text-xs text-[#727A75]">
                    {createdProfile?.trade || trade || 'Trade'} · {(createdProfile?.experience_years ?? experienceYears ?? '0')} Years Documented {(createdProfile?.location || location) ? `· ${createdProfile?.location || location}` : ''}
                  </p>
                  <div className="mt-3 text-xs font-mono text-[#1E3B2B] bg-white p-2.5 rounded border border-[#E5E1D8] flex items-center justify-between">
                    <span>{createdProfile?.work_count || workExperiences.filter(w => w.title.trim()).length || 1} Work Record(s) Logged</span>
                    <span className="text-[10px] text-[#737A75]">Active ID: {(createdProfile?.id || 'saved').slice(0, 16)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {createdProfile?.public_slug && (
                    <Link
                      to={`/passport/${createdProfile.public_slug}`}
                      target="_blank"
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#162B22] text-[#162B22] font-bold text-sm hover:bg-[#162B22]/5 transition-colors inline-flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View Public Passport</span>
                    </Link>
                  )}
                  <button
                    onClick={() => navigate('/worker')}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#162B22] text-white font-bold text-sm hover:bg-[#102019] shadow-md inline-flex items-center justify-center space-x-2 cursor-pointer vouch-btn"
                  >
                    <span>Enter Worker Dashboard</span>
                    <ArrowRight className="w-4 h-4 text-[#C2672B]" />
                  </button>
                </div>
              </div>
            )}

          </div>
          </ScrollReveal>

        </div>
      </main>

      <PublicFooter />
    </div>
  );
};

export default BuildPassportPage;
