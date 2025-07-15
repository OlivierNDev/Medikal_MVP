import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function DoctorDashboard() {
  const { state } = useApp();
  const { todayQueue, currentPatient } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [icdCode, setIcdCode] = useState('');
  const [medications, setMedications] = useState([
    { name: 'Amoxicillin 500mg', dosage: '3 times daily', duration: '7 days' }
  ]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    duration: ''
  });

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.duration) {
      setMedications([...medications, newMedication]);
      setNewMedication({ name: '', dosage: '', duration: '' });
    }
  };

  const handleRemoveMedication = (index) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'current':
        return 'bg-green-100 text-green-800';
      case 'next':
        return 'bg-yellow-100 text-yellow-800';
      case 'waiting':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'current':
        return 'Current';
      case 'next':
        return 'Next';
      case 'waiting':
        return 'Waiting';
      default:
        return 'Waiting';
    }
  };

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Patient Search & Queue */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              <i className="fas fa-search text-purple-600 mr-2"></i>Patient Search & Queue
            </h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, phone, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 md:py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button className="bg-purple-600 text-white px-6 py-3 md:py-2 rounded-md hover:bg-purple-700 transition duration-200">
                <i className="fas fa-search"></i>
              </button>
            </div>
            
            {/* Today's Queue */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Today's Queue ({todayQueue.length} patients)</h3>
              <div className="space-y-3">
                {todayQueue.map((patient) => (
                  <div
                    key={patient.id}
                    className={`flex items-center justify-between bg-white p-3 rounded border-l-4 ${patient.borderColor}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${patient.bgColor} rounded-full flex items-center justify-center text-white font-bold`}>
                        {patient.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm md:text-base">{patient.name}</p>
                        <p className="text-xs md:text-sm text-gray-600">ID: {patient.nationalId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs md:text-sm text-gray-600">{patient.time}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(patient.status)}`}>
                        {getStatusText(patient.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Details & Consultation */}
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
              <i className="fas fa-user-circle text-purple-600 mr-2"></i>Patient Consultation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Patient Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {currentPatient.name}</p>
                  <p><span className="font-medium">Age:</span> {currentPatient.age} years</p>
                  <p><span className="font-medium">Gender:</span> {currentPatient.gender}</p>
                  <p><span className="font-medium">Phone:</span> {currentPatient.phone}</p>
                  <p><span className="font-medium">ID:</span> {currentPatient.id}</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Medical History</h4>
                  <div className="space-y-1 text-sm">
                    {currentPatient.medicalHistory.map((visit, index) => (
                      <button
                        key={index}
                        className="text-blue-600 hover:underline flex items-center w-full text-left"
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        {visit.visit} - {visit.date}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Current Symptoms</h3>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-20 md:h-24"
                  placeholder="Enter patient symptoms and complaints..."
                />
                
                <h3 className="font-semibold text-gray-800 mt-4 mb-3">Diagnosis</h3>
                <input
                  type="text"
                  placeholder="ICD-10 Code"
                  value={icdCode}
                  onChange={(e) => setIcdCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-16 md:h-20"
                  placeholder="Diagnosis details..."
                />
              </div>
            </div>

            {/* Prescription */}
            <div className="mt-6 border-t pt-6">
              <h3 className="font-semibold text-gray-800 mb-3">Prescription</h3>
              <div className="space-y-3">
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <input
                    type="text"
                    placeholder="Medication name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={newMedication.dosage}
                    onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                    className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration"
                    value={newMedication.duration}
                    onChange={(e) => setNewMedication({...newMedication, duration: e.target.value})}
                    className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={handleAddMedication}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                <div className="space-y-2">
                  {medications.map((medication, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm md:text-base">
                          {medication.name} - {medication.dosage} - {medication.duration}
                        </span>
                        <button
                          onClick={() => handleRemoveMedication(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <button className="bg-purple-600 text-white px-6 py-3 md:py-2 rounded-md hover:bg-purple-700 transition duration-200">
                <i className="fas fa-save mr-2"></i>Save Consultation
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 md:py-2 rounded-md hover:bg-blue-700 transition duration-200">
                <i className="fas fa-print mr-2"></i>Print Prescription
              </button>
            </div>
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-robot text-purple-600 mr-2"></i>AI Assistant
            </h3>
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <h4 className="font-semibold text-purple-800 mb-2">Diagnostic Suggestions</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <i className="fas fa-check text-green-600 mr-2"></i>
                    Upper respiratory infection (85%)
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-yellow-600 mr-2"></i>
                    Allergic rhinitis (15%)
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2">Medication Recommendations</h4>
                <ul className="text-sm space-y-1">
                  <li>• Amoxicillin 500mg TID x 7 days</li>
                  <li>• Paracetamol 500mg PRN for fever</li>
                  <li>• Plenty of fluids and rest</li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <h4 className="font-semibold text-red-800 mb-2">AMR Alert</h4>
                <p className="text-sm text-red-700">
                  Patient has received 3 antibiotic courses in the past 3 months. Consider culture test.
                </p>
              </div>
            </div>
          </div>

          {/* Voice Recording */}
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              <i className="fas fa-microphone text-purple-600 mr-2"></i>Voice Notes
            </h3>
            <div className="text-center">
              <button className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition duration-200 mb-3">
                <i className="fas fa-microphone"></i>
              </button>
              <p className="text-sm text-gray-600">Record consultation notes</p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <span className="text-sm">Recording 1 (2:34)</span>
                <button className="text-blue-600 hover:text-blue-800">
                  <i className="fas fa-play"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DoctorDashboard;