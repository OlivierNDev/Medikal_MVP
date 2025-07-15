import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { state, dispatch } = useApp();
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'patient':
        return 'fas fa-user';
      case 'doctor':
        return 'fas fa-user-md';
      case 'admin':
        return 'fas fa-user-shield';
      case 'ai':
        return 'fas fa-robot';
      default:
        return 'fas fa-user';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'patient':
        return 'bg-blue-100 text-blue-800';
      case 'doctor':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'ai':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
              
              {/* User Info */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role)}`}>
                    {user?.role}
                  </span>
                </div>
                <div className="relative">
                  <i className={`${getRoleIcon(user?.role)} text-xl md:text-2xl`}></i>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <i className="fas fa-bell relative">
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                </i>
                <button 
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition duration-200"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </button>
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
          
          {/* Mobile User Info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <i className={`${getRoleIcon(user?.role)} text-gray-600 text-xl`}></i>
              <div>
                <p className="font-medium text-gray-800">{user?.username}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user?.role)}`}>
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2 mb-4">
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
            
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-200"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
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

export default Header;