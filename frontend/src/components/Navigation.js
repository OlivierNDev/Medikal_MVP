import React from 'react';
import { useApp } from '../context/AppContext';

function Navigation() {
  const { state, dispatch } = useApp();
  const { activeSection } = state;

  const navItems = [
    { id: 'patient', icon: 'fas fa-user-plus', text: 'Patient Portal' },
    { id: 'doctor', icon: 'fas fa-user-md', text: 'Doctor Dashboard' },
    { id: 'admin', icon: 'fas fa-cogs', text: 'Admin Panel' },
    { id: 'ai', icon: 'fas fa-robot', text: 'AI Assistant' }
  ];

  const handleNavClick = (sectionId) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: sectionId });
  };

  return (
    <nav className="bg-white shadow-md hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 md:space-x-8 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-tab py-3 md:py-4 px-4 md:px-6 border-b-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors duration-200 ${
                activeSection === item.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-purple-600'
              }`}
            >
              <i className={`${item.icon} mr-2`}></i>
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;