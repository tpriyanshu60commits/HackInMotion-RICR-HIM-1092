import React, { useState } from 'react';
import { HeartPulse, Activity, Info, FileText, Upload, CheckCircle2 } from 'lucide-react';
import useStore from '../../store/useStore';
import { cn } from '../common/GlassCard';

export const ProfileCard = () => {
  const userName = useStore(state => state.userName);
  const setUserName = useStore(state => state.setUserName);
  
  const diagnosedConditions = useStore(state => state.diagnosedConditions);
  const setDiagnosedConditions = useStore(state => state.setDiagnosedConditions);
  
  const prescribedMedication = useStore(state => state.prescribedMedication);
  const setPrescribedMedication = useStore(state => state.setPrescribedMedication);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const toggleCondition = (condition) => {
    if (diagnosedConditions.includes(condition)) {
      setDiagnosedConditions(diagnosedConditions.filter(c => c !== condition));
    } else {
      setDiagnosedConditions([...diagnosedConditions, condition]);
    }
  };

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    // Simulate OCR processing time
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
      // Auto-populate mock structured fields from "Doctor's Report"
      const autoConditions = ["Asthma", "Hypertension"];
      const newConditions = [...new Set([...diagnosedConditions, ...autoConditions])];
      setDiagnosedConditions(newConditions);
      setPrescribedMedication(["Inhaler - Salbutamol", "BP Medication"]);
      
      setTimeout(() => setUploadSuccess(false), 4000);
    }, 1500);
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
        {/* Name Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Name</label>
          <input 
            type="text" 
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="e.g. Rahul"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/20 focus:bg-white/[0.04] text-white font-medium text-sm transition-all"
          />
        </div>

        {/* Doctor's Report (Simulated Upload) */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <FileText size={14} /> Doctor's Report Upload
          </h3>
          
          <button 
            onClick={handleSimulatedUpload}
            disabled={isUploading}
            className={cn(
              "w-full border border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all",
              isUploading ? "border-gray-500 bg-gray-500/10" : 
              uploadSuccess ? "border-green-500 bg-green-500/10" : "border-white/20 bg-white/5 hover:bg-white/10"
            )}
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : uploadSuccess ? (
              <CheckCircle2 className="text-green-400 mb-1" size={20} />
            ) : (
              <Upload className="text-gray-400 mb-1" size={20} />
            )}
            <span className="text-sm font-medium text-gray-300 mt-2">
              {isUploading ? "Scanning document..." : uploadSuccess ? "Data extracted!" : "Upload Medical Report (Simulated)"}
            </span>
          </button>
        </div>

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

        {/* Prescribed Meds (Read Only - Populated by Mock Upload) */}
        {prescribedMedication.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prescribed Medication</h3>
            <div className="bg-black/20 rounded-xl p-3 border border-white/5">
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                {prescribedMedication.map((med, i) => <li key={i}>{med}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
