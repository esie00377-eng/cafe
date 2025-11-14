import { Themes } from './types';

export const themes: Themes = {
  default: {
    name: { en: 'Default', fa: 'پیش‌فرض' },
    styles: {
      bg: 'bg-stone-100',
      headerBg: 'bg-white',
      cardBg: 'bg-white',
      textColor: 'text-stone-800',
      subtleTextColor: 'text-stone-600',
      accentColor: 'text-amber-800',
      primaryButtonBg: 'bg-amber-700',
      primaryButtonHoverBg: 'hover:bg-amber-800',
      tabActive: 'border-amber-600 text-amber-700',
      tabInactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
  },
  halloween: {
    name: { en: 'Halloween', fa: 'هالووین' },
    styles: {
      bg: 'bg-gray-900',
      headerBg: 'bg-gray-800 shadow-orange-500/20',
      cardBg: 'bg-gray-800',
      textColor: 'text-orange-100',
      subtleTextColor: 'text-orange-200/70',
      accentColor: 'text-orange-400',
      primaryButtonBg: 'bg-orange-600',
      primaryButtonHoverBg: 'hover:bg-orange-700',
      tabActive: 'border-orange-500 text-orange-400',
      tabInactive: 'border-transparent text-gray-400 hover:text-orange-400 hover:border-gray-600',
    },
  },
  nowruz: {
    name: { en: 'Nowruz', fa: 'نوروز' },
    styles: {
      bg: 'bg-green-50',
      headerBg: 'bg-white',
      cardBg: 'bg-white',
      textColor: 'text-green-900',
      subtleTextColor: 'text-green-700',
      accentColor: 'text-red-600',
      primaryButtonBg: 'bg-green-600',
      primaryButtonHoverBg: 'hover:bg-green-700',
      tabActive: 'border-green-600 text-green-700',
      tabInactive: 'border-transparent text-gray-500 hover:text-green-700 hover:border-gray-300',
    },
  },
  yalda: {
    name: { en: 'Yalda', fa: 'یلدا' },
    styles: {
      bg: 'bg-red-950',
      headerBg: 'bg-red-900 shadow-yellow-400/20',
      cardBg: 'bg-red-900',
      textColor: 'text-yellow-100',
      subtleTextColor: 'text-yellow-200/70',
      accentColor: 'text-yellow-400',
      primaryButtonBg: 'bg-yellow-600 text-red-950',
      primaryButtonHoverBg: 'hover:bg-yellow-500',
      tabActive: 'border-yellow-500 text-yellow-400',
      tabInactive: 'border-transparent text-gray-300 hover:text-yellow-400 hover:border-gray-500',
    },
  },
};
