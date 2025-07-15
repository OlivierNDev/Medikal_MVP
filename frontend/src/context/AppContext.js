import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  currentLanguage: 'en',
  activeSection: 'patient',
  patients: [],
  notifications: [
    {
      id: 1,
      type: 'medication',
      title: 'Medication Reminder',
      message: 'Take Amoxicillin 500mg at 2:00 PM',
      time: '2 hours ago',
      icon: 'fas fa-pills',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Appointment',
      message: 'Follow-up visit tomorrow at 10:00 AM',
      time: '4 hours ago',
      icon: 'fas fa-calendar',
      bgColor: 'bg-green-50',
      textColor: 'text-green-800',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      type: 'lab',
      title: 'Lab Results',
      message: 'Blood test results are ready',
      time: '1 day ago',
      icon: 'fas fa-exclamation-triangle',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    }
  ],
  chatMessages: [
    {
      id: 1,
      type: 'bot',
      message: "Hello! I'm MedikalBot, your AI assistant. I can help you with medical diagnoses, drug interactions, treatment recommendations, and more. What would you like to know?",
      timestamp: new Date()
    }
  ],
  mobileMenuOpen: false,
  currentPatient: {
    name: 'Jean Paul Uwimana',
    age: 34,
    gender: 'Male',
    phone: '+250 788 123 456',
    id: '1234567890123456',
    medicalHistory: [
      { visit: 'Visit 1', date: 'Dec 15, 2023' },
      { visit: 'Visit 2', date: 'Nov 20, 2023' },
      { visit: 'Visit 3', date: 'Oct 10, 2023' }
    ]
  },
  todayQueue: [
    {
      id: 1,
      name: 'Jean Paul Uwimana',
      nationalId: '1234567890123456',
      time: '09:30 AM',
      status: 'current',
      initials: 'JP',
      bgColor: 'bg-green-500',
      borderColor: 'border-green-500'
    },
    {
      id: 2,
      name: 'Marie Uwimana',
      nationalId: '1234567890123457',
      time: '10:00 AM',
      status: 'next',
      initials: 'MU',
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-500'
    },
    {
      id: 3,
      name: 'Alexis Niyongabo',
      nationalId: '1234567890123458',
      time: '10:30 AM',
      status: 'waiting',
      initials: 'AN',
      bgColor: 'bg-gray-400',
      borderColor: 'border-gray-300'
    }
  ]
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_SECTION':
      return { ...state, activeSection: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    case 'CLOSE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: false };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatMessages: [...state.chatMessages, action.payload]
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_PATIENT':
      return {
        ...state,
        patients: [...state.patients, action.payload]
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}