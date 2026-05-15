import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { strings, Language, StringKey } from '../constants/strings';

const LANGUAGE_STORAGE_KEY = '@app_language';

type LocalizationContextValue = {
  language: Language;
  loading: boolean;
  setLanguage: (language: Language) => Promise<void>;
  t: (key: StringKey) => string;
};

const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLanguage() {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);

        if (storedLanguage === 'en' || storedLanguage === 'de') {
          setLanguageState(storedLanguage);
        }
      } catch {
        setLanguageState('de');
      } finally {
        setLoading(false);
      }
    }

    loadLanguage();
  }, []);

  const setLanguage = async (nextLanguage: Language) => {
    setLanguageState(nextLanguage);

    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      throw new Error('Language could not be saved.');
    }
  };

  const t = (key: StringKey) => strings[language][key];

  return (
    <LocalizationContext.Provider value={{ language, loading, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error('useLocalization must be used inside LocalizationProvider');
  }

  return context;
}
