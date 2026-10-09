import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en, hi, TranslationKey, verifyTranslations, Language } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'vouch_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'hi' || saved === 'en') {
        return saved;
      }
    }
    return 'en';
  });

  useEffect(() => {
    // Run verification check to detect any missing keys
    const verification = verifyTranslations();
    if (!verification.isValid) {
      console.warn(`[i18n Warning] Missing ${verification.missingInHindi.length} Hindi translations.`);
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, newLang);
      }
    } catch (e) {
      console.warn('Could not persist language preference:', e);
    }
  }, []);

  const t = useCallback((key: TranslationKey | string, fallback?: string): string => {
    const dict = language === 'hi' ? hi : en;
    const typedKey = key as TranslationKey;

    if (typedKey in dict) {
      const val = dict[typedKey];
      if (val && val.trim() !== '') {
        return val;
      }
    }

    // In case Hindi key is missing, warn and fall back
    if (language === 'hi' && typedKey in en) {
      console.warn(`[i18n Fallback Warning] Missing Hindi translation for key "${key}"`);
      return en[typedKey];
    }

    if (fallback !== undefined) {
      return fallback;
    }

    return key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
