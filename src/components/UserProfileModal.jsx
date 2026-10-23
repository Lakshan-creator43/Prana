import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertTriangle, Heart, Pill, ShieldCheck } from 'lucide-react';

const COMMON_ALLERGIES = ['Bee products (honey)', 'Dairy', 'Nuts', 'Citrus', 'Shellfish', 'Soy', 'Gluten'];
const COMMON_CONDITIONS = ['Diabetes', 'Hypertension', 'Heart disease', 'Pregnancy', 'Asthma', 'Liver disease', 'Kidney disease'];
const COMMON_MEDICATIONS = ['Warfarin (blood thinner)', 'Metformin (diabetes)', 'Lisinopril (blood pressure)', 'Aspirin', 'Ibuprofen', 'Insulin'];

function ChipInput({ items, onAdd, onRemove, placeholder, suggestions, icon: Icon, iconColor }) {
  const [input, setInput] = useState('');

  const handleAdd = (value) => {
    const trimmed = (value || input).trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  // Filter suggestions to exclude already-added items
  const filteredSuggestions = suggestions.filter(
    (s) => !items.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Added chips */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-body bg-white/[0.05] text-white/60 border border-white/10 rounded-full"
            >
              {item}
              <button
                onClick={() => onRemove(item)}
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label={`Remove ${item}`}
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Icon size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`} />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-white/[0.03] border border-white/8 rounded-lg pl-9 pr-3 py-2 font-body text-xs text-white/70 placeholder:text-white/20 focus:outline-none focus:border-prana-gold/30 transition-colors"
          />
        </div>
        <button
          onClick={() => handleAdd()}
          disabled={!input.trim()}
          className="px-3 py-2 bg-white/[0.05] border border-white/10 rounded-lg text-white/40 hover:bg-white/[0.08] hover:text-white/60 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Add"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Quick-add suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filteredSuggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              onClick={() => handleAdd(s)}
              className="px-2.5 py-1 text-[10px] font-body text-white/30 bg-white/[0.02] border border-white/5 rounded-full hover:bg-white/[0.05] hover:text-white/50 transition-all duration-300"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserProfileModal({ isOpen, onClose, onSubmit, initialProfile }) {
  const [allergies, setAllergies] = useState(initialProfile?.allergies || []);
  const [conditions, setConditions] = useState(initialProfile?.conditions || []);
  const [medications, setMedications] = useState(initialProfile?.medications || []);

  const handleSubmit = () => {
    onSubmit({ allergies, conditions, medications });
    onClose();
  };

  const handleSkip = () => {
    onSubmit({ allergies: [], conditions: [], medications: [] });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-white/8 bg-[#0a0a0a] shadow-2xl shadow-black/50 no-scrollbar"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-prana-gold/60" />
                <h2 className="font-heading text-xl text-prana-ivory">
                  Your Health Profile
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              <p className="text-white/35 font-body text-xs leading-relaxed">
                Optionally provide your health information for a personalised safety
                assessment. This data is only used for the current check and is not stored.
              </p>

              {/* Allergies */}
              <div>
                <h3 className="font-heading text-lg text-prana-ivory mb-3 flex items-center gap-2">
                  <AlertTriangle size={14} className="text-amber-400/60" />
                  Known Allergies
                </h3>
                <ChipInput
                  items={allergies}
                  onAdd={(v) => setAllergies((p) => [...p, v])}
                  onRemove={(v) => setAllergies((p) => p.filter((x) => x !== v))}
                  placeholder="Type an allergy..."
                  suggestions={COMMON_ALLERGIES}
                  icon={AlertTriangle}
                  iconColor="text-amber-400/40"
                />
              </div>

              {/* Conditions */}
              <div>
                <h3 className="font-heading text-lg text-prana-ivory mb-3 flex items-center gap-2">
                  <Heart size={14} className="text-red-400/60" />
                  Existing Conditions
                </h3>
                <ChipInput
                  items={conditions}
                  onAdd={(v) => setConditions((p) => [...p, v])}
                  onRemove={(v) => setConditions((p) => p.filter((x) => x !== v))}
                  placeholder="Type a condition..."
                  suggestions={COMMON_CONDITIONS}
                  icon={Heart}
                  iconColor="text-red-400/40"
                />
              </div>

              {/* Medications */}
              <div>
                <h3 className="font-heading text-lg text-prana-ivory mb-3 flex items-center gap-2">
                  <Pill size={14} className="text-blue-400/60" />
                  Current Medications
                </h3>
                <ChipInput
                  items={medications}
                  onAdd={(v) => setMedications((p) => [...p, v])}
                  onRemove={(v) => setMedications((p) => p.filter((x) => x !== v))}
                  placeholder="Type a medication..."
                  suggestions={COMMON_MEDICATIONS}
                  icon={Pill}
                  iconColor="text-blue-400/40"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/5 px-6 py-4 flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-white/30 hover:text-white/50 text-xs font-body transition-colors"
              >
                Skip — check without profile
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 text-sm font-body font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300"
              >
                Run Safety Check
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
