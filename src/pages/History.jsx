import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Bookmark, ChevronLeft, Eye, RefreshCw, Home } from 'lucide-react';
import { getHistory } from '../services/api';
import { usePrana } from '../context/PranaContext';
import { HistorySkeleton } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const RISK_COLORS = {
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
  moderate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function History() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    setSymptoms,
    setRiskLevel,
    setRedFlags,
    setResults,
    setSourcesUsed,
    setCurrentStep,
    reset,
  } = usePrana();

  useEffect(() => {
    const fetch = async () => {
      const data = await getHistory();
      setHistory(data.history || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = history.filter((h) =>
    h.symptoms.toLowerCase().includes(search.toLowerCase())
  );

  /** Load stored results directly — no API call needed */
  const handleViewResults = (entry) => {
    reset();
    setSymptoms(entry.symptoms);
    setRiskLevel(entry.riskLevel || 'low');
    setRedFlags(entry.redFlags || []);
    setResults(entry.results || []);
    setSourcesUsed(entry.sourcesUsed || []);
    setCurrentStep(3);

    if (entry.riskLevel === 'high') {
      navigate('/safety');
    } else if (entry.results && entry.results.length > 0) {
      navigate('/results');
    } else {
      // No stored results — re-run the search
      setCurrentStep(1);
      navigate('/researching');
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
            Research History
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Your past symptom searches and saved remedies.
          </motion.p>

          {/* Search */}
          <motion.div
            className="relative mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full bg-white/[0.03] border border-white/8 rounded-xl pl-10 pr-4 py-3 font-body text-sm text-white/70 placeholder:text-white/20 focus:outline-none focus:border-prana-gold/30 transition-colors"
              aria-label="Search history"
            />
          </motion.div>

          {/* Timeline */}
          {loading ? (
            <HistorySkeleton count={4} />
          ) : filtered.length === 0 ? (
            <div className="text-center text-white/20 font-body text-sm py-16">
              No results found.
            </div>
          ) : (
            <motion.div
              className="space-y-0"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {filtered.map((entry, i) => {
                const hasStoredResults = entry.results && entry.results.length > 0;

                return (
                  <motion.div
                    key={entry.id}
                    className="relative flex gap-4"
                    variants={reveal}
                  >
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-prana-gold/20 border border-prana-gold/30 shrink-0 mt-6" />
                      {i < filtered.length - 1 && (
                        <div className="w-px flex-1 bg-white/5" />
                      )}
                    </div>

                    {/* Card */}
                    <div className="flex-1 p-5 mb-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <p className="font-body text-sm text-white/60 leading-relaxed flex-1">
                          {entry.symptoms}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-body font-semibold border shrink-0 ${
                            RISK_COLORS[entry.riskLevel] || RISK_COLORS.low
                          }`}
                        >
                          {(entry.riskLevel || 'low').toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4 text-white/20 text-xs font-body">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(entry.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                          <span>{entry.remediesFound} remedies found</span>
                          {entry.savedRemedies && entry.savedRemedies.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Bookmark size={10} />
                              {entry.savedRemedies.length} saved
                            </div>
                          )}
                        </div>

                        {/* View Results / Search Again Button */}
                        <button
                          onClick={() => handleViewResults(entry)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-body font-medium text-prana-gold/80 bg-prana-gold/5 border border-prana-gold/20 rounded-full hover:bg-prana-gold/10 hover:text-prana-gold transition-all duration-300"
                          aria-label={
                            hasStoredResults
                              ? `View results for ${entry.symptoms}`
                              : `Search again for ${entry.symptoms}`
                          }
                        >
                          {hasStoredResults ? (
                            <>
                              <Eye size={10} />
                              View Results
                            </>
                          ) : (
                            <>
                              <RefreshCw size={10} />
                              Search Again
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
