import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  ShieldCheck, 
  MapPin, 
  Award, 
  User, 
  Lock, 
  LogOut, 
  FileCheck2,
  Mail,
  Phone,
  Languages
} from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { worker, logout } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear active worker ID, stored email, and authentication state
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      
      {/* 1. Worker Profile Hero Banner */}
      <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#162B22] bg-[#ECE7DE] shrink-0 shadow-xs">
            <img
              src={worker.avatarUrl}
              alt={worker.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#E5EFE8] text-[#245E3F] border border-[#245E3F]/20">
                {t('profileTab.activeSession')}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-[#F5F2EB] text-[#727A75] border border-[#DFD9CE]">
                ID: {worker.passportId}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#141715] tracking-tight">
              {worker.name}
            </h1>
            <p className="text-base font-semibold text-[#162B22]">
              {worker.trade} · {worker.experienceYears} {t('common.yearsExp')}
            </p>

            <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs text-[#727A75]">
              <MapPin className="w-3.5 h-3.5 text-[#727A75]" />
              <span>{worker.location}</span>
            </div>

            <p className="text-xs text-[#484F4A] italic max-w-xl pt-1">
              &quot;{worker.bio}&quot;
            </p>
          </div>
        </div>
      </div>

      {/* 2. Account Information (Informational Account Type) */}
      <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#ECE7DE]">
          <User className="w-5 h-5 text-[#162B22]" />
          <div>
            <h2 className="font-bold text-base text-[#141715]">{t('profileTab.accountInfo')}</h2>
            <p className="text-xs text-[#727A75]">{t('profileTab.accountSubtitle')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE]">
            <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-1">
              {t('profileTab.accountType')}
            </span>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-[#141715]">{t('common.worker')}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#E5EFE8] text-[#245E3F] font-bold">
                {t('profileTab.portablePassport')}
              </span>
            </div>
            <p className="text-xs text-[#727A75] mt-1.5 leading-relaxed">
              {t('profileTab.accountDesc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE] space-y-2.5">
            <div>
              <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-0.5">
                {t('profileTab.registeredEmail')}
              </span>
              <div className="flex items-center space-x-2 text-xs text-[#121614] font-medium">
                <Mail className="w-3.5 h-3.5 text-[#737A75]" />
                <span>{worker.email || (typeof localStorage !== 'undefined' ? localStorage.getItem('vouch_user_email') : null) || 'registered@vouchwork.in'}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-[#DFD9CE]">
              <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-0.5">
                {t('profileTab.registeredPhone')}
              </span>
              <div className="flex items-center space-x-2 text-xs text-[#121614] font-medium">
                <Phone className="w-3.5 h-3.5 text-[#737A75]" />
                <span>{worker.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Personal & Vocational Information */}
      <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#ECE7DE]">
          <Award className="w-5 h-5 text-[#162B22]" />
          <div>
            <h2 className="font-bold text-base text-[#141715]">{t('profileTab.vocationalRecords')}</h2>
            <p className="text-xs text-[#727A75]">{t('profileTab.vocationalSubtitle')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE]">
              <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-1">
                {t('profileTab.operatingRegion')}
              </span>
              <p className="font-medium text-[#141715]">{worker.location}</p>
              <p className="text-[11px] text-[#727A75] mt-1">
                {t('profileTab.portableAcross')}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE]">
              <span className="text-[11px] font-mono uppercase text-[#727A75] font-semibold block mb-1">
                {t('profileTab.languagesLabel')}
              </span>
              <div className="flex items-center space-x-1.5 font-medium text-[#121614]">
                <Languages className="w-3.5 h-3.5 text-[#737A75]" />
                <span>{worker.languages && worker.languages.length > 0 ? worker.languages.join(', ') : 'No languages added yet'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-mono uppercase text-[#727A75] font-semibold block">
              {t('profileTab.certificates')}
            </span>
            <div className="space-y-2.5">
              {worker.certifications.map(cert => (
                <div
                  key={cert.id}
                  className="p-3.5 rounded-xl bg-[#F5F2EB] border border-[#DFD9CE] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-[#141715]">{cert.name}</p>
                    <p className="text-[11px] text-[#727A75] mt-0.5">
                      {t('profileTab.issuedBy')} {cert.issuer}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[#727A75] bg-white px-2.5 py-1 rounded-lg border border-[#DFD9CE]">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Security & Authentication */}
      <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#ECE7DE]">
          <Lock className="w-5 h-5 text-[#162B22]" />
          <div>
            <h2 className="font-bold text-base text-[#141715]">{t('profileTab.securityTitle')}</h2>
            <p className="text-xs text-[#727A75]">{t('profileTab.securitySubtitle')}</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F5F2EB] border border-[#DFD9CE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-[#141715]">{t('profileTab.passwordLabel')}</p>
            <p className="text-[#727A75] mt-0.5">
              {t('profileTab.passwordDesc')}
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-white border border-[#DFD9CE] text-xs font-medium text-[#245E3F] self-start sm:self-auto">
            {t('profileTab.protected')}
          </span>
        </div>
      </div>

      {/* 5. Clean Log Out Section (Separate Account Concept) */}
      <div className="bg-[#E6EDE8] rounded-3xl border border-[#DFD9CE] p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <h2 className="font-bold text-base text-[#141715]">{t('profileTab.sessionMgmt')}</h2>
          <p className="text-xs text-[#727A75] mt-1">
            {t('profileTab.sessionDesc')}
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-[#B91C1C] text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('profileTab.logoutBtn')}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfileTab;
