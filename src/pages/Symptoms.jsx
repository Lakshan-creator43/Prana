import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, AlertTriangle, ChevronLeft, Home } from 'lucide-react';
import { usePrana } from '../context/PranaContext';
import { USE_MOCK } from '../services/api';
import StepIndicator from '../components/StepIndicator';
import PageTransition from '../components/PageTransition';

const CHIPS = [
  'Fever',
  'Cough',
  'Headache',
  'Stomach pain',
  'Cold',
  'Skin rash',
  'Back pain',
  'Sleep issues',
];

export default function Symptoms() {
  const { symptoms, setSymptoms, setCurrentStep } = usePrana();
  const [text, setText] = useState(symptoms);
  const navigate = useNavigate();

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleChip = (chip) => {
    const lower = text.toLowerCase();
    if (!lower.includes(chip.toLowerCase())) {
      setText((prev) => (prev.trim() ? `${prev.trim()}, ${chip.toLowerCase()}` : chip.toLowerCase()));
    }
  };

  const handleSubmit = () => {
    if (wordCount < 1) return;
    setSymptoms(text.trim());
    setCurrentStep(1);
    navigate('/researching');
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <StepIndicator current={0} />

          <motion.h1
            className="font-heading text-4xl sm:text-5xl md:text-6xl text-prana-ivory text-center mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Describe your symptoms.
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-12 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Tell us what you're experiencing. We'll search trusted sources for
            traditional and home remedies with full citations.
          </motion.p>

          {/* Text Area */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <textarea
              id="symptoms-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Example: I have a sore throat and mild cough for three days."
              rows={6}
              className="w-full bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-5 font-body text-sm text-white/80 placeholder:text-white/20 resize-none focus:outline-none focus:border-prana-gold/30 transition-colors duration-300"
              aria-label="Describe your symptoms"
            />
            <div className="absolute bottom-3 right-4 text-[10px] font-body text-white/20">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </div>
          </motion.div>

          {/* Suggestion Chips */}
          <motion.div
            className="flex flex-wrap gap-2 mt-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-[10px] font-body text-white/20 self-center mr-1">
              Common:
            </span>
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChip(chip)}
                className="px-3 py-1 text-xs font-body text-white/40 bg-white/[0.03] border border-white/8 rounded-full hover:bg-white/[0.06] hover:text-white/60 transition-all duration-300"
              >
                {chip}
              </button>
            ))}
          </motion.div>

          {/* Submit */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={handleSubmit}
              disabled={wordCount < 1}
              className="group flex items-center gap-2 px-8 py-3 font-body text-sm font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:brightness-100"
            >
              Analyze Symptoms
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/50 text-sm font-body transition-colors"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-body font-medium text-prana-gold/80 bg-prana-gold/5 border border-prana-gold/20 rounded-full hover:bg-prana-gold/10 hover:text-prana-gold transition-all duration-300"
            >
              <Home size={14} />
              Home
            </Link>
          </div>

          {/* Notes */}
          <motion.div
            className="mt-12 flex flex-col gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-start gap-2 text-white/20">
              <Lock size={12} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-body leading-relaxed">
                {USE_MOCK
                  ? 'Your symptoms are processed locally in this demo. No data is sent to any server.'
                  : 'Your symptoms are sent securely to our backend for analysis. No data is shared with third parties.'}
              </p>
            </div>
            <div className="flex items-start gap-2 text-white/20">
              <AlertTriangle size={12} className="mt-0.5 shrink-0" />
              <p className="text-[11px] font-body leading-relaxed">
                If you're experiencing a medical emergency, call your local
                emergency number immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
