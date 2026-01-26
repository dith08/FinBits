import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import StreakCard from "../components/productivity/StreakCard";
import ProfileCard from '../components/Profile/ProfileCard';
import ProfileDashboard from '../components/Profile/ProfileDashboard';
import NoteCard from '../components/Profile/NoteCard';
import MotivationCard from '../components/Profile/MotivationCard';
import TopHabbitsCard from "../components/productivity/TopHabitsCard";
import { authService } from '../services/authService';
import { AlertModal } from "../components/common";
import { useAlert } from "../hooks";

interface ProfileData {
  image_url?: string;
  description?: string;
  main_skill?: string;
  sub_skill?: string;
  interest?: string;
  note?: string;
  motivation?: string;
  full_name?: string;
  email?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { alert, showError, closeAlert } = useAlert();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      console.log('Profile API response:', response);
      setProfile(response.data || response);
      setError(null);
      setHasError(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (typeof err === 'string' && err.includes('belum ada')) {
        setProfile(null);
        setError(null);
        setHasError(false);
      } else {
        setError(typeof err === 'string' ? err : 'Gagal memuat profil');
        setHasError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (data: Partial<ProfileData>) => {
    try {
      if (!profile) {
        await authService.addProfile(data);
      } else {
        await authService.editProfile(data);
      }
      await fetchProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      showError(typeof err === 'string' ? err : 'Gagal memperbarui profil');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white p-6 md:p-12 font-sans pt-20 lg:pt-6 transition-all ${hasError ? 'grayscale' : ''}`}>
      
      <div className="max-w-6xl mx-auto space-y-10">

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
            {error}
            <button onClick={fetchProfile} className="ml-2 underline">Coba lagi</button>
          </div>
        )}
        
        <ProfileCard 
          imageUrl={profile?.image_url}
          fullName={profile?.full_name}
          description={profile?.description}
          interest={profile?.interest}
          profileData={profile || undefined}
          onUpdate={handleUpdateProfile}
        />

        <ProfileDashboard 
          mainSkill={profile?.main_skill}
          subSkill={profile?.sub_skill}
          onUpdate={handleUpdateProfile}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <NoteCard 
            note={profile?.note}
            onUpdate={handleUpdateProfile}
          />

          <MotivationCard 
            motivation={profile?.motivation}
            onUpdate={handleUpdateProfile}
          />

          <div className="flex flex-col gap-6">
            <StreakCard />
            <TopHabbitsCard />
          </div>

        </div>
      </div>

      <div className="pb-20"></div>

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
}