import React from 'react';

function Footer() {
  const footerSections = [
    {
      title: 'Medikal',
      content: 'AI-powered healthcare system for Africa, built by ZeroX Intelligence.'
    },
    {
      title: 'Features',
      items: [
        'Patient Management',
        'AI Diagnosis',
        'Voice Interface',
        'AMR Monitoring'
      ]
    },
    {
      title: 'Support',
      items: [
        'Documentation',
        'Training',
        'API Reference',
        'System Status'
      ]
    },
    {
      title: 'Contact',
      items: [
        'Email: info@medikal.rw',
        'Phone: +250 788 123 456',
        'Address: Kigali, Rwanda'
      ]
    }
  ];

  return (
    <footer className="bg-gray-800 text-white py-6 md:py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-bold mb-4">{section.title}</h4>
              {section.content ? (
                <p className="text-gray-400 text-sm">{section.content}</p>
              ) : (
                <ul className="text-gray-400 text-sm space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 Medikal by ZeroX Intelligence. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;