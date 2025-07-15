import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

function VoiceInterface() {
  const { state } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setIsListening(true);
    // Here you would integrate with speech recognition API
    console.log('Starting voice recording...');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsListening(false);
    // Here you would stop recording and process the audio
    console.log('Stopping voice recording...');
  };

  const waveElements = Array.from({ length: 5 }, (_, i) => (
    <div
      key={i}
      className={`voice-wave bg-purple-500 w-1 rounded ${
        i === 0 ? 'h-8' : 
        i === 1 ? 'h-12' :
        i === 2 ? 'h-10' :
        i === 3 ? 'h-14' : 'h-8'
      }`}
      style={{ animationDelay: `${i * 0.1}s` }}
    ></div>
  ));

  return (
    <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-microphone text-purple-600 mr-2"></i>Voice Interface
      </h3>
      <div className="text-center">
        <button
          onClick={handleVoiceClick}
          className={`${
            isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
          } text-white rounded-full p-4 transition duration-200 mb-4`}
        >
          <i className={`fas fa-microphone text-xl md:text-2xl ${isRecording ? 'animate-pulse' : ''}`}></i>
        </button>
        <p className="text-sm text-gray-600 mb-4">
          {isRecording ? 'Recording... Tap to stop' : 'Tap to speak in English or Kinyarwanda'}
        </p>
        <div className={`flex justify-center space-x-1 ${isListening ? 'opacity-100' : 'opacity-30'}`}>
          {waveElements}
        </div>
      </div>
    </div>
  );
}

export default VoiceInterface;