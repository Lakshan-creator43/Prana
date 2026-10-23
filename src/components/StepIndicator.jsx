import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const STEPS = ['Describe', 'Analyze', 'Research', 'Results'];

export default function StepIndicator({ current = 0 }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-10" role="navigation" aria-label="Progress">
      {STEPS.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-body font-medium transition-all duration-500 ${
                  isDone
                    ? 'bg-prana-gold/20 text-prana-gold'
                    : isActive
                    ? 'bg-prana-gold/10 text-prana-gold border border-prana-gold/40'
                    : 'bg-white/5 text-white/25 border border-white/10'
                }`}
                initial={false}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? <CheckCircle size={14} /> : i + 1}
              </motion.div>
              <span
                className={`mt-1.5 text-[10px] font-body tracking-wide ${
                  isDone || isActive ? 'text-prana-gold/70' : 'text-white/20'
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-16 h-px mx-1 mb-5 transition-colors duration-500 ${
                  isDone ? 'bg-prana-gold/30' : 'bg-white/8'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
