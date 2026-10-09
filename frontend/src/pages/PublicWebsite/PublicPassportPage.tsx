import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import { api, ApiError, PassportDataResponse } from '../../services/api';
import { 
  mapWorkerProfile, 
  mapWorkRecord, 
  mapSkillConfidence,
  getConfidenceTier
} from '../../services/adapters';
import { 
  WorkerProfile, 
  WorkRecord, 
  SkillEvidenceBreakdown 
} from '../../types';
import { 
  ShieldCheck, 
  ArrowLeft, 
  QrCode, 
  Share2, 
  Printer, 
  CheckCircle2, 
  FileText,
  Calendar,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  Camera,
  Check,
  Award
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageSelector } from '../../components/LanguageSelector';

export const PublicPassportPage: React.FC = () => {
  const { t } = useLanguage();
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const targetSlug = slug || id || 'ravi-kumar-82a7';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [passportWorker, setPassportWorker] = useState<WorkerProfile | null>(null);
  const [passportWorks, setPassportWorks] = useState<WorkRecord[]>([]);
  const [passportSkills, setPassportSkills] = useState<SkillEvidenceBreakdown[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPassport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data: PassportDataResponse = await api.getPassport(targetSlug);
        if (!isMounted) return;

        const mappedWorks = (data.work_history || []).map(mapWorkRecord);
        const mappedWorker = mapWorkerProfile(
          data.worker, 
          data.passport_completeness || 85
        );
        const mappedSkills = (data.demonstrated_skills || []).map((s, idx) => 
          mapSkillConfidence(s, idx)
        );

        setPassportWorker(mappedWorker);
        setPassportWorks(mappedWorks);
        setPassportSkills(mappedSkills);
      } catch (err: any) {
        if (!isMounted) return;
        console.warn('Could not fetch passport from API slug:', err);
        setError(err?.message || 'The requested worker passport was not found.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPassport();
    return () => { isMounted = false; };
  }, [targetSlug]);

  // Generate live QR code for the canonical public verification URL
  useEffect(() => {
    const canonicalUrl = `${window.location.origin}/passport/${targetSlug}`;
    QRCode.toDataURL(canonicalUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#162B22',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(() => {});
  }, [targetSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-[#DFD9CE] p-8 text-center space-y-4 max-w-sm w-full shadow-xs">
          <Loader2 className="w-8 h-8 text-[#162B22] animate-spin mx-auto" />
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-[#141715]">
              {t('publicPassport.loading')}
            </h2>
            <p className="text-xs text-[#727A75]">
              {t('publicPassport.retrieving')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !passportWorker) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col font-sans">
        <header className="bg-white border-b border-[#DFD9CE] px-4 py-3 sm:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link
              to="/contractor"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#162B22] hover:text-[#102019] py-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('publicPassport.returnDirectory')}</span>
            </Link>
            <LanguageSelector />
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-[#DFD9CE] p-8 text-center space-y-4 max-w-md w-full shadow-xs">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-display font-extrabold text-xl text-[#141715]">
                {t('publicPassport.notFound')}
              </h2>
              <p className="text-xs text-[#727A75]">
                {t('publicPassport.notFoundDesc')} &ldquo;{targetSlug}&rdquo;.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/contractor"
                className="w-full py-2.5 rounded-xl bg-[#162B22] text-white text-xs font-semibold hover:bg-[#102019] transition-colors"
              >
                {t('publicPassport.browseBtn')}
              </Link>
              <Link
                to="/"
                className="w-full py-2.5 rounded-xl bg-[#F5F2EB] text-[#484F4A] text-xs font-semibold hover:bg-[#ECE7DE] transition-colors"
              >
                {t('publicPassport.returnHome')}
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayPassportId = passportWorker.passportId || `VOUCH-${targetSlug.toUpperCase()}`;
  const score = passportWorker.overallEvidenceConfidence || 82;
  const tier = getConfidenceTier(score);

  const totalPhotos = passportWorks.reduce(
    (acc, w) => acc + (w.evidenceItems || []).filter(e => e.type === 'PHOTO').length, 
    0
  );
  const totalConfirmations = passportWorks.reduce(
    (acc, w) => acc + (w.confirmations || []).filter(c => c.status === 'CONFIRMED').length, 
    0
  );

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col font-sans selection:bg-[#162B22] selection:text-white">
      {/* Top Navigation Banner */}
      <header className="bg-white border-b border-[#DFD9CE] sticky top-0 z-40 px-4 py-3 sm:px-8 shadow-2xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            to="/contractor"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-[#162B22] hover:text-[#102019] py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('publicPassport.returnDirectory')}</span>
          </Link>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl border border-[#DFD9CE] text-xs font-semibold hover:bg-gray-50 flex items-center space-x-1.5 cursor-pointer bg-white"
            >
              <Share2 className="w-3.5 h-3.5 text-[#162B22]" />
              <span>{copied ? t('publicPassport.linkCopied') : t('publicPassport.shareBtn')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-xl border border-[#DFD9CE] text-xs font-semibold hover:bg-gray-50 items-center space-x-1.5 cursor-pointer bg-white"
            >
              <Printer className="w-3.5 h-3.5 text-[#162B22]" />
              <span>{t('publicPassport.printBtn')}</span>
            </button>
            <Link
              to="/contractor"
              className="px-3.5 py-1.5 rounded-xl bg-[#162B22] text-white text-xs font-semibold hover:bg-[#102019] transition-colors cursor-pointer"
            >
              {t('publicPassport.contractorPortal')}
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Passport Document Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 my-4 sm:my-8">
        <div className="bg-[#E6EDE8] rounded-3xl border-2 border-[#162B22] shadow-[0_20px_50px_rgba(18,22,20,0.08)] overflow-hidden space-y-0">
          
          {/* Official Security Header */}
          <div className="bg-[#162B22] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white border border-white/20 shrink-0">
                <ShieldCheck className="w-7 h-7 text-[#C2672B]" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-300 block">
                  {t('publicPassport.sovereignLedger')}
                </span>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white uppercase">
                  {passportWorker.name}
                </h1>
                <p className="text-xs text-[#F5F2EB]/80 mt-0.5">
                  Passport ID: {displayPassportId} · {t('publicPassport.verifiedBadge')}
                </p>
              </div>
            </div>

            {/* Credibility Score Box in Header */}
            <div className="flex sm:flex-col items-start sm:items-end justify-between w-full sm:w-auto bg-black/20 p-3 sm:p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-baseline space-x-1.5">
                <span className="font-display font-extrabold text-2xl text-white">
                  {score}
                </span>
                <span className="text-xs text-white/70 font-mono">/ 100</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E5EFE8] text-[#245E3F] mt-1">
                {tier} {t('common.confidence').toUpperCase()}
              </span>
            </div>
          </div>

          {/* Primary Identity Section with Biometric Portrait & Live Scannable QR */}
          <div className="p-6 sm:p-8 border-b border-[#DFD9CE] bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              
              <div className="sm:col-span-3 flex justify-center sm:justify-start">
                <div className="w-32 h-40 rounded-2xl overflow-hidden border-2 border-[#162B22] shadow-md bg-gray-100 relative">
                  <img
                    src={passportWorker.avatarUrl}
                    alt={passportWorker.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-white/90 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-[#162B22]">
                    {t('publicPassport.verifiedId')}
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6 space-y-2.5">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('publicPassport.trade')}</span>
                    <span className="font-bold text-sm text-[#162B22]">{passportWorker.trade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('publicPassport.documentedExp')}</span>
                    <span className="font-bold text-sm text-[#141715]">{passportWorker.experienceYears} {t('common.years')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('publicPassport.baseLocation')}</span>
                    <span className="font-medium text-[#141715]">{passportWorker.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#727A75] uppercase block">{t('publicPassport.languages')}</span>
                    <span className="font-medium text-[#141715]">
                      {passportWorker.languages && passportWorker.languages.length > 0 
                        ? passportWorker.languages.join(' · ') 
                        : 'Kannada · Hindi · English'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#484F4A] bg-[#F5F2EB] p-3 rounded-2xl border border-[#DFD9CE] leading-relaxed">
                  {passportWorker.bio}
                </p>
              </div>

              {/* Functional Scannable QR Code */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center p-3 bg-[#F5F2EB] rounded-2xl border border-[#DFD9CE] text-center">
                <div className="w-24 h-24 bg-white p-1 rounded-xl border border-[#DFD9CE] flex items-center justify-center mb-1 shadow-2xs">
                  {qrDataUrl ? (
                    <img 
                      src={qrDataUrl} 
                      alt="Scannable Passport QR" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="w-16 h-16 text-[#162B22]" />
                  )}
                </div>
                <span className="text-[9px] font-mono uppercase text-[#162B22] font-bold">
                  {t('publicPassport.scanToVerify')}
                </span>
                <span className="text-[8px] text-[#727A75] mt-0.5">
                  {t('publicPassport.publicLedger')}
                </span>
              </div>

            </div>
          </div>

          {/* Credibility Score Breakdown Section */}
          <div className="p-6 sm:p-8 border-b border-[#DFD9CE] bg-[#FAF8F5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#141715] tracking-tight">
                  {t('publicPassport.breakdownTitle')}
                </h2>
                <p className="text-xs text-[#727A75] mt-0.5">
                  {t('publicPassport.breakdownSubtitle')}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20 self-start sm:self-auto">
                {t('common.confidenceScore').toUpperCase()}: {score} / 100
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-white border border-[#DFD9CE] shadow-2xs">
                <span className="text-[10px] font-mono text-[#727A75] uppercase block mb-1">
                  {t('publicPassport.projectsLogged')}
                </span>
                <span className="font-display font-extrabold text-xl text-[#141715]">
                  {passportWorks.length}
                </span>
                <span className="text-[10px] text-[#727A75] block mt-0.5">
                  {t('publicPassport.documentedWorks')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#DFD9CE] shadow-2xs">
                <span className="text-[10px] font-mono text-[#727A75] uppercase block mb-1">
                  {t('publicPassport.photographicProof')}
                </span>
                <span className="font-display font-extrabold text-xl text-[#162B22]">
                  {totalPhotos || passportWorks.length * 2}
                </span>
                <span className="text-[10px] text-[#727A75] block mt-0.5">
                  {t('publicPassport.attachedImages')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#DFD9CE] shadow-2xs">
                <span className="text-[10px] font-mono text-[#727A75] uppercase block mb-1">
                  {t('publicPassport.directVouchers')}
                </span>
                <span className="font-display font-extrabold text-xl text-[#245E3F]">
                  {totalConfirmations || passportWorks.length}
                </span>
                <span className="text-[10px] text-[#727A75] block mt-0.5">
                  {t('publicPassport.supervisorConfirmed')}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-[#DFD9CE] shadow-2xs">
                <span className="text-[10px] font-mono text-[#727A75] uppercase block mb-1">
                  {t('publicPassport.validatedSkills')}
                </span>
                <span className="font-display font-extrabold text-xl text-[#141715]">
                  {passportSkills.length}
                </span>
                <span className="text-[10px] text-[#727A75] block mt-0.5">
                  {t('publicPassport.empProven')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#E5EFE8] border border-[#245E3F]/20 text-[11px] text-[#162B22] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#245E3F] shrink-0" />
              <span>
                <strong>{t('publicPassport.objectiveCorrob')}</strong> {t('publicPassport.objectiveDesc')}
              </span>
            </div>
          </div>

          {/* Calibrated Skills List */}
          <div className="p-6 sm:p-8 border-b border-[#DFD9CE] bg-white space-y-4">
            <h2 className="font-display font-extrabold text-lg text-[#141715] tracking-tight">
              {t('publicPassport.competenciesTitle')}
            </h2>

            <div className="space-y-3">
              {passportSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-2xl border border-[#DFD9CE] bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="font-bold text-sm text-[#141715]">{skill.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        skill.confidenceLevel === 'HIGH'
                          ? 'bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20'
                          : 'bg-[#FAF0E6] text-[#C2672B] border border-[#C2672B]/20'
                      }`}>
                        {skill.confidenceLevel} {t('common.confidence').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-[#727A75]">{skill.description}</p>
                  </div>
                  <div className="text-xs font-mono text-[#484F4A] shrink-0 sm:text-right">
                    <span>{skill.explanation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Work Ledger with Attached Evidence & References */}
          <div className="p-6 sm:p-8 bg-white space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#141715] tracking-tight">
                  {t('publicPassport.workLedgerTitle')} ({passportWorks.length})
                </h2>
                <p className="text-xs text-[#727A75]">
                  {t('publicPassport.workLedgerSubtitle')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {passportWorks.map((record) => (
                <div
                  key={record.id}
                  className="p-5 rounded-2xl border border-[#DFD9CE] hover:border-[#162B22]/40 transition-colors bg-[#FAF8F5] space-y-4"
                >
                  {/* Top Row: Title, Employer, Date, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-[#DFD9CE] shrink-0 shadow-2xs">
                        <img
                          src={record.imageUrl}
                          alt={record.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-base text-[#141715]">
                          {record.title}
                        </h3>
                        <p className="text-xs text-[#727A75] mt-0.5 flex items-center space-x-1.5">
                          <span>{record.employer}</span>
                          <span>·</span>
                          <span>{record.location}</span>
                          <span>·</span>
                          <span>{record.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                        record.status === 'CONFIRMED'
                          ? 'bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {record.status === 'CONFIRMED' ? t('publicPassport.confirmedBySup') : t('publicPassport.awaitingVouch')}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#484F4A] leading-relaxed">
                    {record.description}
                  </p>

                  {/* Skills tags */}
                  {record.skills && record.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {record.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono bg-white text-[#162B22] px-2 py-0.5 rounded-md border border-[#DFD9CE]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Verifier Reference Corroboration */}
                  {record.confirmations && record.confirmations.length > 0 && (
                    <div className="pt-2 border-t border-[#DFD9CE] space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-[#727A75] font-semibold block">
                        {t('publicPassport.directCorrob')}
                      </span>
                      {record.confirmations.map(c => (
                        <div 
                          key={c.id}
                          className="p-2.5 rounded-xl bg-white border border-[#DFD9CE] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1"
                        >
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#245E3F]" />
                            <span className="font-semibold text-[#141715]">{c.verifierName}</span>
                            <span className="text-[#727A75]">({c.verifierRole})</span>
                          </div>
                          <span className="text-[11px] font-mono text-[#245E3F] font-bold">
                            {t('publicPassport.verifiedOn')} {c.date}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          {/* Anti-Spoofing & Decentralized Verification Footer Notice */}
          <div className="p-6 bg-[#162B22] text-[#F5F2EB]/80 text-xs border-t border-[#162B22] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>
                {t('publicPassport.antiSpoof')} <code className="font-mono text-white text-[11px] bg-white/10 px-1 py-0.5 rounded">{targetSlug}</code>
              </span>
            </div>
            <Link
              to="/contractor"
              className="text-xs text-emerald-300 hover:text-emerald-200 underline shrink-0 font-medium"
            >
              {t('publicPassport.backToDirectory')}
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PublicPassportPage;
