import { useEffect, useState } from 'react';
import {
  HeartPulse,
  Activity,
  FileText,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI, healthAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const ProfileCard = () => {
  const user = useStore((state) => state.user);
  const updateUserProfile = useStore((state) => state.updateUserProfile);

  const [diagnosedConditions, setDiagnosedConditions] = useState(
    user?.healthProfile?.diagnosedConditions || []
  );

  const [prescribedMedication, setPrescribedMedication] = useState(
    user?.healthProfile?.prescribedMedication || []
  );

  const [newMed, setNewMed] = useState('');

  const [customIssue, setCustomIssue] = useState(
    user?.healthProfile?.customIssue || ''
  );

  const [reportFile, setReportFile] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync local state whenever user profile changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (user?.healthProfile) {
      setDiagnosedConditions(
        user.healthProfile.diagnosedConditions || []
      );

      setPrescribedMedication(
        user.healthProfile.prescribedMedication || []
      );

      setCustomIssue(user.healthProfile.customIssue || '');
    }
  }, [user]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (reportFile) {
        setIsUploading(true);

        const formData = new FormData();

        formData.append('image', reportFile);
        formData.append(
          'conditions',
          JSON.stringify(diagnosedConditions)
        );
        formData.append('customIssue', customIssue);

        await healthAPI.uploadHealthReport(formData);

        setUploadSuccess(true);
        setIsUploading(false);
        setReportFile(null);
      }

      // Update regular health profile
      await profileAPI.updateHealthProfile({
        diagnosedConditions,
        prescribedMedication,
        customIssue,
      });

      // Refresh complete profile
      const fullProfile = await profileAPI.getProfile();

      updateUserProfile(fullProfile.data.data);

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save health profile:', error);

      setIsUploading(false);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCondition = (condition) => {
    if (diagnosedConditions.includes(condition)) {
      setDiagnosedConditions(
        diagnosedConditions.filter((c) => c !== condition)
      );
    } else {
      setDiagnosedConditions([
        ...diagnosedConditions,
        condition,
      ]);
    }
  };

  const addMedication = () => {
    const medication = newMed.trim();

    if (
      medication &&
      !prescribedMedication.includes(medication)
    ) {
      setPrescribedMedication([
        ...prescribedMedication,
        medication,
      ]);

      setNewMed('');
    }
  };

  const removeMedication = (medication) => {
    setPrescribedMedication(
      prescribedMedication.filter((med) => med !== medication)
    );
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setReportFile(e.target.files[0]);
      setUploadSuccess(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const response = await healthAPI.downloadReportPDF();

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: 'application/pdf',
        })
      );

      const link = document.createElement('a');

      link.href = url;
      link.setAttribute(
        'download',
        `health-report-${Date.now()}.pdf`
      );

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col h-full">

      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.04] border-2 border-green-300/40 shadow-[0_0_25px_rgba(74,222,128,0.15)] text-green-400 mb-4">
          <HeartPulse size={28} />
        </div>

        <h2 className="text-xl font-semibold text-white tracking-tight mb-1">
          Health Profile
        </h2>

        <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
          Update your details for personalized environmental safety guidance.
        </p>
      </div>

      <div className="space-y-6 flex-1">

        {/* Doctor's Report Upload */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} />
            Doctor's Report Upload
          </h3>

          <label
            className={cn(
              'w-full border border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer relative',
              isUploading
                ? 'border-gray-500 bg-gray-500/10 pointer-events-none'
                : uploadSuccess
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-white/20 bg-white/5 hover:bg-white/10'
            )}
          >
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : uploadSuccess ? (
              <CheckCircle2
                className="text-green-400 mb-1"
                size={20}
              />
            ) : (
              <Upload
                className="text-gray-400 mb-1"
                size={20}
              />
            )}

            <span className="text-sm font-medium text-gray-300 mt-2 text-center">
              {isUploading
                ? 'Uploading report...'
                : uploadSuccess
                  ? 'Report uploaded & monitoring started!'
                  : reportFile
                    ? `Selected: ${reportFile.name}`
                    : 'Click to select Medical Report Image'}
            </span>
          </label>
        </div>

        {/* Conditions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white border-b border-white/[0.06] pb-2 flex items-center gap-2 text-sm">
            <Activity
              size={16}
              className="text-green-400"
            />
            Known Conditions
          </h3>

          <div className="flex flex-wrap gap-2">
            {[
              'Respiratory condition (e.g. COPD)',
              'Asthma',
              'Heart condition',
              'Hypertension',
              'Elderly in household',
              'Children in household',
            ].map((item, idx) => {
              const isSelected =
                diagnosedConditions.includes(item);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCondition(item)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                    isSelected
                      ? 'bg-green-500/20 border-green-500/40 text-green-300'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Issue */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Additional/Custom Conditions
          </h3>

          <textarea
            value={customIssue}
            onChange={(e) => setCustomIssue(e.target.value)}
            placeholder="E.g. Migraines, allergic to pollen..."
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all min-h-[80px]"
          />
        </div>

        {/* Prescribed Medication */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white border-b border-white/[0.06] pb-2 flex items-center gap-2 text-sm">
            <FileText
              size={16}
              className="text-green-400"
            />
            Prescribed Medication
          </h3>

          <div className="flex gap-2">
            <input
              type="text"
              value={newMed}
              onChange={(e) => setNewMed(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMedication();
                }
              }}
              placeholder="e.g. Inhaler"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-green-500/50"
            />

            <button
              type="button"
              onClick={addMedication}
              className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors"
            >
              Add
            </button>
          </div>

          {prescribedMedication.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {prescribedMedication.map((med, i) => (
                <div
                  key={`${med}-${i}`}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300"
                >
                  <span>{med}</span>

                  <button
                    type="button"
                    onClick={() => removeMedication(med)}
                    className="text-red-400 hover:text-red-300"
                    aria-label={`Remove ${med}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {user?.monitoringActive ? (
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-sm bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 disabled:opacity-50"
          >
            {isDownloading ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <FileText size={18} />
            )}

            {isDownloading
              ? 'Generating PDF...'
              : 'Download Report PDF'}
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-sm',
            saveSuccess
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : isSaving
                ? 'bg-white/10 text-gray-400 border border-white/10'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/20'
          )}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <CheckCircle2 size={18} />
          ) : null}

          {isSaving
            ? 'Saving...'
            : saveSuccess
              ? 'Saved!'
              : 'Save Conditions'}
        </button>
      </div>
    </div>
  );
};