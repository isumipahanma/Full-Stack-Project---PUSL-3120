import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { FaUsers, FaShoppingCart, FaBox, FaClock } from 'react-icons/fa';
import styles from './RealTimeActivity.module.css';

export const RealTimeActivity = () => {
  const { isConnected, emitUserActivity } = useSocket();
  const [activities, setActivities] = useState([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Simulate user activity
    const interval = setInterval(() => {
      if (isConnected) {
        const activityTypes = [
          'browse_products',
          'view_cart',
          'add_to_cart',
          'checkout',
          'login',
          'logout'
        ];
        
        const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        
        emitUserActivity({
          type: randomActivity,
          timestamp: new Date(),
          details: `User performed: ${randomActivity.replace('_', ' ')}`
        });
        
        // Add to local activities
        setActivities(prev => [
          {
            type: randomActivity,
            timestamp: new Date(),
            details: `User performed: ${randomActivity.replace('_', ' ')}`
          },
          ...prev.slice(0, 9) // Keep only last 10 activities
        ]);
        
        // Simulate user count changes
        setUserCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 3000); // Every 3 seconds

    return () => clearInterval(interval);
  }, [isConnected, emitUserActivity]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'browse_products':
        return <FaBox size={16} />;
      case 'view_cart':
      case 'add_to_cart':
        return <FaShoppingCart size={16} />;
      case 'login':
      case 'logout':
        return <FaUsers size={16} />;
      default:
        return <FaClock size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'add_to_cart':
        return '#4caf50';
      case 'checkout':
        return '#2196f3';
      case 'login':
        return '#ff9800';
      default:
        return '#ff69b4';
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className={styles.activityContainer}>
      <div className={styles.activityHeader}>
        <h3>Real-time Activity</h3>
        <div className={styles.userCount}>
          <FaUsers size={16} />
          <span>{Math.max(0, userCount)} active users</span>
        </div>
      </div>
      
      <div className={styles.activitiesList}>
        {activities.map((activity, index) => (
          <div 
            key={index} 
            className={styles.activityItem}
            style={{ borderLeftColor: getActivityColor(activity.type) }}
          >
            <div className={styles.activityIcon}>
              {getActivityIcon(activity.type)}
            </div>
            <div className={styles.activityContent}>
              <p className={styles.activityText}>
                {activity.details}
              </p>
              <span className={styles.activityTime}>
                {activity.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className={styles.noActivity}>
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
}; 