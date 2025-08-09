import React from 'react';
import { useSocket } from '../context/SocketContext';
import { FaBell, FaTimes, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './NotificationSystem.module.css';

export const NotificationSystem = () => {
  const { notifications, clearNotifications, isConnected } = useSocket();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={16} />;
      case 'warning':
        return <FaExclamationTriangle size={16} />;
      case 'info':
        return <FaInfoCircle size={16} />;
      default:
        return <FaBell size={16} />;
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'success':
        return styles.success;
      case 'warning':
        return styles.warning;
      case 'info':
        return styles.info;
      default:
        return styles.default;
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.notificationContainer}>
      <div className={styles.notificationHeader}>
        <div className={styles.headerContent}>
          <FaBell size={20} />
          <span>Real-time Updates</span>
          {!isConnected && (
            <span className={styles.connectionStatus}>
              Disconnected
            </span>
          )}
        </div>
        <button 
          className={styles.clearButton}
          onClick={clearNotifications}
        >
          <FaTimes size={16} />
        </button>
      </div>
      
      <div className={styles.notificationsList}>
        {notifications.map((notification, index) => (
          <div
            key={index}
            className={`${styles.notification} ${getNotificationClass(notification.type)}`}
          >
            <div className={styles.notificationIcon}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className={styles.notificationContent}>
              <p className={styles.notificationMessage}>
                {notification.message}
              </p>
              <span className={styles.notificationTime}>
                {notification.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 