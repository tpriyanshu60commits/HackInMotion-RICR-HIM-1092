import { useState } from 'react';
import { Shield, Download, Trash2, CheckCircle2, AlertTriangle, Eye, Activity, Share2 } from 'lucide-react';
import { cn } from '../../utils/utils';
import useStore from '../../store/useStore';
import api, { profileAPI } from '../../services/api';

export const PrivacySettings = () => {
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);
  const logout = useStore(state => state.logout);

  const [profileVisibility, setProfileVisibility] = useState(user?.privacy?.profileVisibility || 'private');
  const [dataSharing, setDataSharing] = useState(user?.privacy?.dataSharing || false);
  const [analytics, setAnalytics] = useState(user?.privacy?.analytics ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [exportStatus, setExportStatus] = useState('idle'); // idle | loading | done
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updatePrivacySettings({
        profileVisibility,
        dataSharing,
        analytics
      });
      const res = await profileAPI.getProfile();
      updateUserProfile(res.data.data);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update privacy settings', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setExportStatus('loading');
    try {
      const response = await api.get('/v1/profile/export');
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data.data, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", `verdantx_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      setExportStatus('done');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to export data', error);
      setExportStatus('idle');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await api.delete('/v1/profile');
      logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Failed to delete account', error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
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
          Manage your personal data, visibility, and privacy settings.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Privacy Preferences */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-white border-b border-white/[0.06] pb-2">Privacy Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
              <div className="flex items-start gap-3">
                <Eye size={20} className="text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Profile Visibility</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Control who can see your VerdantX profile.</p>
                </div>
              </div>
              <select
                value={profileVisibility}
                onChange={(e) => setProfileVisibility(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-green-500/50 text-sm appearance-none min-w-[140px]"
              >
                <option value="private" className="bg-gray-900">Private</option>
                <option value="friends" className="bg-gray-900">Friends Only</option>
                <option value="public" className="bg-gray-900">Public</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
              <div className="flex items-start gap-3">
                <Share2 size={20} className="text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Data Sharing</h4>
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[250px]">Allow anonymous sharing of environmental data to help the community.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" checked={dataSharing} onChange={(e) => setDataSharing(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
              <div className="flex items-start gap-3">
                <Activity size={20} className="text-green-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-white">Analytics</h4>
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[250px]">Help us improve VerdantX by sharing crash reports and usage analytics.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" className="sr-only peer" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSavePrivacy}
              disabled={isSaving}
              className={cn(
                "flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all min-w-[140px]",
                saveSuccess ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
              )}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : saveSuccess ? (
                <><CheckCircle2 size={16} /> Saved</>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-white border-b border-white/[0.06] pb-2">Data Management</h3>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl gap-4">
            <div className="flex items-start gap-3">
              <Download size={20} className="text-green-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-white">Export Your Data</h4>
                <p className="text-xs text-gray-400 mt-0.5 max-w-sm">Download a JSON copy of your health profile, preferences, and account info.</p>
              </div>
            </div>
            <button 
              onClick={handleExport}
              disabled={exportStatus !== 'idle'}
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[140px] shrink-0",
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
        </div>

        {/* Delete Account */}
        <div className="space-y-6 pt-4 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-400">Delete Account</h4>
                <p className="text-xs text-red-400/70 mt-0.5 max-w-sm">Permanently delete your account and all associated data. This action cannot be undone.</p>
              </div>
            </div>
            
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors min-w-[100px]"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors shrink-0"
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
