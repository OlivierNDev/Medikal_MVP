import React from 'react';
import { useApp } from '../context/AppContext';

function NotificationsList() {
  const { state } = useApp();
  const { notifications } = state;

  return (
    <div className="bg-white rounded-lg card-shadow p-4 md:p-6">
      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
        <i className="fas fa-bell text-purple-600 mr-2"></i>Recent Notifications
      </h3>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-3 p-3 ${notification.bgColor} rounded-lg`}
          >
            <i className={`${notification.icon} ${notification.iconColor} mt-1`}></i>
            <div>
              <p className={`text-sm font-medium ${notification.textColor}`}>
                {notification.title}
              </p>
              <p className={`text-xs ${notification.iconColor}`}>
                {notification.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationsList;