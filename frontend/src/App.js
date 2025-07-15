import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import PatientPortal from './pages/PatientPortal';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminPanel from './pages/AdminPanel';
import AIAssistant from './pages/AIAssistant';
import Footer from './components/Footer';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  // Role-based dashboard routing
  const renderDashboard = () => {
    switch (user?.role) {
      case 'patient':
        return <PatientPortal />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'admin':
        return <AdminPanel />;
      case 'ai':
        return <AIAssistant />;
      default:
        return <PatientPortal />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <main className="flex-1">
          {renderDashboard()}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;