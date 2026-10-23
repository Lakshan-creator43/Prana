import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle, ChevronLeft, ArrowRight, Home } from 'lucide-react';
import { sources } from '../data/sources';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Sources() {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/safety"
            className="inline-flex items-center gap-1 text-white/30 hover:text-white/50 text-sm font-body transition-colors mb-8"
          >
            <ChevronLeft size={14} />
            Back
          </Link>

          <motion.h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-prana-ivory text-center mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            See exactly where this came from.
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-16 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Every remedy, ingredient, step, and precaution in PRANA is retrieved from
            these trusted institutions. No anonymous tips. No "studies show."
          </motion.p>

          <motion.div
            className="grid gap-6 md:grid-cols-2"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {sources.map((source) => (
              <motion.div
                key={source.id}
                className="group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:-translate-y-1 transition-all duration-500"
                variants={reveal}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-body text-sm font-bold"
                      style={{
                        backgroundColor: `${source.color}12`,
                        color: source.color,
                      }}
                    >
                      {source.monogram}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg text-prana-ivory leading-tight">
                        {source.name}
                      </h3>
                      <p className="text-white/25 font-body text-[10px] mt-0.5">
                        {source.sourceType}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-white/35 font-body text-xs leading-relaxed mb-4">
                  {source.description}
                </p>

                <div className="flex items-center justify-between">
                  {source.verified && (
                    <div className="flex items-center gap-1 text-green-400/60">
                      <CheckCircle size={12} />
                      <span className="text-[10px] font-body font-medium">
                        Verified
                      </span>
                    </div>
                  )}
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-white/25 hover:text-white/50 text-xs font-body transition-colors"
                    aria-label={`Visit ${source.name}`}
                  >
                    Visit
                    <ExternalLink size={10} />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation */}
          <div className="mt-14 flex items-center justify-between border-t border-white/5 pt-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-white/30 hover:text-white/50 text-sm font-body transition-colors"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-5 py-2 text-sm font-body font-medium text-prana-gold/80 bg-prana-gold/5 border border-prana-gold/20 rounded-full hover:bg-prana-gold/10 hover:text-prana-gold transition-all duration-300"
              >
                <Home size={14} />
                Home
              </Link>
              <Link
                to="/history"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300"
              >
                View History
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
