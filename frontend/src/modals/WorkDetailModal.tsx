import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api, ApiError, EvidenceType } from '../services/api';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Briefcase, 
  FileText, 
  Image as ImageIcon,
  Clock,
  Plus,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  Copy
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const WorkDetailModal: React.FC = () => {
  const { t } = useLanguage();
  const { 
    selectedWorkRecord, 
    setSelectedWorkRecord, 
    setActiveVerifierRecord, 
    setIsVerifierModalOpen,
    refreshData,
    workRecords 
  } = useApp();

  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('PHOTO');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceDesc, setEvidenceDesc] = useState('');
  const [isSubmittingEvidence, setIsSubmittingEvidence] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  const [isRequestingVouch, setIsRequestingVouch] = useState(false);
  const [supervisorName, setSupervisorName] = useState('');
  const [isSubmittingVouch, setIsSubmittingVouch] = useState(false);
  const [vouchToken, setVouchToken] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [vouchError, setVouchError] = useState<string | null>(null);

  if (!selectedWorkRecord) return null;

  // Always keep selectedWorkRecord in sync with fresh state from context
  const currentRecord = workRecords.find(r => r.id === selectedWorkRecord.id) || selectedWorkRecord;
  const isConfirmed = currentRecord.status === 'CONFIRMED';
  const isRejected = currentRecord.status === 'REJECTED';

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceUrl.trim()) return;

    setIsSubmittingEvidence(true);
    setEvidenceError(null);

    try {
      await api.addEvidence({
        work_record_id: currentRecord.id,
        type: evidenceType,
        url: evidenceUrl.trim(),
        description: evidenceDesc.trim() || `${evidenceType} evidence for ${currentRecord.title}`,
      });

      await refreshData();
      setIsAddingEvidence(false);
      setEvidenceUrl('');
      setEvidenceDesc('');
    } catch (err: any) {
      console.error('Failed to add evidence:', err);
      if (err instanceof ApiError) {
        setEvidenceError(err.message);
      } else {
        setEvidenceError('Could not attach evidence item.');
      }
    } finally {
      setIsSubmittingEvidence(false);
    }
  };

  const handleRequestVouch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supervisorName.trim()) return;

    setIsSubmittingVouch(true);
    setVouchError(null);

    try {
      const conf = await api.requestConfirmation({
        work_record_id: currentRecord.id,
        verifier_name: supervisorName.trim(),
        verifier_type: 'SUPERVISOR',
      });

      setVouchToken(conf.token);
      await refreshData();
    } catch (err: any) {
      console.error('Failed to request confirmation:', err);
      if (err instanceof ApiError) {
        setVouchError(err.message);
      } else {
        setVouchError('Could not generate confirmation request.');
      }
    } finally {
      setIsSubmittingVouch(false);
    }
  };

  const copyVerifyLink = (token: string) => {
    const link = `${window.location.origin}/verify/${token}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#F5F2EB] w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] border border-[#DFD9CE] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-[#DFD9CE] flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0 pr-2">
            <h3 className="text-base font-bold text-[#141715] truncate">
              {currentRecord.title}
            </h3>
            {isConfirmed ? (
              <span className="px-2 py-0.5 rounded-full bg-[#E5EFE8] text-[#245E3F] text-[10px] font-bold flex items-center space-x-1 shrink-0 border border-[#245E3F]/20">
                <CheckCircle2 className="w-3 h-3 text-[#245E3F]" />
                <span>{t('workDetail.confirmed')}</span>
              </span>
            ) : isRejected ? (
              <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-[10px] font-bold flex items-center space-x-1 shrink-0 border border-red-200">
                <span>{t('workDetail.needsReview')}</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold flex items-center space-x-1 shrink-0 border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>{t('workDetail.awaitingVouch')}</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedWorkRecord(null)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          {/* Main Hero Photo */}
          <div className="w-full h-44 rounded-2xl overflow-hidden bg-stone-200 border border-[#DFD9CE] shadow-xs">
            <img
              alt={currentRecord.title}
              src={currentRecord.imageUrl}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD9CE] space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-gray-600">
              <span className="flex items-center space-x-1.5 font-semibold text-gray-900">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                <span>{currentRecord.employer} {currentRecord.role ? `(${currentRecord.role})` : ''}</span>
              </span>
              <span className="flex items-center space-x-1.5 font-mono text-[11px] text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{currentRecord.date}</span>
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentRecord.location}</span>
              {currentRecord.quantity ? (
                <span className="text-[#727A75]">· {currentRecord.quantity} {currentRecord.quantityUnit || 'units'}</span>
              ) : null}
            </div>

            <p className="text-gray-700 pt-1 leading-relaxed">
              {currentRecord.description}
            </p>

            {/* Skills Supported relationship */}
            <div className="pt-2 border-t border-gray-100">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-1">
                {t('workDetail.directSkills')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentRecord.skills.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-0.5 rounded-md bg-[#E5EFE8] text-[#162B22] text-[11px] font-bold border border-[#245E3F]/20"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Attached Evidence Items with Supported Skills (Section 3) */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD9CE] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900">
                {t('workDetail.attachedEvidence')} ({(currentRecord.evidenceItems || []).length})
              </h4>
              <button
                type="button"
                onClick={() => setIsAddingEvidence(!isAddingEvidence)}
                className="text-[11px] text-[#162B22] hover:text-[#102019] font-bold flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingEvidence ? t('workDetail.cancel') : t('workDetail.addEvidence')}</span>
              </button>
            </div>

            {/* Add Evidence Sub-form */}
            {isAddingEvidence && (
              <form onSubmit={handleAddEvidence} className="p-3 bg-[#F5F2EB] rounded-xl border border-[#DFD9CE] space-y-2 text-xs animate-in fade-in">
                {evidenceError && (
                  <p className="text-[11px] text-red-600">{evidenceError}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">{t('workDetail.type')}</label>
                    <select
                      value={evidenceType}
                      onChange={e => setEvidenceType(e.target.value as EvidenceType)}
                      className="w-full text-xs p-1.5 rounded-lg border border-gray-300 bg-white"
                    >
                      <option value="PHOTO">Photo</option>
                      <option value="DOCUMENT">Document</option>
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="WORK_ORDER">Work Order</option>
                      <option value="DECLARATION">Declaration</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-0.5">{t('workDetail.evidenceUrl')}</label>
                    <input
                      type="text"
                      value={evidenceUrl}
                      onChange={e => setEvidenceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-1.5 rounded-lg border border-gray-300 bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-0.5">{t('workDetail.description')}</label>
                  <input
                    type="text"
                    value={evidenceDesc}
                    onChange={e => setEvidenceDesc(e.target.value)}
                    placeholder="e.g. Busbar inspection photo"
                    className="w-full text-xs p-1.5 rounded-lg border border-gray-300 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingEvidence || !evidenceUrl.trim()}
                  className="w-full py-2 bg-[#162B22] text-white rounded-lg text-xs font-bold hover:bg-[#102019] disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  {isSubmittingEvidence ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('workDetail.attaching')}</span>
                    </>
                  ) : (
                    <span>{t('workDetail.attachBtn')}</span>
                  )}
                </button>
              </form>
            )}

            {/* Evidence List */}
            <div className="space-y-2">
              {(currentRecord.evidenceItems || []).map(ev => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {ev.type === 'PHOTO' ? (
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-200 shrink-0">
                          <img alt={ev.title} src={ev.url} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-[#E5EFE8] flex items-center justify-center text-[#162B22] shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-xs truncate">{ev.title}</p>
                        <p className="text-[10px] text-gray-400">{ev.type} · {ev.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  {ev.description && (
                    <p className="text-[11px] text-gray-600 pl-1">{ev.description}</p>
                  )}

                  <div className="text-[10px] text-stone-600 flex items-center space-x-1 pt-1 border-t border-stone-200/60">
                    <span className="text-gray-400 font-semibold">Supports:</span>
                    <span className="font-bold text-[#162B22]">
                      {ev.skillsSupported && ev.skillsSupported.length > 0 ? ev.skillsSupported.join(', ') : currentRecord.skills.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirmations with Provenance (Section 4) */}
          <div className="bg-white p-4 rounded-2xl border border-[#DFD9CE] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900">
                {t('workDetail.supervisorVouches')} ({(currentRecord.confirmations || []).length})
              </h4>
              {!isConfirmed && (
                <button
                  type="button"
                  onClick={() => setIsRequestingVouch(!isRequestingVouch)}
                  className="text-[11px] text-[#162B22] hover:text-[#102019] font-bold flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isRequestingVouch ? t('workDetail.cancel') : t('workDetail.requestVouch')}</span>
                </button>
              )}
            </div>

            {/* Request Vouch Form */}
            {isRequestingVouch && (
              <form onSubmit={handleRequestVouch} className="p-3 bg-[#F5F2EB] rounded-xl border border-[#DFD9CE] space-y-2 text-xs animate-in fade-in">
                {vouchError && (
                  <p className="text-[11px] text-red-600">{vouchError}</p>
                )}
                <div>
                  <label className="text-[10px] font-bold text-gray-600 block mb-0.5">{t('workDetail.supervisorName')}</label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={e => setSupervisorName(e.target.value)}
                    placeholder="e.g. Anil Sharma"
                    className="w-full text-xs p-1.5 rounded-lg border border-gray-300 bg-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingVouch || !supervisorName.trim()}
                  className="w-full py-2 bg-[#162B22] text-white rounded-lg text-xs font-bold hover:bg-[#102019] disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer shadow-2xs"
                >
                  {isSubmittingVouch ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('workDetail.generating')}</span>
                    </>
                  ) : (
                    <span>{t('workDetail.generateBtn')}</span>
                  )}
                </button>
              </form>
            )}

            {/* Generated Vouch Link Banner */}
            {vouchToken && (
              <div className="p-3 bg-[#E5EFE8] border border-[#245E3F]/30 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#162B22] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#245E3F]" />
                    <span>{t('workDetail.vouchGenerated')}</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {t('workDetail.sendLink')}
                </p>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/verify/${vouchToken}`}
                    className="flex-1 text-[11px] font-mono p-1.5 rounded border border-[#245E3F]/30 bg-white truncate"
                  />
                  <button
                    type="button"
                    onClick={() => copyVerifyLink(vouchToken)}
                    className="px-2.5 py-1.5 bg-[#162B22] text-white rounded text-[11px] font-bold hover:bg-[#102019] flex items-center space-x-1 cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLink ? t('workDetail.copied') : t('workDetail.copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Confirmation list */}
            {(currentRecord.confirmations || []).length > 0 ? (
              <div className="space-y-2">
                {(currentRecord.confirmations || []).map(conf => (
                  <div
                    key={conf.id}
                    className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span>Verifier: {conf.verifierName}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                        conf.status === 'CONFIRMED'
                          ? 'bg-emerald-200 text-emerald-900'
                          : conf.status === 'REJECTED'
                          ? 'bg-red-200 text-red-900'
                          : 'bg-amber-200 text-amber-900'
                      }`}>
                        {conf.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-700">
                      <span><strong>Role:</strong> {conf.verifierRole} ({conf.verifierType})</span>
                    </div>
                    {conf.notes && (
                      <p className="text-[11px] text-stone-600 italic pt-0.5">"{conf.notes}"</p>
                    )}
                    <p className="text-[10px] text-gray-400 font-mono">{conf.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-xs text-gray-500 space-y-2">
                <p>{t('workDetail.noConfirmation')}</p>
                <p className="text-[10px] text-gray-400">{t('workDetail.independentUpgrades')}</p>
                <button
                  onClick={() => {
                    setActiveVerifierRecord(currentRecord);
                    setIsVerifierModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#162B22] text-white rounded-xl text-xs font-semibold hover:bg-[#102019] flex items-center space-x-1.5 mx-auto cursor-pointer shadow-2xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{t('workDetail.simulateVouch')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailModal;
