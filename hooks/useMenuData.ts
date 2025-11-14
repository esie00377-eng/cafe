import { useState, useEffect } from 'react';
import { Category, MenuItem } from '../types';

// --- LocalStorage Keys ---
const LS_PREFIX = 'bilingual-menu-';
const LS_CATEGORIES_KEY = `${LS_PREFIX}categories`;
const LS_MENU_ITEMS_KEY = `${LS_PREFIX}menuItems`;
// --- End LocalStorage Keys ---

const initialCategories: Category[] = [
  { id: '1', name: { en: 'Hot Coffees', fa: 'قهوه‌های گرم' }, displayOrder: 0 },
  { id: '2', name: { en: 'Cakes & Pastries', fa: 'کیک و شیرینی' }, displayOrder: 1 },
  { id: '3', name: { en: 'Cold Drinks', fa: 'نوشیدنی‌های سرد' }, displayOrder: 2 },
  { id: '4', name: { en: 'Chef\'s Specials', fa: 'ویژه سرآشپز' }, isSpecial: true, displayOrder: 3 },
];

const initialMenuItems: MenuItem[] = [
  // Hot Coffees
  {
    id: '101',
    name: { en: 'Espresso', fa: 'اسپرسو' },
    description: { en: 'A concentrated coffee beverage brewed by forcing a small amount of nearly boiling water under pressure through finely-ground coffee beans.', fa: 'یک نوشیدنی قهوه غلیظ که با عبور دادن آب نزدیک به جوش با فشار از میان دانه‌های قهوه آسیاب شده تهیه می‌شود.' },
    price: 2.50,
    imageUrl: 'https://images.unsplash.com/photo-1579992302924-635a7c5c3818?q=80&w=800',
    categoryId: '1',
    displayOrder: 0,
  },
  {
    id: '102',
    name: { en: 'Latte', fa: 'لاته' },
    description: { en: 'A coffee drink made with espresso and steamed milk, with a thin layer of foam.', fa: 'یک نوشیدنی قهوه که با اسپرسو و شیر بخار داده شده و لایه‌ای نازک از کف تهیه می‌شود.' },
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1561882468-91101f2e5f87?q=80&w=800',
    categoryId: '1',
    displayOrder: 1,
  },
  {
    id: '103',
    name: { en: 'Cappuccino', fa: 'کاپوچینو' },
    description: { en: 'An espresso-based coffee drink that originated in Italy, and is traditionally prepared with steamed milk foam.', fa: 'یک نوشیدنی قهوه ایتالیایی بر پایه اسپرسو که به طور سنتی با کف شیر بخار داده شده تهیه می‌شود.' },
    price: 3.50,
    imageUrl: 'https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?q=80&w=800',
    categoryId: '1',
    displayOrder: 2,
  },
  {
    id: '104',
    name: { en: 'Mocha', fa: 'موکا' },
    description: { en: 'A chocolate-flavoured variant of a caffè latte.', fa: 'نوعی لاته با طعم شکلات.' },
    price: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1542287447-098871383578?q=80&w=800',
    categoryId: '1',
    displayOrder: 3,
  },
  // Cakes & Pastries
  {
    id: '201',
    name: { en: 'Chocolate Cake', fa: 'کیک شکلاتی' },
    description: { en: 'A rich and moist chocolate cake, perfect for any occasion.', fa: 'یک کیک شکلاتی غنی و مرطوب، عالی برای هر مناسبتی.' },
    price: 4.00,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800',
    categoryId: '2',
    displayOrder: 4,
  },
  {
    id: '202',
    name: { en: 'Croissant', fa: 'کروسان' },
    description: { en: 'A buttery, flaky, viennoiserie pastry named for its historical crescent shape.', fa: 'یک شیرینی کره‌ای و لایه‌ای به شکل هلال ماه.' },
    price: 2.75,
    imageUrl: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800',
    categoryId: '2',
    displayOrder: 5,
  },
   {
    id: '203',
    name: { en: 'Cheesecake', fa: 'چیزکیک' },
    description: { en: 'A sweet dessert consisting of one or more layers. The main, and thickest, layer consists of a mixture of soft, fresh cheese.', fa: 'یک دسر شیرین شامل یک یا چند لایه که لایه اصلی و ضخیم آن از مخلوطی از پنیر نرم و تازه تشکیل شده است.' },
    price: 4.50,
    imageUrl: 'https://images.unsplash.com/photo-1534401391509-d75d750c8b2a?q=80&w=800',
    categoryId: '2',
    displayOrder: 6,
  },
  // Cold Drinks
  {
    id: '301',
    name: { en: 'Iced Americano', fa: 'آیس آمریکانو' },
    description: { en: 'Espresso shots topped with cold water produce a light layer of crema, then served over ice.', fa: 'شات‌های اسپرسو که با آب سرد ترکیب شده و روی یخ سرو می‌شود.' },
    price: 3.00,
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-4e4b7da16931?q=80&w=800',
    categoryId: '3',
    displayOrder: 7,
  },
  {
    id: '302',
    name: { en: 'Cold Brew', fa: 'کلد برو' },
    description: { en: 'A coffee concentrate made by steeping coarsely ground coffee beans in cold water for several hours.', fa: 'یک کنسانتره قهوه که با خیساندن دانه‌های قهوه درشت آسیاب شده در آب سرد برای چندین ساعت تهیه می‌شود.' },
    price: 4.25,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a07d763f08c5?q=80&w=800',
    categoryId: '3',
    displayOrder: 8,
  },
    {
    id: '303',
    name: { en: 'Fresh Orange Juice', fa: 'آب پرتقال طبیعی' },
    description: { en: 'Squeezed from fresh oranges, a classic refreshing drink.', fa: 'گرفته شده از پرتقال‌های تازه، یک نوشیدنی کلاسیک و طراوت‌بخش.' },
    price: 3.75,
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800',
    categoryId: '3',
    displayOrder: 9,
  },
  // Chef's Specials
  {
    id: '401',
    name: { en: 'Affogato', fa: 'آفوگاتو' },
    description: { en: 'A scoop of vanilla gelato or ice cream drowned with a shot of hot espresso.', fa: 'یک اسکوپ بستنی وانیلی که در یک شات اسپرسوی داغ غرق شده است.' },
    price: 5.50,
    imageUrl: 'https://images.unsplash.com/photo-1629587421389-a2e6cb1a8027?q=80&w=800',
    categoryId: '4',
    displayOrder: 10,
  },
  {
    id: '402',
    name: { en: 'Tiramisu', fa: 'تیرامیسو' },
    description: { en: 'A coffee-flavoured Italian dessert. It is made of ladyfingers dipped in coffee, layered with a whipped mixture of eggs, sugar and mascarpone cheese, flavoured with cocoa.', fa: 'یک دسر ایتالیایی با طعم قهوه، ساخته شده از بیسکویت‌های لیدی فینگر آغشته به قهوه و لایه‌هایی از مخلوط تخم‌مرغ، شکر و پنیر ماسکارپونه، با طعم کاکائو.' },
    price: 6.00,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800',
    categoryId: '4',
    displayOrder: 11,
  },
];

const SIMULATED_DELAY = 500; // ms

export const useMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or use initial data
    setIsLoading(true);
    try {
        const storedCategories = localStorage.getItem(LS_CATEGORIES_KEY);
        const storedMenuItems = localStorage.getItem(LS_MENU_ITEMS_KEY);

        if (storedCategories && storedMenuItems) {
            setCategories(JSON.parse(storedCategories));
            setMenuItems(JSON.parse(storedMenuItems));
        } else {
            // Seed localStorage with initial data
            setCategories(initialCategories);
            setMenuItems(initialMenuItems);
            localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(initialCategories));
            localStorage.setItem(LS_MENU_ITEMS_KEY, JSON.stringify(initialMenuItems));
        }
    } catch (error) {
        console.error("Failed to load menu data from localStorage", error);
        // Fallback to initial data if localStorage is corrupt
        setCategories(initialCategories);
        setMenuItems(initialMenuItems);
    } finally {
        // Simulate a short delay for better UX
        setTimeout(() => setIsLoading(false), 800);
    }
  }, []);


  // Category CRUD
  const addCategory = (category: Omit<Category, 'id' | 'displayOrder'>): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setCategories(prev => {
                const maxOrder = prev.length > 0 ? Math.max(...prev.map(c => c.displayOrder)) : -1;
                const newCategory = { ...category, id: Date.now().toString(), displayOrder: maxOrder + 1 };
                const updated = [...prev, newCategory];
                localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(updated));
                return updated;
            });
            resolve();
        }, SIMULATED_DELAY);
    });
  };

  const updateCategory = (updatedCategory: Category): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setCategories(prev => {
                const updated = prev.map(c => c.id === updatedCategory.id ? updatedCategory : c);
                localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(updated));
                return updated;
            });
            resolve();
        }, SIMULATED_DELAY);
    });
  };

  const deleteCategory = (categoryId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setCategories(prev => {
                const updated = prev.filter(c => c.id !== categoryId);
                localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(updated));
                return updated;
            });
            // Also delete items in that category
            setMenuItems(prev => {
                const updated = prev.filter(item => item.categoryId !== categoryId);
                localStorage.setItem(LS_MENU_ITEMS_KEY, JSON.stringify(updated));
                return updated;
            });
            resolve();
        }, SIMULATED_DELAY);
    });
  };
  
  const reorderCategories = (reordered: Category[]): Promise<void> => {
    return new Promise(resolve => {
        const updatedCategories = reordered.map((c, index) => ({...c, displayOrder: index}));
        setCategories(updatedCategories);
        localStorage.setItem(LS_CATEGORIES_KEY, JSON.stringify(updatedCategories));
        resolve();
    });
  };

  // Menu Item CRUD
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'displayOrder'>): Promise<void> => {
     return new Promise(resolve => {
        setTimeout(() => {
            setMenuItems(prev => {
                const maxOrder = prev.length > 0 ? Math.max(...prev.map(i => i.displayOrder)) : -1;
                const newItem = { ...item, id: Date.now().toString(), displayOrder: maxOrder + 1 };
                const updated = [...prev, newItem];
                localStorage.setItem(LS_MENU_ITEMS_KEY, JSON.stringify(updated));
                return updated;
            });
            resolve();
        }, SIMULATED_DELAY);
    });
  };

  const updateMenuItem = (updatedItem: MenuItem): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setMenuItems(prev => {
                const updated = prev.map(item => item.id === updatedItem.id ? updatedItem : item);
                localStorage.setItem(LS_MENU_ITEMS_KEY, JSON.stringify(updated));
                return updated;
            });
            resolve();
        }, SIMULATED_DELAY);
    });
  };

  const deleteMenuItem = (itemId: string): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            setMenuItems(prev => {
                const updated = prev.filter(item => item.id !== itemId);
                localStorage.setItem(LS_MENU_ITEMS_KEY, JSON.stringify(updated));
                return updated;
            });
            resolve();
        }, SIMULATED_DELAY);
    });
  };

  const reorderMenuItems = (reordered: MenuItem[]): Promise<void> => {
    return new Promise(resolve => {
        const updatedItems = reordered.map((item, index) => ({...item, displayOrder: index}));
        setMenuItems(updatedItems);
        localStorage.setItem(LS_MENU_ITEMS_KEY, JSON.stringify(updatedItems));
        resolve();
    });
  };

  return {
    categories,
    menuItems,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    reorderMenuItems,
  };
};