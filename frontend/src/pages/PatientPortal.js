import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import VoiceInterface from '../components/VoiceInterface';
import NotificationsList from '../components/NotificationsList';

function PatientPortal() {
  const { state } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    nationalId: '',
    mutualAssistanceNo: '',
    dateOfBirth: '',
    gender: 'Male',
    emergencyContact: ''
  });
  const [skinImage, setSkinImage] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([
    { disease: 'Eczema', confidence: 85, color: 'text-green-600' },
    { disease: 'Dermatitis', confidence: 12, color: 'text-yellow-600' },
    { disease: 'Normal skin', confidence: 3, color: 'text-red-600' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSkinImage(file);
      // Here you would typically send the image to your AI analysis service
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const quickActions = [
    { text: 'Book Appointment', icon: 'fas fa-calendar-plus', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
    { text: 'View Prescriptions', icon: 'fas fa-prescription-bottle', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
    { text: 'Medication Reminders', icon: 'fas fa-bell', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
    { text: 'Medical History', icon: 'fas fa-file-medical', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' }
  ];

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Patient Registration */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              <i className="fas fa-user-plus text-purple-600 mr-2"></i>Patient Registration
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="+250 XXX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National ID</label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1 XXXX X XXXXXXX X XX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mutual Assistance No.</label>
                <input
                  type="text"
                  name="mutualAssistanceNo"
                  value={formData.mutualAssistanceNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter assistance number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Emergency contact name and phone"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-purple-600 text-white py-3 md:py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
                >
                  <i className="fas fa-save mr-2"></i>Register Patient
                </button>
              </div>
            </form>
          </div>

          {/* Skin Disease Analysis */}
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              <i className="fas fa-camera text-purple-600 mr-2"></i>Skin Disease Analysis
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center">
              <i className="fas fa-cloud-upload-alt text-3xl md:text-4xl text-gray-400 mb-4"></i>
              <p className="text-gray-600 mb-4 text-sm md:text-base">Upload image of skin condition for AI analysis</p>
              <input
                type="file"
                id="skinImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById('skinImage').click()}
                className="bg-purple-600 text-white px-6 py-3 md:py-2 rounded-md hover:bg-purple-700 transition duration-200"
              >
                <i className="fas fa-image mr-2"></i>Select Image
              </button>
            </div>
            {skinImage && (
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">AI Analysis Results:</h3>
                <div className="space-y-2">
                  {analysisResults.map((result, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{result.disease}</span>
                      <span className={`text-sm font-medium ${result.color}`}>{result.confidence}% confidence</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Patient Quick Actions */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-tachometer-alt text-purple-600 mr-2"></i>Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className={`w-full ${action.color} py-3 md:py-3 px-4 rounded-md transition duration-200 flex items-center text-sm md:text-base`}
                >
                  <i className={`${action.icon} mr-3`}></i>
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Interface */}
          <VoiceInterface />

          {/* Recent Notifications */}
          <NotificationsList />
        </div>
      </div>
    </section>
  );
}

export default PatientPortal;