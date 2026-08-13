
import { ProfileCard } from '../health/ProfileCard';
import { ConnectedDeviceCard } from '../health/ConnectedDeviceCard';
import { AlertsList } from '../health/AlertsList';

export const HealthSettings = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up">
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="flex-1">
          <ProfileCard />
        </div>
        <div>
          <ConnectedDeviceCard />
        </div>
      </div>

      <div className="lg:col-span-5">
        <AlertsList />
      </div>
    </div>
  );
};
