import { NavLink, useNavigate } from 'react-router-dom';
import LogoImg from '../../assets/Logo.png';
import { authService } from '../../services/authService';
import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Target, 
  User, 
  Bell,
  LogOut
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Produktivitas', icon: Calendar, path: '/productivity' },
  { name: 'Keuangan', icon: DollarSign, path: '/finance' },
  { name: 'Tujuan', icon: Target, path: '/goals' },
  { name: 'Profile', icon: User, path: '/profile' },
  { name: 'Notifikasi', icon: Bell, path: '/notifications' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const checkNotifications = () => {
      const unreadCount = localStorage.getItem('unreadNotificationCount');
      setHasNotifications(unreadCount ? parseInt(unreadCount) > 0 : false);
    };

    checkNotifications();
    
    window.addEventListener('notificationUpdate', checkNotifications);
    return () => window.removeEventListener('notificationUpdate', checkNotifications);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a] text-white p-5 font-sans border-r border-gray-800/50 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"></div>
      
      <div className="flex items-center justify-center py-6 mb-6 relative z-10">
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-300"></div>
          <img 
            src={LogoImg} 
            alt="Logo" 
            width={110} 
            height={110}
            className="relative z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 relative z-10">
        {menuItems.map((item, index) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 relative overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm'
              }`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full"></div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-transparent transition-all duration-300"></div>
                
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-800/50 group-hover:bg-emerald-500/20'
                }`}>
                  <item.icon 
                    size={20} 
                    className={`transition-all duration-300 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-emerald-400 group-hover:text-emerald-300'
                    }`}
                    strokeWidth={2.5}
                  />
                  
                  {item.name === 'Notifikasi' && hasNotifications && (
                    <div className="absolute -top-1 -right-1 flex items-center justify-center">
                      <div className="absolute w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                      <div className="relative w-4 h-4 bg-red-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <span className={`font-medium text-base relative transition-all duration-300 ${
                  isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                }`}>
                  {item.name}
                </span>
                
                <div className={`ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isActive ? 'opacity-100' : ''
                }`}>
                  <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                </div>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4 mt-4 border-t border-gray-800/50 relative z-10">
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 relative overflow-hidden backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:to-transparent transition-all duration-300"></div>
          
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800/50 group-hover:bg-red-500/20 transition-all duration-300">
            <LogOut 
              size={20} 
              className="text-red-500 group-hover:text-red-400 transition-all duration-300 group-hover:rotate-12" 
              strokeWidth={2.5}
            />
          </div>
          
          <span className="font-medium text-base relative group-hover:translate-x-1 transition-all duration-300">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;