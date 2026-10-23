import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BarChart3, ArrowRight, Bookmark, BookmarkCheck, ChevronLeft, Home } from 'lucide-react';
import { usePrana } from '../context/PranaContext';
import { useToast } from '../components/Toast';
import { saveRemedy } from '../services/api';
import RiskRing from '../components/RiskRing';
import SourceBadge from '../components/SourceBadge';
import StepIndicator from '../components/StepIndicator';
import FeedbackForm from '../components/FeedbackForm';
import PageTransition from '../components/PageTransition';
import { getSourceById } from '../data/sources';

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function Results() {
  const { symptoms, riskLevel, results, setSelectedRemedy, setCurrentStep, toggleSaveRemedy, isRemedySaved } = usePrana();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSelectRemedy = (remedy) => {
    setSelectedRemedy(remedy);
    setCurrentStep(3);
  };

  const handleBookmark = async (remedy) => {
    const wasSaved = isRemedySaved(remedy.id);
    toggleSaveRemedy(remedy.id);

    if (!wasSaved) {
      try {
        await saveRemedy(1, remedy.id, remedy.name, remedy);
        toast(`Saved "${remedy.name}" to your collection.`, 'success');
      } catch {
        toggleSaveRemedy(remedy.id); // revert on failure
        toast('Failed to save remedy. Please try again.', 'error');
      }
    } else {
      toast(`Removed "${remedy.name}" from your collection.`, 'info');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <StepIndicator current={3} />

          <motion.h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-prana-ivory text-center mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Research complete.
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Results for: "{symptoms.slice(0, 80)}{symptoms.length > 80 ? '...' : ''}"
          </motion.p>

          {/* Risk Ring */}
          <motion.div
            className="flex justify-center mb-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <RiskRing level={riskLevel} size={160} />
          </motion.div>

          {/* Banner */}
          <motion.div
            className="text-center mb-14 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white/40 font-body text-xs">
              Information retrieved from trusted medical and traditional-medicine sources.
              Every claim below is cited.
            </p>
          </motion.div>

          {/* No results state */}
          {results.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-white/30 font-body text-sm mb-4">
                No remedies were found for your symptoms. Try describing them differently.
              </p>
              <Link
                to="/symptoms"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-prana-gold bg-prana-gold/10 border border-prana-gold/30 rounded-full hover:bg-prana-gold/20 transition-all duration-300"
              >
                <ChevronLeft size={14} />
                Try Again
              </Link>
            </motion.div>
          )}

          {/* Remedy Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((remedy, i) => {
              const primarySource = getSourceById(remedy.sourceIds[0]);
              const saved = isRemedySaved(remedy.id);
              return (
                <motion.div
                  key={remedy.id}
                  className="group rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden hover:border-white/10 transition-all duration-500 hover:-translate-y-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {/* Gradient header */}
                  <div className="h-32 bg-gradient-to-br from-prana-gold/10 via-prana-gold/5 to-transparent relative overflow-hidden">
                    {/* Decorative herbs */}
                    <svg
                      className="absolute bottom-2 right-4 w-16 h-16 opacity-10"
                      viewBox="0 0 64 64"
                      fill="#D6AD6C"
                    >
                      <path d="M32 4C32 4 20 16 20 32C20 44 26 56 32 60C38 56 44 44 44 32C44 16 32 4 32 4Z" />
                    </svg>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {/* Source badge */}
                      {primarySource && (
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-body font-semibold"
                          style={{
                            backgroundColor: `${primarySource.color}15`,
                            color: primarySource.color,
                          }}
                        >
                          {primarySource.shortName}
                        </span>
                      )}
                      {/* Risk badge */}
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-body font-semibold ${
                          remedy.riskLevel === 'low'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}
                      >
                        {remedy.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-heading text-xl text-prana-ivory mb-1">
                      {remedy.name}
                    </h3>
                    <p className="text-white/25 font-body text-[11px] mb-3 italic">
                      {remedy.traditionalName}
                    </p>
                    <p className="text-white/40 font-body text-xs leading-relaxed mb-4 line-clamp-3">
                      {remedy.description}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 mb-5 text-white/25">
                      <div className="flex items-center gap-1">
                        <Clock size={11} />
                        <span className="text-[10px] font-body">{remedy.prepTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 size={11} />
                        <span className="text-[10px] font-body">{remedy.difficulty}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/remedy/${remedy.id}`}
                        onClick={() => handleSelectRemedy(remedy)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-body font-medium text-prana-gold bg-prana-gold/8 border border-prana-gold/20 rounded-full hover:bg-prana-gold/15 transition-all duration-300"
                      >
                        View Recipe
                        <ArrowRight size={12} />
                      </Link>
                      <button
                        onClick={() => handleBookmark(remedy)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all duration-300 ${
                          saved
                            ? 'bg-prana-gold/15 border-prana-gold/30'
                            : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.06]'
                        }`}
                        aria-label={saved ? `Unsave ${remedy.name}` : `Save ${remedy.name}`}
                      >
                        {saved ? (
                          <BookmarkCheck size={12} className="text-prana-gold" />
                        ) : (
                          <Bookmark size={12} className="text-white/30" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Feedback Form — shown after research results */}
          {results.length > 0 && (
            <div className="mt-14">
              <FeedbackForm />
            </div>
          )}

          {/* Navigation */}
          <div className="mt-14 flex items-center justify-between border-t border-white/5 pt-8">
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
        </div>
      </div>
    </PageTransition>
  );
}
