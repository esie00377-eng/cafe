export type Language = 'en' | 'fa';

export interface BilingualString {
  en: string;
  fa: string;
}

export interface Category {
  id: string;
  name: BilingualString;
  displayOrder: number;
  isSpecial?: boolean;
}

export interface MenuItem {
  id:string;
  name: BilingualString;
  description: BilingualString;
  price: number;
  imageUrl: string;
  categoryId: string;
  displayOrder: number;
}

// --- Theme Types ---
export type ThemeName = 'default' | 'halloween' | 'nowruz' | 'yalda';

export interface ThemeStyles {
  bg: string;
  headerBg: string;
  cardBg: string;
  textColor: string;
  subtleTextColor: string;
  accentColor: string;
  primaryButtonBg: string;
  primaryButtonHoverBg: string;
  tabActive: string;
  tabInactive: string;
}

export interface Theme {
  name: BilingualString;
  styles: ThemeStyles;
}

export interface Themes {
  [key: string]: Theme;
}
// --- End Theme Types ---

export type CategoryDisplayStyle = 'tabs' | 'thumbnails';


export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: AllTranslations;
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeStyles: ThemeStyles;
  cafeName: BilingualString;
  setCafeName: (name: BilingualString) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  categoryDisplayStyle: CategoryDisplayStyle;
  setCategoryDisplayStyle: (style: CategoryDisplayStyle) => void;
}

export interface Translations {
  [key: string]: string;
}

export interface AllTranslations {
  en: Translations;
  fa: Translations;
}