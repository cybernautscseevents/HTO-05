import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Check } from 'lucide-react';

interface LanguageSelectorProps {
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or tap
  useEffect(() => {
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideInteraction);
      document.addEventListener('touchstart', handleOutsideInteraction);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
    };
  }, [isOpen]);

  // Keyboard navigation: Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectLanguage = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      {/* Compact, subtly rounded-square button matching Vouch design tokens */}
      <button
        type="button"
        id="global-language-button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Select language. Current language: ${language === 'en' ? 'English' : 'Hindi'}`}
        className="w-9 h-9 sm:w-8.5 sm:h-8.5 rounded-lg border border-[#DFD9CE] bg-[#F5F2EB] hover:bg-[#ECE7DE] active:bg-[#E5E1D8] text-xs font-mono font-bold text-[#162B22] flex items-center justify-center transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#162B22]/20 cursor-pointer"
      >
        <span>{language === 'en' ? 'EN' : 'HI'}</span>
      </button>

      {/* Clean, minimal 2-option menu: English and हिन्दी */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="global-language-button"
          className="absolute right-0 mt-1.5 w-32 rounded-xl bg-white border border-[#DFD9CE] shadow-lg py-1.5 z-50 animate-fade-in-up"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => selectLanguage('en')}
            className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
              language === 'en'
                ? 'font-bold text-[#162B22] bg-[#F5F2EB]'
                : 'text-[#484F4A] hover:text-[#162B22] hover:bg-[#F5F2EB]/60 font-medium'
            }`}
          >
            <span>English</span>
            {language === 'en' && <Check className="w-3.5 h-3.5 text-[#162B22]" />}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => selectLanguage('hi')}
            className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
              language === 'hi'
                ? 'font-bold text-[#162B22] bg-[#F5F2EB]'
                : 'text-[#484F4A] hover:text-[#162B22] hover:bg-[#F5F2EB]/60 font-medium'
            }`}
          >
            <span>हिन्दी</span>
            {language === 'hi' && <Check className="w-3.5 h-3.5 text-[#162B22]" />}
          </button>
        </div>
      )}
    </div>
  );
};
