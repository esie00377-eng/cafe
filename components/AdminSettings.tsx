import React, { useState } from 'react';
import { useAppContext, useTranslation } from '../context/AppContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { BilingualString, CategoryDisplayStyle } from '../types';

export const AdminSettings: React.FC = () => {
  const {
    cafeName,
    setCafeName,
    logoUrl,
    setLogoUrl,
    themeStyles,
    categoryDisplayStyle,
    setCategoryDisplayStyle,
  } = useAppContext();
  const t = useTranslation();

  const [localCafeName, setLocalCafeName] = useState<BilingualString>(cafeName);
  const [localLogoUrl, setLocalLogoUrl] = useState<string>(logoUrl);
  const [localCategoryDisplayStyle, setLocalCategoryDisplayStyle] = useState<CategoryDisplayStyle>(categoryDisplayStyle);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const lang = name.split('.')[1] as 'en' | 'fa';
    setLocalCafeName(prev => ({ ...prev, [lang]: value }));
  };
  
  const handleSave = () => {
    setCafeName(localCafeName);
    setLogoUrl(localLogoUrl);
    setCategoryDisplayStyle(localCategoryDisplayStyle);
    alert('Settings saved!');
  };
  
  const inputStyles = `mt-1 block w-full rounded-md border-gray-400/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${themeStyles.cardBg} ${themeStyles.textColor}`;

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${themeStyles.textColor}`}>{t('cafe_settings')}</h2>
        <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('cafe_name_en')}</label>
                    <input type="text" name="name.en" value={localCafeName.en} onChange={handleNameChange} className={inputStyles} />
                </div>
                <div>
                    <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('cafe_name_fa')}</label>
                    <input type="text" name="name.fa" value={localCafeName.fa} onChange={handleNameChange} dir="rtl" className={inputStyles} />
                </div>
            </div>
             <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('logo_url')}</label>
                <input type="text" value={localLogoUrl} onChange={(e) => setLocalLogoUrl(e.target.value)} className={inputStyles} />
            </div>
            {localLogoUrl && (
                 <div>
                    <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('logo_preview')}</label>
                    <div className="mt-2 p-4 border border-dashed border-gray-400/50 rounded-md flex justify-center items-center">
                        <img src={localLogoUrl} alt="Logo Preview" className="h-20 w-20 object-contain" />
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${themeStyles.textColor}`}>{t('display_settings')}</h2>
        <div className="space-y-6 max-w-2xl">
            <div>
                <h3 className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}>{t('theme_settings')}</h3>
                <div className="max-w-xs">
                    <ThemeSwitcher />
                </div>
            </div>
            <div>
                <h3 className={`text-lg font-semibold mb-2 ${themeStyles.textColor}`}>{t('category_display_style')}</h3>
                 <fieldset>
                    <legend className="sr-only">{t('category_display_style')}</legend>
                    <div className="space-y-2">
                        {(['tabs', 'thumbnails'] as CategoryDisplayStyle[]).map((style) => (
                        <label key={style} className="flex items-center cursor-pointer">
                            <input
                            type="radio"
                            name="category-display-style"
                            value={style}
                            checked={localCategoryDisplayStyle === style}
                            onChange={(e) => setLocalCategoryDisplayStyle(e.target.value as CategoryDisplayStyle)}
                            className={`h-4 w-4 border-gray-400/50 text-amber-600 focus:ring-amber-500 ${themeStyles.cardBg}`}
                            />
                            <span className={`ml-3 rtl:mr-3 block text-sm font-medium ${themeStyles.textColor}`}>
                            {t(`style_${style}`)}
                            </span>
                        </label>
                        ))}
                    </div>
                </fieldset>
            </div>
        </div>
      </div>

      <div>
        <button
          onClick={handleSave}
          className={`text-white px-6 py-2 rounded-md transition ${themeStyles.primaryButtonBg} ${themeStyles.primaryButtonHoverBg}`}
        >
          {t('save_settings')}
        </button>
      </div>

    </div>
  );
};