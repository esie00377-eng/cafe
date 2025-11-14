import React, { useState, useMemo } from 'react';
import { Category, MenuItem } from '../types';
import { useAppContext, useTranslation } from '../context/AppContext';
import { formatPrice } from '../utils';
import { StarIcon } from './icons/StarIcon';

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { language, themeStyles } = useAppContext();

  return (
    <div className={`rounded-lg overflow-hidden transition-transform duration-300 hover:-translate-y-1 shadow-lg ${themeStyles.cardBg}`}>
        <div className="relative">
             <img className="w-full h-32 object-cover sm:h-40" src={item.imageUrl} alt={item.name[language]} />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
             <div className={`absolute bottom-2 right-2 px-2.5 py-1 rounded-full text-white text-sm font-bold ${themeStyles.primaryButtonBg}`}>
                {formatPrice(item.price, language)}
             </div>
        </div>
      <div className="p-3 sm:p-4">
        <h3 className={`text-base sm:text-lg font-bold mb-1 truncate ${themeStyles.accentColor}`}>
          {item.name[language]}
        </h3>
        <p className={`text-sm h-12 overflow-hidden ${themeStyles.subtleTextColor}`}>
          {item.description[language]}
        </p>
      </div>
    </div>
  );
};


interface CategorySelectorProps {
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
}

// New component for classic tab-based navigation
const CategoryTabs: React.FC<CategorySelectorProps> = ({ categories, selectedCategoryId, setSelectedCategoryId }) => {
  const { language, themeStyles } = useAppContext();
  const t = useTranslation();

  return (
    <div className="mb-8 border-b border-gray-500/20">
      <div className="flex items-center space-x-4 rtl:space-x-reverse overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" aria-label="Category Filters">
        <button
          onClick={() => setSelectedCategoryId(null)}
          aria-pressed={selectedCategoryId === null}
          className={`py-3 px-4 whitespace-nowrap text-sm font-medium border-b-2 transition-colors
            ${selectedCategoryId === null ? themeStyles.tabActive : themeStyles.tabInactive}`}
        >
          {t('all')}
        </button>
        {categories.map((category) => {
          const isActive = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              aria-pressed={isActive}
              className={`py-3 px-4 whitespace-nowrap text-sm font-medium border-b-2 transition-colors flex items-center gap-2
                ${isActive ? themeStyles.tabActive : themeStyles.tabInactive}`}
            >
              {category.name[language]}
              {category.isSpecial && <StarIcon className="w-4 h-4 text-yellow-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Renamed from CategoryTabs to CategoryThumbnails
const CategoryThumbnails: React.FC<CategorySelectorProps> = ({ categories, menuItems, selectedCategoryId, setSelectedCategoryId }) => {
  const { language, themeStyles } = useAppContext();
  const t = useTranslation();

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 rtl:space-x-reverse overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8" aria-label="Category Filters">
         {/* "All" button */}
        <button
          onClick={() => setSelectedCategoryId(null)}
          aria-pressed={selectedCategoryId === null}
          className={`group flex-shrink-0 w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-200 shadow-md focus:outline-none
            ${selectedCategoryId === null
              ? `${themeStyles.primaryButtonBg} text-white ring-2 ring-offset-2 ring-amber-500 ring-offset-transparent`
              : `${themeStyles.cardBg} ${themeStyles.textColor} hover:bg-gray-500/10`
            }`}
        >
          <span className="text-sm font-bold">{t('all')}</span>
        </button>

        {/* Category buttons */}
        {categories.map((category) => {
          const categoryImage = menuItems.find(item => item.categoryId === category.id)?.imageUrl;
          const isActive = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              aria-pressed={isActive}
              className={`group relative flex-shrink-0 w-20 h-20 rounded-full text-white text-xs font-bold text-center p-1 flex items-center justify-center overflow-hidden transition-all duration-200 shadow-md focus:outline-none
                ${isActive ? 'ring-2 ring-offset-2 ring-amber-500 ring-offset-transparent' : ''}
              `}
            >
              {/* Background Image */}
              {categoryImage ? (
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundImage: `url(${categoryImage})` }}></div>
              ) : (
                <div className={`absolute inset-0 ${themeStyles.primaryButtonBg} opacity-50`}></div>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors"></div>
              {/* Text */}
              <span className="relative z-10">{category.name[language]}</span>
              {/* Special Icon */}
              {category.isSpecial && <StarIcon className={`absolute top-1.5 right-1.5 w-4 h-4 text-yellow-300 drop-shadow-md`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};


interface CustomerMenuProps {
  categories: Category[];
  menuItems: MenuItem[];
}

export const CustomerMenu: React.FC<CustomerMenuProps> = ({ categories, menuItems }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { themeStyles, categoryDisplayStyle } = useAppContext();
  const t = useTranslation();

  const sortedCategories = useMemo(() => [...categories].sort((a, b) => a.displayOrder - b.displayOrder), [categories]);
  const sortedItems = useMemo(() => [...menuItems].sort((a, b) => a.displayOrder - b.displayOrder), [menuItems]);

  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) return sortedItems;
    return sortedItems.filter(item => item.categoryId === selectedCategoryId);
  }, [selectedCategoryId, sortedItems]);

  const categoryProps = {
    categories: sortedCategories,
    menuItems: sortedItems,
    selectedCategoryId,
    setSelectedCategoryId
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {categoryDisplayStyle === 'thumbnails' ? (
        <CategoryThumbnails {...categoryProps} />
      ) : (
        <CategoryTabs {...categoryProps} />
      )}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredItems.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className={`text-lg ${themeStyles.subtleTextColor}`}>{t('no_items')}</p>
        </div>
      )}
    </div>
  );
};