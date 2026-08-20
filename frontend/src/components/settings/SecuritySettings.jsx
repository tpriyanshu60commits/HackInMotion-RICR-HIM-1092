import { useState } from 'react';
import { Key, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import useStore from '../../store/useStore';
import { cn } from '../../utils/utils';

export const SecuritySettings = () => {
  const user = useStore((state) => state.user);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      setSaveSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  if (user?.isGuest) {
    return (
      <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
        <div className="flex flex-col mb-6">
          <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
            <Key size={24} className="text-gray-400" />
            Security & Password
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Password management settings.
          </p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl text-center">
          <p className="text-gray-300 text-sm">
            Password management is unavailable for guest accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in-up">
      <div className="flex flex-col mb-8">
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1 flex items-center gap-2">
          <Key size={24} className="text-green-400" />
          Security & Password
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Update your password to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400 leading-relaxed">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all text-sm',
            saveSuccess
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
          )}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 size={18} /> Password Updated
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </form>
    </div>
  );
};
