import React, { useState } from 'react';
import { Category, MenuItem } from '../types';
import { AdminMenuItemManager } from './AdminMenuItemManager';
import { AdminCategoryManager } from './AdminCategoryManager';
import { AdminSettings } from './AdminSettings';
import { useAppContext, useTranslation } from '../context/AppContext';

type AdminView = 'items' | 'categories' | 'settings';

interface AdminPanelProps {
  categories: Category[];
  menuItems: MenuItem[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'displayOrder'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (reordered: Category[]) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'displayOrder'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  reorderMenuItems: (reordered: MenuItem[]) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  const [view, setView] = useState<AdminView>('items');
  const { themeStyles } = useAppContext();
  const t = useTranslation();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 border-b border-gray-200/20">
        <div className="flex space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setView('items')}
            className={`py-2 px-4 rounded-t-lg text-sm font-medium ${
              view === 'items' 
                ? `${themeStyles.primaryButtonBg} text-white` 
                : `${themeStyles.cardBg} ${themeStyles.textColor} opacity-70 hover:opacity-100`
            }`}
          >
            {t('manage_menu_items')}
          </button>
          <button
            onClick={() => setView('categories')}
            className={`py-2 px-4 rounded-t-lg text-sm font-medium ${
              view === 'categories' 
                ? `${themeStyles.primaryButtonBg} text-white` 
                : `${themeStyles.cardBg} ${themeStyles.textColor} opacity-70 hover:opacity-100`
            }`}
          >
            {t('manage_categories')}
          </button>
          <button
            onClick={() => setView('settings')}
            className={`py-2 px-4 rounded-t-lg text-sm font-medium ${
              view === 'settings' 
                ? `${themeStyles.primaryButtonBg} text-white` 
                : `${themeStyles.cardBg} ${themeStyles.textColor} opacity-70 hover:opacity-100`
            }`}
          >
            {t('settings')}
          </button>
        </div>
      </div>
      
      <div className={`${themeStyles.cardBg} p-6 rounded-lg shadow-md`}>
        {view === 'items' && <AdminMenuItemManager {...props} />}
        {view === 'categories' && <AdminCategoryManager {...props} />}
        {view === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};