import { useState, useEffect } from 'react';
import { User, HeartPulse, Bell, Globe, Thermometer, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api, { profileAPI } from '../services/api';
import useStore from '../store/useStore';
import { cn } from '../utils/utils';

// Setting panels
import { BasicProfile } from '../components/settings/BasicProfile';
import { HealthSettings } from '../components/settings/HealthSettings';
import { NotificationSettings } from '../components/settings/NotificationSettings';
import { LanguageSettings } from '../components/settings/LanguageSettings';
import { UnitSettings } from '../components/settings/UnitSettings';
import { PrivacySettings } from '../components/settings/PrivacySettings';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'health', label: 'Health Profile', icon: HeartPulse },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'language', label: 'Language & Region', icon: Globe },
  { id: 'units', label: 'Units', icon: Thermometer },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
];

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const logout = useStore((state) => state.logout);
  const updateUserProfile = useStore((state) => state.updateUserProfile);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        if (res.data.success) {
          updateUserProfile(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [updateUserProfile]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error('Logout failed:', e);
    }
    logout();
    navigate('/login');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile': return <BasicProfile />;
      case 'health': return <HealthSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'language': return <LanguageSettings />;
      case 'units': return <UnitSettings />;
      case 'privacy': return <PrivacySettings />;
      default: return <BasicProfile />;
    }
  };

  return (
    <div 
      className="min-h-full relative px-2 md:px-4 py-8 animate-fade-in"
      
    >
      <div className="max-w-[1400px] mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">Account Settings</h1>
          <p className="text-sm text-gray-400">Manage your profile, preferences, and health data.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
            <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm whitespace-nowrap",
                    activeTab === tab.id 
                      ? "bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <tab.icon size={18} className={cn("shrink-0", activeTab === tab.id ? "text-green-400" : "text-gray-500")} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="hidden md:block w-full h-[1px] bg-white/10 my-2"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 w-fit md:w-full"
            >
              <LogOut size={18} className="shrink-0 text-red-400" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              renderActiveTab()
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
