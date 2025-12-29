import { NavLink } from 'react-router-dom';
import LogoImg from '../assets/Logo.png';

import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Target, 
  User, 
  Bell 
} from 'lucide-react';

const Sidebar = () => {
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard ' },
    { name: 'Productivity', icon: Calendar, path: '/productivity' },
    { name: 'Finance', icon: DollarSign, path: '/finance' },
    { name: 'Goals', icon: Target, path: '/goals' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Notification', icon: Bell, path: '/notifications' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-[#121212] text-white p-4 font-sans border-r border-gray-800">
      <div className="flex items-center justify-center py-8 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">
          <img src={LogoImg} alt="" width={120} height={120}/>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              `w-full flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 ${
                isActive 
                  ? 'bg-[#10b981] text-white' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={22} 
                  className={isActive ? 'text-white' : 'text-[#10b981]'} 
                />
                <span className="font-semibold text-lg">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;