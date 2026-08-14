import { useState } from 'react';
import { HeartPulse, Activity, FileText, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { profileAPI } from '../../services/api';
import { cn } from '../../utils/utils';

export const ProfileCard = () => {
  const user = useStore(state => state.user);
  const updateUserProfile = useStore(state => state.updateUserProfile);
  
  const [diagnosedConditions, setDiagnosedConditions] = useState(user?.healthProfile?.diagnosedConditions || []);
  const [prescribedMedication, setPrescribedMedication] = useState(user?.healthProfile?.prescribedMedication || []);
  const [newMed, setNewMed] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);



  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileAPI.updateHealthProfile({ diagnosedConditions, prescribedMedication });
      const fullProfile = await profileAPI.getProfile();
      updateUserProfile(fullProfile.data.data);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save health profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleCondition = (condition) => {
    if (diagnosedConditions.includes(condition)) {
      setDiagnosedConditions(diagnosedConditions.filter(c => c !== condition));
    } else {
      setDiagnosedConditions([...diagnosedConditions, condition]);
    }
  };

  const addMedication = () => {
    if (newMed.trim() && !prescribedMedication.includes(newMed.trim())) {
      setPrescribedMedication([...prescribedMedication, newMed.trim()]);
      setNewMed("");
    }
  };

  const removeMedication = (med) => {
    setPrescribedMedication(prescribedMedication.filter(m => m !== med));
  };

  return (
    <div className="w-full bg-white/[0.035] backdrop-blur-xl border border-white/[0.10] rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col h-full">
      
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/[0.04] border-2 border-green-300/40 shadow-[0_0_25px_rgba(74,222,128,0.15)] text-green-400 mb-4">
          <HeartPulse size={28} />
        </div>
        <h2 className="text-xl font-semibold text-white tracking-tight mb-1">Health Profile</h2>
        <p className="text-xs text-gray-300 max-w-sm mx-auto leading-relaxed">
          Update your details for personalized environmental safety guidance.
        </p>
      </div>

      <div className="space-y-6 flex-1">

        {/* Conditions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white border-b border-white/[0.06] pb-2 flex items-center gap-2 text-sm">
            <Activity size={16} className="text-green-400" /> Known Conditions
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {[
              "Respiratory condition (e.g. COPD)",
              "Asthma",
              "Heart condition",
              "Hypertension",
              "Elderly in household",
              "Children in household"
            ].map((item, idx) => {
              const isSelected = diagnosedConditions.includes(item);
              return (
                <button
                  key={idx}
                  onClick={() => toggleCondition(item)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    isSelected 
                      ? "bg-green-500/20 border-green-500/40 text-green-300" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300"
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        {/* Prescribed Meds */}
        <div className="space-y-3 mt-4">
          <h3 className="font-semibold text-white border-b border-white/[0.06] pb-2 flex items-center gap-2 text-sm">
            <FileText size={16} className="text-green-400" /> Prescribed Medication
          </h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newMed}
              onChange={(e) => setNewMed(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addMedication()}
              placeholder="e.g. Inhaler"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500/50"
            />
            <button 
              onClick={addMedication}
              className="bg-green-500/20 text-green-400 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-500/30 transition-colors"
            >
              Add
            </button>
          </div>
          {prescribedMedication.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {prescribedMedication.map((med, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-gray-300">
                  <span>{med}</span>
                  <button onClick={() => removeMedication(med)} className="text-red-400 hover:text-red-300">&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all text-sm",
            saveSuccess ? "bg-green-500/20 text-green-400 border border-green-500/30" :
            isSaving ? "bg-white/10 text-gray-400 border border-white/10" :
            "bg-white/10 hover:bg-white/20 text-white border border-white/10"
          )}
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
          ) : saveSuccess ? (
            <CheckCircle2 size={18} />
          ) : null}
          {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Conditions"}
        </button>
      </div>

    </div>
  );
};
