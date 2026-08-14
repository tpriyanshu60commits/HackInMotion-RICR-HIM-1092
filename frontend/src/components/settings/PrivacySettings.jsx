import { useState } from 'react';
import { Shield, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '../../utils/utils';
import useStore from '../../store/useStore';
import { usersAPI } from '../../services/api';

export const PrivacySettings = () => {
  const [exportStatus, setExportStatus] = useState('idle'); // idle | loading | done
  const navigate = useNavigate();
  const logout = useStore(state => state.logout);
  const user = useStore(state => state.user);
  const location = useStore(state => state.location);
  const weatherCondition = useStore(state => state.weatherCondition);
  const currentAQI = useStore(state => state.currentAQI);
  const currentTemp = useStore(state => state.currentTemp);

  const handleExport = () => {
    setExportStatus('loading');
    setTimeout(() => {
      try {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('VerdantX - User Data Export', 14, 22);

        doc.setFontSize(14);
        doc.text('User Profile', 14, 35);
        autoTable(doc, {
          startY: 40,
          head: [['Field', 'Value']],
          body: [
            ['Name', user?.name || 'N/A'],
            ['Email', user?.email || 'N/A'],
            ['Role', user?.role || 'user'],
            ['Height', user?.height ? `${user.height} cm` : 'N/A'],
            ['Weight', user?.weight ? `${user.weight} kg` : 'N/A'],
            ['Gender', user?.gender || 'N/A'],
          ],
        });

        let finalY = doc.lastAutoTable.finalY || 40;

        doc.text('Current Weather & Location Report', 14, finalY + 15);
        autoTable(doc, {
          startY: finalY + 20,
          head: [['Metric', 'Value']],
          body: [
            ['Location', location?.name || 'N/A'],
            ['Weather Condition', weatherCondition || 'N/A'],
            ['AQI', currentAQI ? currentAQI.toString() : 'N/A'],
            ['Temperature', currentTemp ? `${currentTemp}°C` : 'N/A'],
          ],
        });

        doc.save('VerdantX_Data_Export.pdf');
        
        setExportStatus('done');
        setTimeout(() => setExportStatus('idle'), 3000);
      } catch (error) {
        console.error('Error generating PDF:', error);
        setExportStatus('idle');
      }
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmed) {
      try {
        await usersAPI.deleteAccount();
        logout();
        navigate('/');
      } catch (error) {
        console.error("Failed to delete account", error);
        alert("Failed to delete account. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Shield size={24} className="text-green-400" />
          Privacy & Data
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Manage your personal data and privacy settings.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Export Data */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Export Your Data</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm">Download a copy of your health profile, saved locations, and history.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={exportStatus !== 'idle'}
            className={cn(
              "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[140px]",
              exportStatus === 'done' ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
            )}
          >
            {exportStatus === 'loading' ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : exportStatus === 'done' ? (
              <><CheckCircle2 size={16} /> Exported</>
            ) : (
              <><Download size={16} /> Request Data</>
            )}
          </button>
        </div>

        {/* Delete Account */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl gap-4">
          <div>
            <h3 className="text-sm font-semibold text-red-400">Delete Account</h3>
            <p className="text-xs text-red-400/70 mt-1 max-w-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
          </div>
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
};

