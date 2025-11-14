import React, { useState, FormEvent, useEffect } from 'react';
import { Category, MenuItem } from '../types';
import { useAppContext, useTranslation } from '../context/AppContext';

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 ltr:mr-3 rtl:ml-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface MenuItemFormProps {
  item: MenuItem | null;
  categories: Category[];
  onSave: (item: Omit<MenuItem, 'id' | 'displayOrder'> | MenuItem) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const initialFormState = {
  name: { en: '', fa: '' },
  description: { en: '', fa: '' },
  price: 0,
  imageUrl: '',
  categoryId: '',
};

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, categories, onSave, onClose, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormState);
  const { language, themeStyles } = useAppContext();
  const t = useTranslation();
  
  useEffect(() => {
    if (item) {
      setFormData({
        name: { en: item.name.en, fa: item.name.fa },
        description: { en: item.description.en, fa: item.description.fa },
        price: item.price,
        imageUrl: item.imageUrl,
        categoryId: item.categoryId,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [item]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [field, lang] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [field]: { ...(prev as any)[field], [lang]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) : value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
        alert(t('select_category'));
        return;
    }
    onSave(item ? { ...item, ...formData } : formData);
  };
  
  const inputStyles = `mt-1 block w-full rounded-md border-gray-400/50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${themeStyles.cardBg} ${themeStyles.textColor}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className={`${themeStyles.cardBg} rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto`}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className={`text-xl font-bold mb-4 ${themeStyles.textColor}`}>{item ? t('edit_item') : t('add_new_item')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('item_name_en')}</label>
                <input type="text" name="name.en" value={formData.name.en} onChange={handleChange} className={inputStyles} required />
              </div>
              <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('item_name_fa')}</label>
                <input type="text" name="name.fa" value={formData.name.fa} onChange={handleChange} dir="rtl" className={inputStyles} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('description_en')}</label>
                <textarea name="description.en" value={formData.description.en} onChange={handleChange} rows={3} className={inputStyles} required />
              </div>
              <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('description_fa')}</label>
                <textarea name="description.fa" value={formData.description.fa} onChange={handleChange} rows={3} dir="rtl" className={inputStyles} required />
              </div>
            </div>

            <div className="mb-4">
              <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('image_url')}</label>
              <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className={inputStyles} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('price')}</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" className={inputStyles} required />
              </div>
              <div>
                <label className={`block text-sm font-medium ${themeStyles.subtleTextColor}`}>{t('category')}</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={inputStyles} required>
                  <option value="">{t('select_category')}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name[language]}</option>
                  ))}
                </select>
              </div>
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