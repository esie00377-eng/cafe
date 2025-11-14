import React, { useState } from 'react';
import { Category, ThemeStyles } from '../types';
import { CategoryForm } from './CategoryForm';
import { useAppContext, useTranslation } from '../context/AppContext';
import { PencilIcon } from './icons/PencilIcon';
import { TrashIcon } from './icons/TrashIcon';
import { PlusIcon } from './icons/PlusIcon';
import { StarIcon } from './icons/StarIcon';
import { DragHandleIcon } from './icons/DragHandleIcon';

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

interface AdminCategoryManagerProps {
  categories: Category[];
  isLoading: boolean;
  addCategory: (category: Omit<Category, 'id' | 'displayOrder'>) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (reordered: Category[]) => Promise<void>;
}

export const AdminCategoryManager: React.FC<AdminCategoryManagerProps> = ({
  categories,
  isLoading,
  addCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const { language, themeStyles } = useAppContext();
  const t = useTranslation();

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    // The confirmation dialog might be causing issues in some environments.
    // For now, we make deletion immediate to ensure functionality.
    // A custom modal could be a future enhancement.
    setDeletingId(id);
    await deleteCategory(id);
    setDeletingId(null);
  };

  const handleSave = async (category: Omit<Category, 'id' | 'displayOrder'> | Category) => {
    setIsSubmitting(true);
    if ('id' in category) {
      await updateCategory(category as Category);
    } else {
      await addCategory(category);
    }
    setIsSubmitting(false);
    setIsModalOpen(false);
  };
  
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

    const sourceIndex = sortedCategories.findIndex(c => c.id === sourceId);
    const targetIndex = sortedCategories.findIndex(c => c.id === targetId);

    const newList = [...sortedCategories];
    const [removed] = newList.splice(sourceIndex, 1);
    newList.splice(targetIndex, 0, removed);
    
    reorderCategories(newList);
    setDraggedId(null);
    setDragOverId(null);
  };

  if (isLoading) {
    return <TableSkeletonLoader themeStyles={themeStyles} colCount={3} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${themeStyles.textColor}`}>{t('manage_categories')}</h2>
        <button
          onClick={handleAddNew}
          className={`flex items-center gap-2 text-white px-4 py-2 rounded-md transition ${themeStyles.primaryButtonBg} ${themeStyles.primaryButtonHoverBg}`}
        >
          <PlusIcon className="w-5 h-5" />
          <span>{t('add_new_category')}</span>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className={`min-w-full border-separate border-spacing-0 ${themeStyles.textColor}`}>
          <thead className={`${themeStyles.cardBg} opacity-80`}>
            <tr>
              <th className="py-3 px-1 w-10 border-b border-gray-500/20 text-start text-sm font-semibold"></th>
              <th className="py-3 px-4 border-b border-gray-500/20 text-start text-sm font-semibold">{t('name')}</th>
              <th className="py-3 px-4 border-b border-gray-500/20 text-start text-sm font-semibold">{t('actions')}</th>
            </tr>
          </thead>
          <tbody onDragLeave={handleDragLeave}>
            {sortedCategories.length > 0 ? sortedCategories.map(category => {
              const isDragging = draggedId === category.id;
              const isDragOver = dragOverId === category.id;
              return (
              <tr 
                key={category.id} 
                draggable="true"
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragOver={(e) => handleDragOver(e, category.id)}
                onDrop={(e) => handleDrop(e, category.id)}
                className={`
                  transition-all 
                  ${deletingId === category.id ? 'opacity-30' : ''}
                  ${isDragging ? 'opacity-40' : ''}
                  ${isDragOver ? `border-y-2 border-amber-500` : ''}
                `}
              >
                <td className="py-3 px-1 border-b border-gray-500/20 cursor-move">
                    <DragHandleIcon className="w-5 h-5 mx-auto text-gray-400" />
                </td>
                <td className="py-3 px-4 border-b border-gray-500/20">
                  <div className="flex items-center gap-2">
                    {category.name[language]}
                    {category.isSpecial && <StarIcon className={`w-4 h-4 ${themeStyles.accentColor}`} title={t('chefs_specials')} />}
                  </div>
                </td>
                <td className="py-3 px-4 border-b border-gray-500/20">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <button onClick={() => handleEdit(category)} disabled={!!deletingId} className="text-blue-400 hover:text-blue-300 p-1 disabled:opacity-50 disabled:cursor-not-allowed"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(category.id)} disabled={!!deletingId} className="text-red-500 hover:text-red-400 p-1 disabled:opacity-50 disabled:cursor-not-allowed"><TrashIcon className="w-5 h-5"/></button>
                  </div>
                </td>
              </tr>
            )}) : (
                <tr>
                    <td colSpan={3} className="text-center py-8">{t('no_categories')}</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};