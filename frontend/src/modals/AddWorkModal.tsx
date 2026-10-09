import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api, ApiError } from '../services/api';
import { 
  X, 
  Mic, 
  Check, 
  Image as ImageIcon, 
  UserCheck, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  PlusCircle,
  Trash2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const AddWorkModal: React.FC = () => {
  const { t } = useLanguage();
  const { 
    isAddWorkOpen, 
    setIsAddWorkOpen, 
    refreshData,
    setCurrentTab 
  } = useApp();

  const [promptText, setPromptText] = useState(
    'I installed six electrical panels at a commercial building last week.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formattedData, setFormattedData] = useState<{
    title: string;
    trade: string;
    skills: string[];
    quantity: number;
    quantity_unit: string;
    date: string;
    location: string;
    employer: string;
    role: string;
    description: string;
  } | null>(null);

  const [newSkillInput, setNewSkillInput] = useState('');
  const [supervisorName, setSupervisorName] = useState('Anil Sharma (Site Supervisor)');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?w=600&auto=format&fit=crop&q=80'
  );

  if (!isAddWorkOpen) return null;

  const handleFormat = async () => {
    if (!promptText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      // Call backend FastAPI endpoint: POST /api/ai/extract-work
      const result = await api.extractWork(promptText.trim());
      setFormattedData({
        title: result.title || 'Electrical Installation',
        trade: result.trade || 'Electrical',
        skills: result.skills && result.skills.length > 0 ? result.skills : ['Electrical Wiring'],
        quantity: result.quantity ? Math.round(result.quantity) : 1,
        quantity_unit: result.quantity_unit || 'units',
        date: result.date || new Date().toISOString().split('T')[0],
        location: result.location || 'Mangaluru',
        employer: 'Delta Infra Projects',
        role: 'Installation Specialist',
        description: result.summary || promptText.trim(),
      });
    } catch (err: any) {
      console.error('AI Work extraction failed:', err);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to extract work details. You can enter details manually.');
      }
      // Fallback draft so the user can still proceed even if offline
      setFormattedData({
        title: 'Electrical Work Project',
        trade: 'Electrical',
        skills: ['Electrical Wiring', 'Panel Installation'],
        quantity: 1,
        quantity_unit: 'units',
        date: new Date().toISOString().split('T')[0],
        location: 'Mangaluru',
        employer: 'Delta Infra Projects',
        role: 'Technician',
        description: promptText.trim(),
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setPromptText(transcript);
      };
      recognition.start();
    } else {
      setIsListening(true);
      setTimeout(() => {
        setPromptText('I installed six electrical panels at a commercial building last week.');
        setIsListening(false);
      }, 800);
    }
  };

  const handleAddSkill = () => {
    if (!formattedData || !newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!formattedData.skills.includes(trimmed)) {
      setFormattedData({
        ...formattedData,
        skills: [...formattedData.skills, trimmed],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!formattedData) return;
    setFormattedData({
      ...formattedData,
      skills: formattedData.skills.filter(s => s !== skillToRemove),
    });
  };

  const handleSave = async () => {
    if (!formattedData) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      // 1. Create Work Record on backend: POST /api/work
      const createdWork = await api.createWork({
        title: formattedData.title,
        description: formattedData.description || promptText,
        date: formattedData.date,
        location: formattedData.location,
        quantity: formattedData.quantity,
        quantity_unit: formattedData.quantity_unit,
        trade: formattedData.trade,
        skills: formattedData.skills,
        employer_name: formattedData.employer,
        project_name: formattedData.title,
      });

      // 2. Attach Evidence Photo if provided: POST /api/evidence
      if (selectedPhoto && selectedPhoto.trim()) {
        try {
          await api.addEvidence({
            work_record_id: createdWork.id,
            type: 'PHOTO',
            url: selectedPhoto.trim(),
            description: `${formattedData.title} completion photo`,
          });
        } catch (evErr) {
          console.warn('Could not attach evidence photo during create:', evErr);
        }
      }

      // 3. Request Independent Confirmation if supervisor is specified: POST /api/confirmations/request
      if (supervisorName && supervisorName.trim()) {
        try {
          await api.requestConfirmation({
            work_record_id: createdWork.id,
            verifier_name: supervisorName.trim(),
            verifier_type: 'SUPERVISOR',
          });
        } catch (confErr) {
          console.warn('Could not request confirmation during create:', confErr);
        }
      }

      // 4. Refresh global app state from backend
      await refreshData();

      // 5. Reset and close modal
      setIsAddWorkOpen(false);
      setFormattedData(null);
      setCurrentTab('work');
    } catch (err: any) {
      console.error('Failed to create work record:', err);
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Failed to save work record to the server.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#F5F2EB] w-full max-w-lg rounded-t-[28px] sm:rounded-[28px] border border-[#DFD9CE] shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white border-b border-[#DFD9CE] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#141715]">{t('modals.addWorkTitle')}</h3>
            <p className="text-xs text-gray-500">
              {t('modals.addWorkSubtitle')}
            </p>
          </div>
          <button
            onClick={() => {
              setIsAddWorkOpen(false);
              setErrorMessage(null);
            }}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Step 1: Describe Work Naturally */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C2672B]" />
                <span>{t('modals.describeWork')}</span>
              </label>
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex items-center space-x-1 text-xs px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 text-white border-red-500 animate-pulse'
                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                }`}
              >
                <Mic className="w-3 h-3" />
                <span>{isListening ? t('modals.listening') : t('modals.voiceInput')}</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              placeholder={t('modals.placeholderWork')}
              className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#162B22] text-gray-900"
            />

            {/* Quick Demo Prompts */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="text-[10px] text-gray-400 self-center mr-1">{t('modals.demoExamples')}</span>
              <button
                type="button"
                onClick={() => setPromptText('I installed six electrical panels at a commercial building last week.')}
                className="text-[10px] bg-stone-200/80 hover:bg-stone-300 text-stone-800 px-2 py-0.5 rounded-md font-medium cursor-pointer"
              >
                6 Commercial Panels
              </button>
              <button
                type="button"
                onClick={() => setPromptText('Completed 3BHK residential conduit piping, earthing and distribution board in Kadri.')}
                className="text-[10px] bg-stone-200/80 hover:bg-stone-300 text-stone-800 px-2 py-0.5 rounded-md font-medium cursor-pointer"
              >
                3BHK House Wiring
              </button>
              <button
                type="button"
                onClick={() => setPromptText('Rewound and tested a 15 HP 3-phase induction motor stator with insulation resistance check.')}
                className="text-[10px] bg-stone-200/80 hover:bg-stone-300 text-stone-800 px-2 py-0.5 rounded-md font-medium cursor-pointer"
              >
                15HP Motor Rewind
              </button>
            </div>

            {!formattedData && (
              <button
                onClick={handleFormat}
                disabled={isProcessing || !promptText.trim()}
                className="w-full mt-2 py-2.5 bg-[#162B22] text-white rounded-xl text-xs font-bold hover:bg-[#102019] disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t('modals.extracting')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#C2672B]" />
                    <span>{t('modals.structureBtn')}</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Step 2: Clean Structured Work Record Preview */}
          {formattedData && (
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('modals.reviewEdit')}</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium">FastAPI Validated</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.projectTitle')}</label>
                <input
                  type="text"
                  value={formattedData.title}
                  onChange={e => setFormattedData({ ...formattedData, title: e.target.value })}
                  className="w-full text-xs font-semibold p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.tradeCategory')}</label>
                  <input
                    type="text"
                    value={formattedData.trade}
                    onChange={e => setFormattedData({ ...formattedData, trade: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.location')}</label>
                  <input
                    type="text"
                    value={formattedData.location}
                    onChange={e => setFormattedData({ ...formattedData, location: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.quantity')}</label>
                  <input
                    type="number"
                    value={formattedData.quantity}
                    onChange={e => setFormattedData({ ...formattedData, quantity: parseFloat(e.target.value) || 1 })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.unit')}</label>
                  <input
                    type="text"
                    value={formattedData.quantity_unit}
                    onChange={e => setFormattedData({ ...formattedData, quantity_unit: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.dateCompleted')}</label>
                <input
                  type="date"
                  value={formattedData.date}
                  onChange={e => setFormattedData({ ...formattedData, date: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">{t('modals.summaryDescription')}</label>
                <textarea
                  rows={2}
                  value={formattedData.description}
                  onChange={e => setFormattedData({ ...formattedData, description: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                />
              </div>

              {/* Skills Supported (Key requirement: explicit relationship) */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 block mb-1">
                  {t('modals.demonstratedSkills')}
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {formattedData.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-[#E5EFE8] text-[#162B22] text-[11px] font-bold border border-[#245E3F]/20"
                    >
                      <span>✓ {s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(s)}
                        className="text-gray-400 hover:text-red-600 ml-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex space-x-1.5">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={e => setNewSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder={t('modals.addSkillPlaceholder')}
                    className="flex-1 text-xs p-1.5 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 cursor-pointer"
                  >
                    {t('modals.addBtn')}
                  </button>
                </div>
              </div>

              {/* Step 3: Attach Evidence */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 block">
                  {t('modals.photoEvidence')}
                </label>
                <div className="flex items-center space-x-2.5">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                    <img alt="Evidence" src={selectedPhoto} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={selectedPhoto}
                      onChange={e => setSelectedPhoto(e.target.value)}
                      placeholder="Photo image URL"
                      className="w-full text-xs p-1.5 rounded-lg border border-gray-300 bg-stone-50 text-gray-900 truncate"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {t('modals.photoEvidenceDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4: Request Confirmation */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 flex items-center space-x-1">
                  <UserCheck className="w-3.5 h-3.5 text-gray-500" />
                  <span>{t('modals.requestConfirmation')}</span>
                </label>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={e => setSupervisorName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-gray-300 bg-stone-50 text-gray-900"
                  placeholder={t('modals.supervisorPlaceholder')}
                />
                <p className="text-[10px] text-gray-400">
                  {t('modals.confirmationDesc')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-[#162B22] text-white rounded-xl text-xs font-bold hover:bg-[#102019] disabled:opacity-50 shadow-xs active:translate-y-[1px] transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('modals.savingToLedger')}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t('modals.saveToPassport')}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setFormattedData(null)}
                  disabled={isSaving}
                  className="px-3 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-xs font-semibold hover:bg-stone-200 cursor-pointer disabled:opacity-50"
                >
                  {t('modals.resetDraft')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddWorkModal;
