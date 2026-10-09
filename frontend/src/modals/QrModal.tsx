import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Copy, Check, ExternalLink, Shield } from 'lucide-react';

export const QrModal: React.FC = () => {
  const { t } = useLanguage();
  const {
    isQrModalOpen,
    setIsQrModalOpen,
    worker,
    setActiveRole,
    setCurrentTab,
  } = useApp();

  const navigate = useNavigate();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const slug = (worker as any)?.publicSlug || (worker as any)?.public_slug || worker?.id || 'ravi-kumar-82a7';
  const publicUrl = `${window.location.origin}/passport/${slug}`;

  useEffect(() => {
    if (isQrModalOpen) {
      QRCode.toDataURL(publicUrl, {
        width: 220,
        margin: 2,
        color: {
          dark: '#141715',
          light: '#ffffff',
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [isQrModalOpen, publicUrl]);

  if (!isQrModalOpen) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenContractorView = () => {
    setIsQrModalOpen(false);
    setActiveRole('contractor');
    setCurrentTab('home');
    navigate('/contractor');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[28px] border border-stone-300 shadow-2xl p-5 text-center space-y-3.5 flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center space-x-1.5 text-left">
            <Shield className="w-4 h-4 text-[#162B22]" />
            <span className="text-xs font-bold text-gray-900">
              {t('qrModal.shareTitle')}
            </span>
          </div>

          <button
            onClick={() => setIsQrModalOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Worker Summary */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-[#E5EFE8] px-2 py-0.5 rounded-full inline-block mb-1 border border-[#245E3F]/20">
            {t('qrModal.workerRecord')}
          </span>

          <h3 className="text-base font-bold text-[#141715]">
            {worker.name}
          </h3>

          <p className="text-xs text-gray-600">
            {worker.trade} · {worker.experienceYears} {t('common.yearsExp')} ·{' '}
            {worker.location.split(',')[0]}
          </p>
        </div>

        {/* QR Code */}
        <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 relative flex items-center justify-center">
          {qrDataUrl ? (
            <img
              alt="Passport QR"
              src={qrDataUrl}
              className="w-44 h-44 rounded-lg shadow-2xs"
            />
          ) : (
            <div className="w-44 h-44 flex items-center justify-center text-xs text-gray-400">
              {t('qrModal.generating')}
            </div>
          )}
        </div>

        <p className="text-[11px] text-gray-500 max-w-[240px] leading-relaxed">
          {t('qrModal.scanDesc')}
        </p>

        {/* Link & Actions */}
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono text-gray-700">
            <span className="truncate pr-2">{publicUrl}</span>

            <button
              onClick={handleCopy}
              className="text-[#162B22] hover:text-[#102019] p-1 font-sans font-semibold shrink-0 cursor-pointer"
              title="Copy URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-[#245E3F]" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-[#162B22] text-white rounded-xl text-xs font-bold hover:bg-[#102019] active:translate-y-[1px] transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{t('qrModal.linkCopied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{t('qrModal.copyShareable')}</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenContractorView}
            className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-gray-800 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-600" />
            <span>{t('qrModal.simulateScan')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrModal;