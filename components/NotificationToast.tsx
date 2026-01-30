
import React, { useEffect } from 'react';
import { AppNotification } from '../types';
import { BellIcon, XMarkIcon, ShieldCheckIcon, GlobeIcon } from './Icons';

interface NotificationToastProps {
  notifications: AppNotification[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-24 right-6 z-[60] flex flex-col space-y-3 pointer-events-none w-full max-w-sm">
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onDismiss={() => onDismiss(n.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ notification: AppNotification; onDismiss: () => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const config = {
    alert: { icon: BellIcon, color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/10' },
    success: { icon: ShieldCheckIcon, color: 'text-green-400', border: 'border-green-400/50', bg: 'bg-green-400/10' },
    warning: { icon: XMarkIcon, color: 'text-red-400', border: 'border-red-400/50', bg: 'bg-red-400/10' },
    info: { icon: GlobeIcon, color: 'text-cyan-400', border: 'border-cyan-400/50', bg: 'bg-cyan-400/10' },
  }[notification.type];

  const Icon = config.icon;

  return (
    <div className={`pointer-events-auto glass-panel border ${config.border} p-4 rounded-2xl shadow-xl flex items-start animate-in slide-in-from-right duration-300`}>
      <div className={`p-2 rounded-xl ${config.bg} ${config.color} mr-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-grow">
        <h4 className="text-white font-bold text-sm font-space-grotesk">{notification.title}</h4>
        <p className="text-xs text-slate-400 mt-0.5">{notification.message}</p>
      </div>
      <button onClick={onDismiss} className="text-slate-500 hover:text-white ml-2">
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};
