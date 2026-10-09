import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, ApiError, VerificationDetailsResponse, ConfirmationStatus } from '../services/api';
import { 
  ShieldCheck, 
  Check, 
  X, 
  HelpCircle, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  MapPin, 
  Briefcase, 
  FileText,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';

export const PublicVerifierPage: React.FC = () => {
  const { t } = useLanguage();
  const { token } = useParams<{ token: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<VerificationDetailsResponse | null>(null);

  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionResult, setDecisionResult] = useState<{
    success: boolean;
    decision: ConfirmationStatus;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Verification token is missing.');
      setIsLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getConfirmation(token);
        setDetails(res);
      } catch (err: any) {
        console.error('Failed to fetch verification details:', err);
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Invalid or expired verification request.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [token]);

  const handleDecision = async (decision: ConfirmationStatus) => {
    if (!token) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.submitConfirmation(token, decision, notes);
      setDecisionResult(res);
      if (details) {
        setDetails({
          ...details,
          status: decision,
        });
      }
    } catch (err: any) {
      console.error('Failed to submit decision:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to record your verification decision.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] text-[#141715] flex flex-col font-sans selection:bg-[#162B22] selection:text-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-[#DFD9CE] sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#162B22] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#F5F2EB]" strokeWidth={2.2} />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#141715]">
              VOUCH
            </span>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase font-bold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-full border border-emerald-300/60">
              {t('verifier.independentVerification')}
            </span>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 my-4 sm:my-8 flex flex-col justify-center">
        {/* 1. Loading State */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-[#DFD9CE] p-8 text-center space-y-4 shadow-xs">
            <Loader2 className="w-8 h-8 text-[#162B22] animate-spin mx-auto" />
            <div className="space-y-1">
              <h2 className="font-display font-bold text-lg text-[#141715]">
                {t('verifier.loading')}
              </h2>
              <p className="text-xs text-[#727A75]">
                {t('verifier.retrieving')}
              </p>
            </div>
          </div>
        )}

        {/* 2. Error State */}
        {!isLoading && error && !details && (
          <div className="bg-white rounded-3xl border border-[#DFD9CE] p-8 text-center space-y-5 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h2 className="font-display font-bold text-xl text-[#141715]">
                {t('verifier.invalidLink')}
              </h2>
              <p className="text-xs text-[#727A75]">
                {error || t('verifier.invalidDesc')}
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-[#162B22] text-white rounded-xl text-xs font-semibold hover:bg-[#102019]"
            >
              <span>{t('verifier.returnHome')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* 3. Decision Success Banner */}
        {!isLoading && decisionResult && (
          <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-8 text-center space-y-5 shadow-sm animate-in fade-in">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
              decisionResult.decision === 'CONFIRMED'
                ? 'bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/30'
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {decisionResult.decision === 'CONFIRMED' ? (
                <Check className="w-8 h-8" />
              ) : (
                <X className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-2">
              <h2 className="font-display font-bold text-2xl text-[#141715]">
                {decisionResult.decision === 'CONFIRMED'
                  ? t('verifier.confirmedSuccess')
                  : t('verifier.flagged')}
              </h2>
              <p className="text-xs text-[#484F4A] max-w-md mx-auto">
                {decisionResult.message} {t('verifier.permanentRecord')}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#162B22] text-white rounded-xl text-xs font-bold hover:bg-[#102019] shadow-xs cursor-pointer"
              >
                <span>{t('verifier.learnMore')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 4. Active Review & Decision Screen */}
        {!isLoading && details && !decisionResult && (
          <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] shadow-sm overflow-hidden flex flex-col">
            {/* Top Bar */}
            <div className="bg-[#141715] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-[#C2672B]" />
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-300 block">
                    {t('verifier.confirmRequest')}
                  </span>
                  <h3 className="text-sm font-bold">{t('verifier.independentWork')}</h3>
                </div>
              </div>
              <span className="text-[11px] font-mono text-white/70">
                {details.verifier_type}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Question Banner */}
              <div className="p-4 bg-[#E5EFE8] rounded-2xl border border-[#245E3F]/30">
                <p className="text-[10px] font-bold text-[#162B22] uppercase tracking-wider mb-1">
                  {t('verifier.recipient')} {details.verifier_name}
                </p>
                <h4 className="text-base font-bold text-[#141715]">
                  {t('verifier.didPerform')}
                </h4>
                <p className="text-[11px] text-gray-600 mt-1">
                  {t('verifier.confirmElevates')}
                </p>
              </div>

              {/* Work Details Summary Card */}
              <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-[#DFD9CE] space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#727A75] block">
                    {t('verifier.docProject')}
                  </span>
                  <h3 className="text-base font-extrabold text-[#141715]">
                    {details.work.title}
                  </h3>
                  {details.work.description && (
                    <p className="text-xs text-[#484F4A] pt-0.5">
                      {details.work.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#DFD9CE] text-[11px]">
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{details.work.date}</span>
                  </div>
                  {details.work.location && (
                    <div className="flex items-center space-x-1.5 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{details.work.location}</span>
                    </div>
                  )}
                  {details.work.quantity ? (
                    <div className="flex items-center space-x-1.5 text-gray-600">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      <span>{details.work.quantity} {details.work.quantity_unit || 'units'}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center space-x-1.5 text-gray-600">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <span>{details.work.evidence_count} {t('verifier.attachedItems')}</span>
                  </div>
                </div>

                {/* Skills Claimed */}
                {details.work.skills && details.work.skills.length > 0 && (
                  <div className="pt-2 border-t border-[#DFD9CE]">
                    <span className="text-[10px] font-bold text-[#727A75] block mb-1 uppercase tracking-wider">
                      {t('verifier.skillsSupported')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {details.work.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-white border border-[#DFD9CE] text-[#162B22] font-bold text-[11px]"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Already Decided Banner */}
              {details.status !== 'PENDING' ? (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl text-center space-y-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    details.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}>
                    {t('verifier.status')} {details.status}
                  </span>
                  <p className="text-xs text-gray-600">
                    {t('verifier.alreadyRecorded')}
                  </p>
                </div>
              ) : (
                /* Decision Form */
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      {t('verifier.commentLabel')}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder={t('verifier.commentPlaceholder')}
                      className="w-full text-xs p-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#162B22]"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleDecision('CONFIRMED')}
                      disabled={isSubmitting}
                      className="w-full py-3 bg-[#162B22] hover:bg-[#102019] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all active:translate-y-[1px] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t('verifier.submittingDecision')}</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>{t('verifier.approveBtn')}</span>
                        </>
                      )}
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleDecision('REJECTED')}
                        disabled={isSubmitting}
                        className="py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-semibold text-xs border border-red-200 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>{t('verifier.reject')}</span>
                      </button>
                      <button
                        onClick={() => handleDecision('NOT_SURE')}
                        disabled={isSubmitting}
                        className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-50"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>{t('verifier.notSure')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublicVerifierPage;
