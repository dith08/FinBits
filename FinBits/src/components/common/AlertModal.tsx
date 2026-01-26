import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: AlertType;
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

const alertConfig = {
  success: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/50',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/50',
    buttonColor: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/50',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/50',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
  },
};

const defaultTitles = {
  success: 'Berhasil!',
  error: 'Terjadi Kesalahan',
  warning: 'Perhatian',
  info: 'Informasi',
};

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  confirmText = 'OK',
  onConfirm,
}) => {
  if (!isOpen) return null;

  const config = alertConfig[type];
  const Icon = config.icon;
  const displayTitle = title || defaultTitles[type];

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdrop}
    >
      <div className={`w-full max-w-sm mx-4 rounded-2xl bg-[#1a1a1a] border ${config.borderColor} shadow-2xl overflow-hidden`}>
        {/* Header */}
        <div className={`${config.bgColor} px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${config.color}`} />
            <h3 className={`font-bold text-lg ${config.color}`}>{displayTitle}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={handleConfirm}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-colors ${config.buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
