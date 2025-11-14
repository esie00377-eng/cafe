import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAppContext, useTranslation } from '../context/AppContext';

interface HeaderProps {
  isAdminView: boolean;
  setIsAdminView: (isAdmin: boolean) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isAdminView, setIsAdminView, isAuthenticated, onLogout }) => {
  const { language, themeStyles, cafeName, logoUrl } = useAppContext();
  const t = useTranslation();

  return (
    <header className={`${themeStyles.headerBg} shadow-md`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {logoUrl ? (
                <img src={logoUrl} alt={cafeName[language]} className="h-12 w-12 object-contain" />
            ) : (
                <svg className={`h-10 w-10 ${themeStyles.accentColor}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.024.217 1.464l-.691 1.2a1.875 1.875 0 0 1-3.464 0l-.691-1.2a1.125 1.125 0 0 0-.217-1.464l1.068-.89a1.125 1.125 0 0 0 .405-.864v-.568a1.875 1.875 0 0 1 3.75 0Zm-2.25 0a1.875 1.875 0 0 0 0 3.75M3 13.5v.003A1.125 1.125 0 0 0 4.125 12h15.75c.621 0 1.125.504 1.125 1.125v.003Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15a1.5 1.5 0 0 0 1.5-1.5V16.5a1.5 1.5 0 0 0-1.5-1.5h-15a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5Z" />
                </svg>
            )}
            <h1 className={`text-2xl font-bold ${themeStyles.textColor}`}>
              {cafeName[language]}
            </h1>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            {isAuthenticated && isAdminView && (
              <button
                onClick={onLogout}
                className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600
                  bg-red-600 hover:bg-red-700
                `}
              >
                {t('logout')}
              </button>
            )}
            <button
              onClick={() => setIsAdminView(!isAdminView)}
              className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-600
                ${themeStyles.primaryButtonBg}
                ${themeStyles.primaryButtonHoverBg}
              `}
            >
              {isAdminView ? t('customer_view') : t('admin_panel')}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};