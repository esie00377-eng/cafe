import React, { useState, useMemo } from 'react';
import { Category, MenuItem } from '../types';
import { MenuItemForm } from './MenuItemForm';
import { useAppContext, useTranslation } from '../context/AppContext';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { DragHandleIcon } from './icons/DragHandleIcon';
import { formatPrice } from '../utils';
import { ThemeStyles } from '../types';

const TableSkeletonLoader: React.FC<{ themeStyles: ThemeStyles; colCount: number }> = ({ themeStyles, colCount }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full border-separate border-spacing-0 ${themeStyles.textColor}`}>
      <thead className={`${themeStyles.cardBg} opacity-80`}>
        <tr>
          {Array.from({ length: colCount }).map((_, i) => (
            <th key={i} className="py-3 px-4 border-b border-gray-500/20 text-start">
              <div className="h-4 bg-gray-500/30 rounded animate-pulse w-3/4"></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <tr key={rowIndex}>
            {Array.from({ length: colCount }).map((_, colIndex) => (
              <td key={colIndex} className="py-3 px-4 border-b border-gray-500/20">
                <div className="h-4 bg-gray-500/20 rounded animate-pulse"></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

interface AdminMenuItemManagerProps {
  categories: Category[];
  menuItems: MenuItem[];
  isLoading: boolean;
  addMenuItem: (item: Omit<MenuItem, 'id' | 'displayOrder'>) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  reorderMenuItems: (reordered: MenuItem[]) => Promise<void>;
}

export const AdminMenuItemManager: React.FC<AdminMenuItemManagerProps> = ({
  categories,
  menuItems,
  isLoading,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  reorderMenuItems,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const { language, themeStyles } = useAppContext();
  const t = useTranslation();

  const handleAddNew = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // The confirmation dialog might be causing issues in some environments.
    // For now, we make deletion immediate to ensure functionality.
    // A custom modal could be a future enhancement.
    setDeletingId(id);
    await deleteMenuItem(id);
    setDeletingId(null);
  };

  const handleSave = async (item: Omit<MenuItem, 'id' | 'displayOrder'> | MenuItem) => {
    setIsSubmitting(true);
    if ('id' in item) {
      await updateMenuItem(item as MenuItem);
    } else {
      await addMenuItem(item);
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const filteredMenuItems = useMemo(() => {
    const sorted = [...menuItems].sort((a, b) => a.displayOrder - b.displayOrder);
    if (!searchQuery) {
      return sorted;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return sorted.filter(item =>
      item.name.en.toLowerCase().includes(lowercasedQuery) ||
      item.name.fa.toLowerCase().includes(lowercasedQuery)
    );
  }, [menuItems, searchQuery]);
  
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) {
        setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain');
    if (sourceId === targetId) return;

    const fullSortedList = [...menuItems].sort((a, b) => a.displayOrder - b.displayOrder);
    const sourceIndex = fullSortedList.findIndex(i => i.id === sourceId);
    const targetIndex = fullSortedList.findIndex(i => i.id === targetId);
    
    if (sourceIndex === -1 || targetIndex === -1) return;

    const newList = [...fullSortedList];
    const [removed] = newList.splice(sourceIndex, 1);
    newList.splice(targetIndex, 0, removed);
    
    reorderMenuItems(newList);
    setDraggedId(null);
    setDragOverId(null);
  };


  if (isLoading) {
    return <TableSkeletonLoader themeStyles={themeStyles} colCount={5} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${themeStyles.textColor}`}>{t('manage_menu_items')}</h2>
        <button
          onClick={handleAddNew}
          className={`flex items-center gap-2 text-white px-4 py-2 rounded-md transition ${themeStyles.primaryButtonBg} ${themeStyles.primaryButtonHoverBg}`}
        >
          <PlusIcon className="w-5 h-5" />
          <span>{t('add_new_item')}</span>
        </button>
      </div>

      <div className="mb-4">
        <input
            type="text"
            placeholder={t('search_by_name')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full max-w-sm rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${themeStyles.cardBg} ${themeStyles.textColor} border-gray-400/50`}
        />
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full border-separate border-spacing-0 ${themeStyles.textColor}`}>
          <thead className={`${themeStyles.cardBg} opacity-80`}>
            <tr>
              <th className="py-3 px-1 w-10 border-b border-gray-500/20 text-start text-sm font-semibold"></th>
              <th className="py-3 px-4 border-b border-gray-500/20 text-start text-sm font-semibold">{t('name')}</th>
              <th className="py-3 px-4 border-b border-gray-500/20 text-start text-sm font-semibold">{t('category')}</th>
              <th className="py-3 px-4 border-b border-gray-500/20 text-start text-sm font-semibold">{t('price')}</th>
              <th className="py-3 px-4 border-b border-gray-500/20 text-start text-sm font-semibold">{t('actions')}</th>
            </tr>
          </thead>
          <tbody onDragLeave={handleDragLeave}>
            {filteredMenuItems.length > 0 ? filteredMenuItems.map(item => {
              const category = categories.find(c => c.id === item.categoryId);
              const isDragging = draggedId === item.id;
              const isDragOver = dragOverId === item.id;
              return (
                <tr 
                  key={item.id} 
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDrop={(e) => handleDrop(e, item.id)}
                  className={`
                    transition-all 
                    ${deletingId === item.id ? 'opacity-30' : ''}
                    ${isDragging ? 'opacity-40' : ''}
                    ${isDragOver ? `border-y-2 border-amber-500` : ''}
                  `}
                >
                  <td className="py-3 px-1 border-b border-gray-500/20 cursor-move">
                    <DragHandleIcon className="w-5 h-5 mx-auto text-gray-400" />
                  </td>
                  <td className="py-3 px-4 border-b border-gray-500/20">{item.name[language]}</td>
                  <td className="py-3 px-4 border-b border-gray-500/20">{category ? category.name[language] : 'N/A'}</td>
                  <td className="py-3 px-4 border-b border-gray-500/20">{formatPrice(item.price, language)}</td>
                  <td className="py-3 px-4 border-b border-gray-500/20">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button onClick={() => handleEdit(item)} disabled={!!deletingId} className="text-blue-400 hover:text-blue-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"><PencilIcon className="w-5 h-5"/></button>
                      <button onClick={() => handleDelete(item.id)} disabled={!!deletingId} className="text-red-500 hover:text-red-400 p-1 disabled:opacity-50 disabled:cursor-not-allowed"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
                <tr>
                    <td colSpan={5} className="text-center py-8">
                        {menuItems.length === 0 ? t('no_items_in_db') : t('no_items_match_search')}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <MenuItemForm
          item={editingItem}
          categories={categories}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};