import React, { useState, FormEvent, useEffect } from 'react';
import { Category } from '../types';
import { useAppContext, useTranslation } from '../context/AppContext';

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 ltr:mr-3 rtl:ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface CategoryFormProps {
  category: Category | null;
  onSave: (category: Omit<Category, 'id' | 'displayOrder'> | Category) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const initialFormState = {
  name: { en: '', fa: '' },
  isSpecial: false,
};

export const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onClose, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormState);
  const { themeStyles } = useAppContext();
  const t = useTranslation();
  
  useEffect(() => {
    if (category) {
      setFormData({ 
          name: { en: category.name.en, fa: category.name.fa },
          isSpecial: category.isSpecial || false,
        });
    } else {
      setFormData(initialFormState);
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({...prev, [name]: checked }));
        return;
    }
    const [field, lang] = name.split('.');
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev as any)[field], [lang]: value },
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(category ? { ...category, ...formData } : formData);
  };
  
  const inputStyles = `mt-1 block w-full rounded-md border-gray-400/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${themeStyles.cardBg} ${themeStyles.textColor}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className={`${themeStyles.cardBg} rounded-lg shadow-xl w-full max-w-lg`}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${themeStyles.textColor}`}>{category ? t('edit_category') : t('add_new_category')}</h3>
            
            <div className="mb-4">
              <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('category_name_en')}</label>
              <input type="text" name="name.en" value={formData.name.en} onChange={handleChange} className={inputStyles} required />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('category_name_fa')}</label>
              <input type="text" name="name.fa" value={formData.name.fa} onChange={handleChange} dir="rtl" className={inputStyles} required />
            </div>
            <div className="mb-4">
                <label className="flex items-center">
                    <input 
                        type="checkbox"
                        name="isSpecial"
                        checked={formData.isSpecial}
                        onChange={handleChange}
                        className={`h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 ${themeStyles.cardBg}`}
                    />
                    <span className={`ml-2 rtl:mr-2 ${themeStyles.subtleTextColor}`}>{t('chefs_specials')}</span>
                </label>
            </div>
          </div>
          
          <div className={`${themeStyles.headerBg} px-6 py-3 flex justify-end space-x-2 rtl:space-x-reverse`}>
            <button type="button" onClick={onClose} className={`py-2 px-4 border border-gray-300/50 rounded-md shadow-sm text-sm font-medium focus:outline-none ${themeStyles.cardBg} ${themeStyles.textColor} hover:bg-black/10`}>{t('cancel')}</button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none flex justify-center items-center min-w-[100px] ${themeStyles.primaryButtonBg} ${themeStyles.primaryButtonHoverBg} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};