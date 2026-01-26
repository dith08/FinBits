import { useState, useEffect } from 'react';
import { Loader2, Bell, Check, Trash2 } from 'lucide-react';
import { productivityService } from '../services/productivityService';
import { useAlert } from "../hooks";

interface Notification {
  id: number;
  notification_id?: number;
  title?: string;
  message: string;
  type?: string;
  is_read?: boolean;
  read?: boolean;
  created_at?: string;
  time?: string;
}

interface ConfirmModalState {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { alert, showError, closeAlert } = useAlert();
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({ isOpen: false, onConfirm: () => {} });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await productivityService.getNotifications();
      console.log('Notifications response:', response);
      
      const data = response.data || response || [];
      setNotifications(Array.isArray(data) ? data : []);
      
      const unreadCount = (Array.isArray(data) ? data : []).filter(
        (n: Notification) => !n.is_read && !n.read
      ).length;
      
      localStorage.setItem('unreadNotificationCount', unreadCount.toString());
      window.dispatchEvent(new Event('notificationUpdate'));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(typeof err === 'string' ? err : 'Gagal memuat notifikasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleReadAll = async () => {
    try {
      await productivityService.readAllNotifications();
      await fetchNotifications();
    } catch (err) {
      console.error('Error reading all:', err);
      showError(typeof err === 'string' ? err : 'Gagal menandai notifikasi');
    }
  };

  const handleClearAll = async () => {
    setConfirmModal({
      isOpen: true,
      onConfirm: async () => {
        try {
          await productivityService.clearAllNotifications();
          setNotifications([]);
        } catch (err) {
          console.error('Error clearing all:', err);
          showError(typeof err === 'string' ? err : 'Gagal menghapus notifikasi');
        }
        setConfirmModal({ isOpen: false, onConfirm: () => {} });
      }
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen bg-[#09090b] p-8 text-zinc-100 font-sans selection:bg-emerald-500/30 pt-20 lg:pt-8">
  <div className="max-w-4xl mx-auto">
    
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Bell size={28} className="text-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Notifikasi
          </h1>
        </div>
        <p className="text-zinc-500 ml-1">Pantau semua aktivitas terbaru akun kamu di sini.</p>
      </div>
      
      <div className="flex gap-3">
        <button 
          onClick={handleReadAll}
          className="group px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          <Check size={18} className="group-hover:scale-110 transition-transform" />
          Tandai Semua Sudah Dibaca
        </button>
        <button 
          onClick={handleClearAll}
          className="group px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-semibold hover:border-red-500/50 hover:text-red-400 transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          <Trash2 size={18} className="group-hover:shake transition-transform" />
          Hapus Semua
        </button>
      </div>
    </div>

    {error && (
      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3 text-red-400 text-sm">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
          {error}
        </div>
        <button onClick={fetchNotifications} className="text-xs font-bold uppercase tracking-widest hover:underline text-red-400">
          Retry
        </button>
      </div>
    )}

    {loading ? (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-emerald-500/30 rounded-full animate-reverse-spin" />
        </div>
        <p className="text-zinc-500 text-sm font-medium animate-pulse">Memuat data...</p>
      </div>
    ) : notifications.length === 0 ? (
      <div className="text-center py-24 bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-800">
        <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
          <Bell size={32} className="text-zinc-700" />
        </div>
        <h3 className="text-xl font-bold text-zinc-300 mb-1">Inbox Kosong</h3>
        <p className="text-zinc-500 max-w-xs mx-auto">Belum ada notifikasi baru untuk saat ini. Santai dulu aja!</p>
      </div>
    ) : (
      <div className="space-y-4">
        {notifications.map((notif) => {
          const id = notif.notification_id || notif.id;
          const isRead = notif.is_read || notif.read;
          
          return (
            <div 
              key={id}
              className={`group relative overflow-hidden transition-all duration-300 rounded-2xl border ${
                isRead 
                ? 'bg-zinc-900/30 border-zinc-800/50 opacity-70' 
                : 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-0.5'
              }`}
            >
              {!isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 shadow-[4px_0_15px_rgba(16,185,129,0.4)]" />
              )}

              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <div className={`mt-1 p-2.5 rounded-xl ${isRead ? 'bg-zinc-800 text-zinc-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    <Bell size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {notif.title && (
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${isRead ? 'text-zinc-500' : 'text-emerald-400'}`}>
                          {notif.title}
                        </h3>
                      )}
                      {!isRead && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                    </div>
                    <p className={`text-base leading-relaxed ${isRead ? 'text-zinc-400' : 'text-zinc-100 font-medium'}`}>
                      {notif.message}
                    </p>
                    {notif.type && (
                      <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-500 uppercase tracking-tighter border border-zinc-700/50">
                        {notif.type}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-0 pl-14 md:pl-0">
                  <span className={`text-sm font-bold ${isRead ? 'text-zinc-600' : 'text-zinc-300'}`}>
                    {formatTime(notif.created_at) || notif.time}
                  </span>
                  <span className="text-xs text-zinc-600">
                    {formatDate(notif.created_at)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>

  {confirmModal.isOpen && (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setConfirmModal({ isOpen: false, onConfirm: () => {} })} />
      <div className="relative w-full max-w-md rounded-[2rem] bg-zinc-900 border border-zinc-800 p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
          <Trash2 size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Hapus Semua?</h2>
        <p className="text-zinc-500 text-center mb-8 leading-relaxed">
          Tindakan ini permanen. Semua histori notifikasi lu bakal hilang ditelan bumi. Yakin nih?
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmModal({ isOpen: false, onConfirm: () => {} })}
            className="flex-1 py-3.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-bold transition-all"
          >
            Batal
          </button>
          <button
            onClick={confirmModal.onConfirm}
            className="flex-1 py-3.5 px-4 bg-red-500 hover:bg-red-400 text-white rounded-2xl font-bold transition-all shadow-[0_10px_20px_-5px_rgba(239,68,68,0.4)]"
          >
            Ya, Hapus!
          </button>
        </div>
      </div>
    </div>
  )}
</div>
  );
}
