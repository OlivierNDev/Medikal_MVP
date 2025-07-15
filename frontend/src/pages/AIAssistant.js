import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

function AIAssistant() {
  const { state, dispatch } = useApp();
  const { chatMessages, currentLanguage } = state;
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesRef = useRef(null);

  const aiFeatures = [
    {
      title: 'Diagnosis Assistant',
      description: 'Get AI-powered diagnostic suggestions based on symptoms and patient history.',
      icon: 'fas fa-brain',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Drug Interaction Checker',
      description: 'Check for potential drug interactions and contraindications.',
      icon: 'fas fa-pills',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Medical Image Analysis',
      description: 'Analyze medical images for potential abnormalities and conditions.',
      icon: 'fas fa-image',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'AMR Risk Assessment',
      description: 'Assess antimicrobial resistance risk for antibiotic prescriptions.',
      icon: 'fas fa-shield-alt',
      color: 'bg-red-600 hover:bg-red-700'
    }
  ];

  const recentQueries = [
    { query: 'Diabetes management guidelines', time: '2 hours ago' },
    { query: 'Antibiotic resistance patterns', time: '4 hours ago' },
    { query: 'Hypertension treatment protocols', time: '1 day ago' }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // Add user message
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message: inputMessage,
        timestamp: new Date()
      };
      
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
      setInputMessage('');
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'bot',
          message: generateAIResponse(inputMessage),
          timestamp: new Date()
        };
        dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiResponse });
        setIsTyping(false);
      }, 2000);
    }
  };

  const generateAIResponse = (userMessage) => {
    // Simple response generation based on keywords
    const message = userMessage.toLowerCase();
    
    if (message.includes('fever') || message.includes('cough') || message.includes('symptoms')) {
      return `Based on the symptoms you've described, here are the most likely diagnoses:
      
• **Viral upper respiratory infection (85%)**
• Bacterial pneumonia (10%)
• Influenza (5%)

I recommend checking vital signs, conducting a physical examination, and considering a chest X-ray if symptoms persist or worsen.`;
    } else if (message.includes('drug') || message.includes('medication') || message.includes('interaction')) {
      return `I can help you check for drug interactions. Please provide the specific medications you'd like me to analyze. I'll check for:

• Contraindications
• Dosage conflicts
• Side effect interactions
• Alternative medications`;
    } else if (message.includes('diabetes') || message.includes('blood sugar')) {
      return `For diabetes management, current guidelines recommend:

• **HbA1c target**: <7% for most adults
• **Blood pressure**: <140/90 mmHg
• **Lifestyle modifications**: Diet and exercise
• **Medication**: Metformin as first-line therapy

Would you like more specific information about any of these areas?`;
    } else {
      return `I'm here to help with medical questions. I can assist with:

• Diagnostic suggestions
• Drug interactions
• Treatment protocols
• Medical image analysis
• Patient care guidelines

Please feel free to ask specific questions about any of these topics.`;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg card-shadow h-96 md:h-96">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg p-4">
              <h2 className="text-lg md:text-xl font-bold">
                <i className="fas fa-robot mr-2"></i>MedikalBot - AI Assistant
              </h2>
              <p className="text-sm opacity-90">Ask me anything about diagnosis, medications, or patient care</p>
            </div>
            <div ref={chatMessagesRef} className="p-4 h-60 md:h-72 overflow-y-auto">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      <i className={`fas ${message.type === 'user' ? 'fa-user' : 'fa-robot'} text-white text-sm`}></i>
                    </div>
                    <div className={`chat-bubble p-3 rounded-lg ${
                      message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.message}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <i className="fas fa-robot text-white text-sm"></i>
                    </div>
                    <div className="chat-bubble bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="border-t p-4">
              <div className="flex space-x-2 md:space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200">
                  <i className="fas fa-microphone"></i>
                </button>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg card-shadow p-4 md:p-6">
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">
                  <i className={`${feature.icon} text-purple-600 mr-2`}></i>
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <button className={`w-full ${feature.color} text-white py-2 rounded-md transition duration-200`}>
                  Start {feature.title.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tools Sidebar */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">
              <i className="fas fa-language text-purple-600 mr-2"></i>Language Tools
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Input Language</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>English</option>
                  <option>Kinyarwanda</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Output Language</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>English</option>
                  <option>Kinyarwanda</option>
                </select>
              </div>
              <button className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200">
                <i className="fas fa-sync-alt mr-2"></i>Auto-Translate
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">
              <i className="fas fa-history text-purple-600 mr-2"></i>Recent Queries
            </h3>
            <div className="space-y-2">
              {recentQueries.map((query, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <p className="text-gray-800">{query.query}</p>
                  <p className="text-gray-500 text-xs">{query.time}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">
              <i className="fas fa-cog text-purple-600 mr-2"></i>AI Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Confidence Threshold</span>
                <input type="range" className="w-16" min="0" max="100" defaultValue="75" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Auto-suggestions</span>
                <input type="checkbox" className="form-checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Voice responses</span>
                <input type="checkbox" className="form-checkbox" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;