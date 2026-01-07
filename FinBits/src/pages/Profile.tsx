import StreakCard from "../components/productivity/StreakCard";
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileDashboard from '../components/Profile/ProfileDashboard';
import NoteCard from '../components/Profile/NoteCard';
import MotivationCard from '../components/Profile/MotivationCard';
import TopHabbitsCard from "../components/productivity/TopHabitsCard";

export default function ProfilePage() {
  return (
    // Pake p-4 sampe p-12 biar ada ruang napas kayak di gambar
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* 1. Header: Profile & Interest */}
        <ProfileCard />

        {/* 2. Skills: Main & Sub Skills */}
        <ProfileDashboard />


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Note */}
          <NoteCard />

          {/* Kolom Tengah: Motivation */}
          <MotivationCard />

          {/* Kolom Kanan: Streak & Top Habits (Stacking Vertical) */}
          <div className="flex flex-col gap-6">
            <StreakCard />
            <TopHabbitsCard />
          </div>

        </div>
      </div>

      <div className="pb-20"></div>
    </div>
  );
}