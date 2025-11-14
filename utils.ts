import { Language } from './types';

export const formatPrice = (price: number, language: Language): string => {
  if (language === 'fa') {
    // Intl.NumberFormat for Persian handles digits and separators automatically.
    const numberFormatter = new Intl.NumberFormat('fa-IR', {
      maximumFractionDigits: 2, // Allow up to 2 decimal places, but don't force them.
    });
    return `${numberFormatter.format(price)} تومان`;
  }

  // Intl.NumberFormat for English currency, which handles separators and currency symbol.
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return currencyFormatter.format(price);
};
