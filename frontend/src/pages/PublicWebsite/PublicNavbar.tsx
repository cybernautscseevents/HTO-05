import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { LanguageSelector } from '../../components/LanguageSelector';
import { useLanguage } from '../../i18n/LanguageContext';

export const PublicNavbar: React.FC = () => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-[14px] font-medium transition-colors cursor-pointer ${
      isActive
        ? 'text-[#162B22] font-semibold after:content-[\'\'] after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-[2px] after:bg-[#162B22] after:rounded-full'
        : 'text-[#484F4A] hover:text-[#162B22]'
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-left text-base font-medium py-2.5 border-b border-[#ECE7DE] transition-colors ${
      isActive ? 'text-[#162B22] font-bold' : 'text-[#484F4A] hover:text-[#141715]'
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F5F2EB]/95 backdrop-blur-md border-b border-[#DFD9CE] shadow-[0_2px_12px_rgba(18,22,20,0.04)] py-3'
          : 'bg-[#F5F2EB]/80 backdrop-blur-xs border-b border-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Wordmark (Routes to /) */}
          <Link
            to="/"
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#162B22] flex items-center justify-center text-white shadow-xs group-hover:bg-[#102019] transition-colors">
              <ShieldCheck className="w-5 h-5 text-[#F5F2EB]" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-[#141715] leading-none">
                VOUCH
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#727A75] mt-0.5">
                {t('nav.professionalPassport')}
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation with Exact Routes */}
          <nav className="hidden md:flex items-center space-x-7 lg:space-x-8">
            <NavLink to="/" end className={navLinkClasses}>
              {t('nav.home')}
            </NavLink>
            <NavLink to="/workers" className={navLinkClasses}>
              {t('nav.forWorkers')}
            </NavLink>
            <NavLink to="/employers" className={navLinkClasses}>
              {t('nav.forEmployers')}
            </NavLink>
            <NavLink to="/how-it-works" className={navLinkClasses}>
              {t('nav.howItWorks')}
            </NavLink>
            <NavLink to="/passport" className={navLinkClasses}>
              {t('nav.passport')}
            </NavLink>
            <NavLink to="/about" className={navLinkClasses}>
              {t('nav.about')}
            </NavLink>
          </nav>

          {/* Right Log In CTA & Compact Square Language Selector */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector />
            <Link
              to="/login"
              className="group inline-flex items-center space-x-1.5 px-4 py-2 text-[14px] font-semibold text-[#162B22] hover:text-[#141715] rounded-lg transition-colors"
            >
              <span>{t('nav.logIn')}</span>
              <ArrowRight className="w-4 h-4 text-[#C2672B] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Language Selector & Menu Toggle Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <LanguageSelector />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#141715] hover:bg-[#ECE7DE] transition-colors cursor-pointer"
              aria-label={t('nav.toggleMenu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F5F2EB] border-b border-[#DFD9CE] px-5 pt-3 pb-6 shadow-xl animate-fade-in-up">
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/workers"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              {t('nav.forWorkers')}
            </NavLink>
            <NavLink
              to="/employers"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              {t('nav.forEmployers')}
            </NavLink>
            <NavLink
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              {t('nav.howItWorks')}
            </NavLink>
            <NavLink
              to="/passport"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              {t('nav.passport')}
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClasses}
            >
              {t('nav.about')}
            </NavLink>

            <div className="pt-4 flex flex-col space-y-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-lg bg-[#162B22] text-white font-semibold text-center text-sm shadow-xs flex items-center justify-center space-x-2"
              >
                <span>{t('nav.logIn')}</span>
                <ArrowRight className="w-4 h-4 text-[#C2672B]" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
