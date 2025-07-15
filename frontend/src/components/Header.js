import React from 'react';
import { useApp } from '../context/AppContext';

function Header() {
  const { state, dispatch } = useApp();
  const { currentLanguage, mobileMenuOpen } = state;

  const handleLanguageChange = (e) => {
    dispatch({ type: 'SET_LANGUAGE', payload: e.target.value });
  };

  const toggleMobileMenu = () => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  };

  const closeMobileMenu = () => {
    dispatch({ type: 'CLOSE_MOBILE_MENU' });
  };

  return (
    <>
      <header className="gradient-bg text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="bg-white p-2 rounded-full">
                <i className="fas fa-heartbeat text-purple-600 text-xl md:text-2xl"></i>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Medikal</h1>
                <p className="text-purple-200 text-sm md:text-base">AI Healthcare System</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <i className="fas fa-language"></i>
                <select 
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  className="bg-white text-gray-800 px-3 py-1 rounded text-sm"
                >
                  <option value="en">English</option>
                  <option value="rw">Kinyarwanda</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-bell relative">
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                </i>
                <i className="fas fa-user-circle text-xl md:text-2xl"></i>
              </div>
              <button 
                onClick={toggleMobileMenu}
                className="md:hidden text-white"
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 md:hidden ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button 
              onClick={closeMobileMenu}
              className="text-gray-600"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <nav className="space-y-2">
            <MobileNavButton 
              section="patient" 
              icon="fas fa-user-plus" 
              text="Patient Portal" 
              closeMobileMenu={closeMobileMenu}
            />
            <MobileNavButton 
              section="doctor" 
              icon="fas fa-user-md" 
              text="Doctor Dashboard" 
              closeMobileMenu={closeMobileMenu}
            />
            <MobileNavButton 
              section="admin" 
              icon="fas fa-cogs" 
              text="Admin Panel" 
              closeMobileMenu={closeMobileMenu}
            />
            <MobileNavButton 
              section="ai" 
              icon="fas fa-robot" 
              text="AI Assistant" 
              closeMobileMenu={closeMobileMenu}
            />
            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <i className="fas fa-language"></i>
                <select 
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm flex-1"
                >
                  <option value="en">English</option>
                  <option value="rw">Kinyarwanda</option>
                </select>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        ></div>
      )}
    </>
  );
}

function MobileNavButton({ section, icon, text, closeMobileMenu }) {
  const { dispatch } = useApp();
  
  const handleClick = () => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: section });
    closeMobileMenu();
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-100 flex items-center"
    >
      <i className={`${icon} mr-3`}></i>{text}
    </button>
  );
}

export default Header;