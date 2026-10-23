import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trash2,
  Clock,
  BarChart3,
  Eye,
  BookmarkX,
  Leaf,
  Home,
} from 'lucide-react';
import { getSavedRemedies, deleteSavedRemedy } from '../services/api';
import { usePrana } from '../context/PranaContext';
import { useToast } from '../components/Toast';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function SavedRemedies() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const { setSelectedRemedy } = usePrana();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await getSavedRemedies();
        setSaved(data.savedRemedies || []);
      } catch (err) {
        console.error('Failed to fetch saved remedies:', err);
      }
      setLoading(false);
    };
    fetchSaved();
  }, []);

  const handleDelete = async (item) => {
    setDeletingId(item.id);
    try {
      await deleteSavedRemedy(item.id);
      setSaved((prev) => prev.filter((s) => s.id !== item.id));
      toast(`Removed "${item.remedyName}" from saved remedies.`, 'info');
    } catch {
      toast('Failed to remove remedy. Try again.', 'error');
    }
    setDeletingId(null);
  };

  const handleView = (item) => {
    if (item.remedyData && Object.keys(item.remedyData).length > 0) {
      setSelectedRemedy(item.remedyData);
      navigate(`/remedy/${item.remedyId}`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1 text-white/30 hover:text-white/50 text-sm font-body transition-colors"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-body font-medium text-prana-gold/80 bg-prana-gold/5 border border-prana-gold/20 rounded-full hover:bg-prana-gold/10 hover:text-prana-gold transition-all duration-300"
            >
              <Home size={12} />
              Home
            </Link>
          </div>

          <motion.h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-prana-ivory text-center mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Saved Remedies
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Your bookmarked remedies — access them anytime without searching again.
          </motion.p>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && saved.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto mb-6">
                <BookmarkX size={24} className="text-white/15" />
              </div>
              <p className="text-white/30 font-body text-sm mb-2">
                No saved remedies yet.
              </p>
              <p className="text-white/15 font-body text-xs mb-8">
                Bookmark remedies from search results to save them here.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-prana-gold bg-prana-gold/10 border border-prana-gold/30 rounded-full hover:bg-prana-gold/20 transition-all duration-300"
              >
                Start Research
              </Link>
            </motion.div>
          )}

          {/* Saved Remedy Cards */}
          {!loading && saved.length > 0 && (
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <AnimatePresence mode="popLayout">
                {saved.map((item) => {
                  const remedy = item.remedyData || {};
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      variants={reveal}
                      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                      className="rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors overflow-hidden"
                    >
                      <div className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Leaf size={14} className="text-prana-gold/50 shrink-0" />
                              <h3 className="font-heading text-lg text-prana-ivory truncate">
                                {item.remedyName}
                              </h3>
                            </div>
                            {remedy.traditionalName && (
                              <p className="text-white/20 font-body text-[11px] italic ml-6">
                                {remedy.traditionalName}
                              </p>
                            )}
                          </div>
                          {remedy.riskLevel && (
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-body font-semibold border shrink-0 ${
                                remedy.riskLevel === 'low'
                                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {remedy.riskLevel.toUpperCase()}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {remedy.description && (
                          <p className="text-white/35 font-body text-xs leading-relaxed mb-3 line-clamp-2 ml-6">
                            {remedy.description}
                          </p>
                        )}

                        {/* Meta row */}
                        <div className="flex items-center gap-4 ml-6 mb-4 text-white/20 text-[10px] font-body">
                          {remedy.prepTime && (
                            <div className="flex items-center gap-1">
                              <Clock size={10} />
                              <span>{remedy.prepTime}</span>
                            </div>
                          )}
                          {remedy.difficulty && (
                            <div className="flex items-center gap-1">
                              <BarChart3 size={10} />
                              <span>{remedy.difficulty}</span>
                            </div>
                          )}
                          {item.symptoms && (
                            <span className="text-white/15">
                              For: {item.symptoms.slice(0, 30)}
                              {item.symptoms.length > 30 ? '...' : ''}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-6">
                          <button
                            onClick={() => handleView(item)}
                            className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-body font-medium text-prana-gold/80 bg-prana-gold/5 border border-prana-gold/20 rounded-full hover:bg-prana-gold/10 hover:text-prana-gold transition-all duration-300"
                          >
                            <Eye size={10} />
                            View Recipe
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-red-400/60 bg-red-500/5 border border-red-500/10 rounded-full hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 disabled:opacity-30"
                          >
                            <Trash2 size={10} />
                            {deletingId === item.id ? 'Removing...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
