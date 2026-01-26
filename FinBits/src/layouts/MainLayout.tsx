import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-white font-sans">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-zinc-800 border border-zinc-700"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static
        z-40 h-full
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => isMobile && setIsSidebarOpen(false)} />
      </div>

      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;