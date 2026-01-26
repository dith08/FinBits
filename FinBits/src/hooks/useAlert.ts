import { useState, useCallback } from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title?: string;
  message: string;
}

const initialState: AlertState = {
  isOpen: false,
  type: 'info',
  message: '',
};

export function useAlert() {
  const [alert, setAlert] = useState<AlertState>(initialState);

  const showAlert = useCallback((
    message: string, 
    type: AlertType = 'info', 
    title?: string
  ) => {
    setAlert({ isOpen: true, type, title, message });
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showAlert(message, 'success', title);
  }, [showAlert]);

  const showError = useCallback((message: string, title?: string) => {
    showAlert(message, 'error', title);
  }, [showAlert]);

  const showWarning = useCallback((message: string, title?: string) => {
    showAlert(message, 'warning', title);
  }, [showAlert]);

  const showInfo = useCallback((message: string, title?: string) => {
    showAlert(message, 'info', title);
  }, [showAlert]);

  const closeAlert = useCallback(() => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    alert,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    closeAlert,
  };
}
