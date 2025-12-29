import Sidebar from "../components/SideBar";


const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-white font-sans">
      {/* Sidebar stay di sini terus */}
      <div className="h-full">
        <Sidebar/>
      </div>

      {/* Konten yang bakal ganti-ganti */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;