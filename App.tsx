import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Header } from './components/Header';
import { CustomerMenu } from './components/CustomerMenu';
import { AdminPanel } from './components/AdminPanel';
import { useMenuData } from './hooks/useMenuData';
import { Login } from './components/Login';

const AppContent: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuData = useMenuData();
  const { themeStyles } = useAppContext();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminView(false); // Go back to customer view on logout
  };

  const renderMainContent = () => {
    if (isAdminView) {
      if (isAuthenticated) {
        return <AdminPanel {...menuData} />;
      } else {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
      }
    } else {
      return <CustomerMenu categories={menuData.categories} menuItems={menuData.menuItems} />;
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      <Header
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main>
        {renderMainContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;