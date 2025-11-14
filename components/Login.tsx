import React, { useState } from 'react';
import { useAppContext, useTranslation } from '../context/AppContext';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { themeStyles } = useAppContext();
  const t = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'esi' && password === '123123123') {
      onLoginSuccess();
    } else {
      setError(t('incorrect_credentials'));
    }
  };
  
  const inputStyles = `mt-1 block w-full rounded-md border-gray-400/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${themeStyles.cardBg} ${themeStyles.textColor}`;
  const singleInputStyles = `relative block w-full appearance-none px-3 py-2 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm ${inputStyles}`;


  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className={`w-full max-w-md space-y-8 p-8 rounded-lg shadow-lg ${themeStyles.cardBg}`}>
        <div>
          <h2 className={`mt-6 text-center text-3xl font-bold tracking-tight ${themeStyles.textColor}`}>
            {t('admin_login')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">{t('username')}</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={singleInputStyles}
                placeholder={t('username')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">{t('password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={singleInputStyles}
                placeholder={t('password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2
                ${themeStyles.primaryButtonBg} ${themeStyles.primaryButtonHoverBg}
              `}
            >
              {t('sign_in')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
