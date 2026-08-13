import React from 'react';
import { ProfileCard } from '../components/health/ProfileCard';
import { ConnectedDeviceCard } from '../components/health/ConnectedDeviceCard';
import { AlertsList } from '../components/health/AlertsList';

export const Profile = () => {
  return (
    <div 
      className="min-h-full relative px-4 py-8 animate-fade-in"
      style={{
        backgroundImage: `linear-gradient(rgba(10,15,13,0.94), rgba(10,15,13,0.94)), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000&auto=format&fit=crop")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form & Wearables (8 columns wide on large screens) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex-1">
              <ProfileCard />
            </div>
            <div>
              <ConnectedDeviceCard />
            </div>
          </div>

          {/* Right Column: Alerts List (4 columns wide on large screens) */}
          <div className="lg:col-span-5">
            <AlertsList />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
