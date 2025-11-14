import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Language, AppContextType, ThemeName, BilingualString, CategoryDisplayStyle } from '../types';
import { UI_TRANSLATIONS } from '../constants';
import { themes } from '../themes';

// --- LocalStorage Keys ---
const LS_PREFIX = 'bilingual-menu-';
const LS_LANGUAGE_KEY = `${LS_PREFIX}language`;
const LS_THEME_KEY = `${LS_PREFIX}theme`;
const LS_CAFE_NAME_KEY = `${LS_PREFIX}cafeName`;
const LS_LOGO_URL_KEY = `${LS_PREFIX}logoUrl`;
const LS_CATEGORY_STYLE_KEY = `${LS_PREFIX}categoryDisplayStyle`;
// --- End LocalStorage Keys ---


const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to get item from localStorage safely
const getStoredValue = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};


export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => getStoredValue(LS_LANGUAGE_KEY, 'en'));
  const [theme, setTheme] = useState<ThemeName>(() => getStoredValue(LS_THEME_KEY, 'default'));
  const [cafeName, setCafeName] = useState<BilingualString>(() => getStoredValue(LS_CAFE_NAME_KEY, { en: 'Digital Cafe', fa: 'کافه دیجیتال' }));
  const [logoUrl, setLogoUrl] = useState<string>(() => getStoredValue(LS_LOGO_URL_KEY, ''));
  const [categoryDisplayStyle, setCategoryDisplayStyle] = useState<CategoryDisplayStyle>(() => getStoredValue(LS_CATEGORY_STYLE_KEY, 'thumbnails'));


  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.body.className = lang === 'fa' ? 'font-vazir' : 'font-sans';
  };
  
  // Effect to set initial HTML attributes
  useEffect(() => {
    setLanguage(language);
  }, []);

  // --- Effects to persist state to localStorage ---
   useEffect(() => {
    localStorage.setItem(LS_LANGUAGE_KEY, JSON.stringify(language));
  }, [language]);

  useEffect(() => {
    localStorage.setItem(LS_THEME_KEY, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LS_CAFE_NAME_KEY, JSON.stringify(cafeName));
  }, [cafeName]);
  
  useEffect(() => {
    localStorage.setItem(LS_LOGO_URL_KEY, JSON.stringify(logoUrl));
  }, [logoUrl]);

  useEffect(() => {
    localStorage.setItem(LS_CATEGORY_STYLE_KEY, JSON.stringify(categoryDisplayStyle));
  }, [categoryDisplayStyle]);
  // --- End Effects ---


  const value = {
    language,
    setLanguage,
    translations: UI_TRANSLATIONS,
    theme,
    setTheme,
    themeStyles: themes[theme].styles,
    cafeName,
    setCafeName,
    logoUrl,
    setLogoUrl,
    categoryDisplayStyle,
    setCategoryDisplayStyle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const useTranslation = () => {
    const { language, translations } = useAppContext();
    return (key: string) => translations[language][key] || key;
}