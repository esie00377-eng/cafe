import React from 'react';
import { useAppContext, useTranslation } from '../context/AppContext';
import { themes } from '../themes';
import { ThemeName } from '../types';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, language, themeStyles } = useAppContext();
  const t = useTranslation();

  return (
    <div className="relative">
      <label htmlFor="theme-switcher" className="sr-only">{t('select_theme')}</label>
      <select
        id="theme-switcher"
        value={theme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        className={`w-full appearance-none rounded-md border border-gray-300 py-2 pl-3 pr-8 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${themeStyles.cardBg}
          ${themeStyles.textColor}
        `}
      >
        {Object.keys(themes).map((themeKey) => (
          <option key={themeKey} value={themeKey}>
            {themes[themeKey as ThemeName].name[language]}
          </option>
        ))}
      </select>
      <div className={`pointer-events-none absolute inset-y-0 flex items-center px-2 ${language === 'en' ? 'right-0' : 'left-0'}`}>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.24a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.12 1.004l-3.25 3.5a.75.75 0 01-1.12 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};
