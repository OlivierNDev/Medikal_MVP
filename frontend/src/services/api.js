import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

// Patient API
export const patientAPI = {
  create: async (patientData) => {
    const response = await api.post('/api/patients', patientData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/patients');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/patients/${id}`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get(`/api/patients/search/${query}`);
    return response.data;
  },
};

// Consultation API
export const consultationAPI = {
  create: async (consultationData) => {
    const response = await api.post('/api/consultations', consultationData);
    return response.data;
  },

  getPatientConsultations: async (patientId) => {
    const response = await api.get(`/api/consultations/patient/${patientId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/consultations/${id}`);
    return response.data;
  },

  update: async (id, consultationData) => {
    const response = await api.put(`/api/consultations/${id}`, consultationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/consultations/${id}`);
    return response.data;
  },
};

// AI API
export const aiAPI = {
  getDiagnosis: async (diagnosisData) => {
    const response = await api.post('/api/ai/diagnosis', diagnosisData);
    return response.data;
  },

  chat: async (message, sessionId, language = 'en') => {
    const response = await api.post('/api/ai/chat', {
      message,
      session_id: sessionId,
      language,
    });
    return response.data;
  },

  analyzeSkinImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post('/api/ai/skin-analysis', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getChatHistory: async (sessionId) => {
    const response = await api.get(`/api/ai/chat/history/${sessionId}`);
    return response.data;
  },

  getAMRRisk: async (patientId) => {
    const response = await api.get(`/api/ai/amr/risk/${patientId}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/api/health');
  return response.data;
};

export default api;