import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Language } from '../types';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, themeStyles } = useAppContext();

  const toggleLanguage = () => {
    const newLang: Language = language === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`px-4 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${themeStyles.cardBg}
        ${themeStyles.textColor}
        hover:bg-gray-50/10
      `}
    >
      {language === 'en' ? 'فارسی' : 'English'}
    </button>
  );
};
