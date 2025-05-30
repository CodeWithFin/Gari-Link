import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import Toast, { ToastType } from '../components/Toast';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
  showIcon?: boolean;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [duration, setDuration] = useState(3000);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [showIcon, setShowIcon] = useState(true);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    setVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showToast = useCallback(({ 
    message,
    type = 'info',
    duration = 3000,
    position = 'top',
    showIcon = true,
  }: ToastOptions) => {
    // Hide any existing toast first
    hideToast();
    
    // Set the new toast options
    setMessage(message);
    setType(type);
    setDuration(duration);
    setPosition(position);
    setShowIcon(showIcon);
    
    // Show the toast
    setVisible(true);
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        onDismiss={hideToast}
        position={position}
        showIcon={showIcon}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};
