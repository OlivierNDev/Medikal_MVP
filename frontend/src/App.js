import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import PatientPortal from './pages/PatientPortal';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminPanel from './pages/AdminPanel';
import AIAssistant from './pages/AIAssistant';
import Footer from './components/Footer';
import { useApp } from './context/AppContext';

function AppContent() {
  const { state } = useApp();
  const { activeSection } = state;

  const renderActiveSection = () => {
    switch (activeSection) {
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="flex-1">
        {renderActiveSection()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  );
}

export default App;