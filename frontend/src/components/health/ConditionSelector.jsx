import { useState, useRef, useEffect } from 'react';
import { X, Search } from 'lucide-react';

const PRESET_CONDITIONS = [
  'Asthma',
  'COPD',
  'Heart Disease',
  'Diabetes',
  'Hypertension',
  'Allergies',
  'Pregnancy',
  'Elderly',
  'Immunocompromised',
  'Migraines',
];

const ConditionSelector = ({ selectedConditions, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddCondition = (condition) => {
    const cleanCondition = condition.trim();
    if (cleanCondition && !selectedConditions.includes(cleanCondition)) {
      onChange([...selectedConditions, cleanCondition]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveCondition = (conditionToRemove) => {
    onChange(selectedConditions.filter((c) => c !== conditionToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      handleAddCondition(searchTerm);
    }
  };

  const filteredPresets = PRESET_CONDITIONS.filter(
    (c) => c.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedConditions.includes(c)
  );

  return (
    <div className="space-y-3" ref={containerRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type custom condition (Press Enter)"
          className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-white/20 focus:bg-white/[0.04] transition-colors"
        />

        {isOpen && (searchTerm || filteredPresets.length > 0) && (
          <div className="absolute z-10 w-full mt-1 bg-[#1a1c23] border border-white/10 rounded-xl shadow-2xl max-h-48 overflow-y-auto overflow-x-hidden backdrop-blur-xl">
            {filteredPresets.map((condition) => (
              <div
                key={condition}
                className="px-4 py-2 text-sm text-gray-300 hover:bg-white/10 cursor-pointer transition-colors"
                onClick={() => handleAddCondition(condition)}
              >
                {condition}
              </div>
            ))}
            {searchTerm &&
              !PRESET_CONDITIONS.some(
                (c) => c.toLowerCase() === searchTerm.trim().toLowerCase()
              ) && (
                <div
                  className="px-4 py-2 text-sm text-green-400 hover:bg-white/10 cursor-pointer border-t border-white/5 transition-colors"
                  onClick={() => handleAddCondition(searchTerm)}
                >
                  + Add custom: "{searchTerm}"
                </div>
              )}
          </div>
        )}
      </div>

      {selectedConditions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedConditions.map((condition) => (
            <div
              key={condition}
              className="flex items-center gap-1 bg-white/10 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/5"
            >
              {condition}
              <button
                type="button"
                onClick={() => handleRemoveCondition(condition)}
                className="text-gray-400 hover:text-red-400 transition-colors ml-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionSelector;
