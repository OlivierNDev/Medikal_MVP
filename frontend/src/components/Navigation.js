import React from 'react';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { user } = useAuth();

  const getRoleTitle = (role) => {
    switch (role) {
      case 'patient':
        return 'Patient Portal';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'admin':
        return 'Admin Panel';
      case 'ai':
        return 'AI Assistant';
      default:
        return 'Dashboard';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'patient':
        return 'fas fa-user-plus';
      case 'doctor':
        return 'fas fa-user-md';
      case 'admin':
        return 'fas fa-cogs';
      case 'ai':
        return 'fas fa-robot';
      default:
        return 'fas fa-dashboard';
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center py-4">
          <div className="flex items-center space-x-3">
            <i className={`${getRoleIcon(user?.role)} text-purple-600 text-xl`}></i>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{getRoleTitle(user?.role)}</h2>
              <p className="text-sm text-gray-600">Welcome, {user?.username}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;