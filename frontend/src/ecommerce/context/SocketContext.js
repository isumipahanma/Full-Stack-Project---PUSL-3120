import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    // Listen for new products
    newSocket.on('new-product', (product) => {
      console.log('New product received:', product);
      addNotification({
        type: 'success',
        message: `New product added: ${product.title}`,
        timestamp: new Date()
      });
    });

    // Listen for product updates
    newSocket.on('product-updated', (product) => {
      console.log('Product updated:', product);
      addNotification({
        type: 'info',
        message: `Product updated: ${product.title}`,
        timestamp: new Date()
      });
    });

    // Listen for product deletions
    newSocket.on('product-deleted', (productId) => {
      console.log('Product deleted:', productId);
      addNotification({
        type: 'warning',
        message: `Product deleted: ID ${productId}`,
        timestamp: new Date()
      });
    });

    // Listen for new purchases (admin only)
    newSocket.on('new-purchase', (purchase) => {
      console.log('New purchase received:', purchase);
      addNotification({
        type: 'success',
        message: `New purchase: ${purchase.purchaseId}`,
        timestamp: new Date()
      });
    });

    // Listen for cart updates
    newSocket.on('cart-updated', (data) => {
      console.log('Cart updated:', data);
      addNotification({
        type: 'info',
        message: 'Your cart has been updated',
        timestamp: new Date()
      });
    });

    // Listen for user activity (admin only)
    newSocket.on('user-activity', (activity) => {
      console.log('User activity:', activity);
      addNotification({
        type: 'info',
        message: `User activity: ${activity.type}`,
        timestamp: new Date()
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== notification));
    }, 5000);
  };

  const joinAdminRoom = () => {
    if (socket) {
      socket.emit('join-admin');
    }
  };

  const joinUserRoom = (userId) => {
    if (socket) {
      socket.emit('join-user', userId);
    }
  };

  const emitProductCreated = (product) => {
    if (socket) {
      socket.emit('product-created', product);
    }
  };

  const emitProductUpdated = (product) => {
    if (socket) {
      socket.emit('product-updated', product);
    }
  };

  const emitProductDeleted = (productId) => {
    if (socket) {
      socket.emit('product-deleted', productId);
    }
  };

  const emitPurchaseCreated = (purchase) => {
    if (socket) {
      socket.emit('purchase-created', purchase);
    }
  };

  const emitCartUpdated = (data) => {
    if (socket) {
      socket.emit('cart-updated', data);
    }
  };

  const emitUserActivity = (activity) => {
    if (socket) {
      socket.emit('user-activity', activity);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    isConnected,
    notifications,
    joinAdminRoom,
    joinUserRoom,
    emitProductCreated,
    emitProductUpdated,
    emitProductDeleted,
    emitPurchaseCreated,
    emitCartUpdated,
    emitUserActivity,
    clearNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 