import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6 flex flex-col items-center justify-center text-center">
        {/* 404 number */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="font-heading text-[120px] sm:text-[160px] leading-none text-white/[0.03] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-prana-gold/5 border border-prana-gold/15 flex items-center justify-center">
              <Search size={32} className="text-prana-gold/40" />
            </div>
          </div>
        </motion.div>

        <motion.h1
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-prana-ivory mb-3 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Page not found.
        </motion.h1>

        <motion.p
          className="text-white/30 font-body text-sm mb-10 max-w-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300"
          >
            <Home size={14} />
            Go Home
          </Link>
          <Link
            to="/symptoms"
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-prana-gold bg-prana-gold/10 border border-prana-gold/30 rounded-full hover:bg-prana-gold/20 transition-all duration-300"
          >
            <ArrowLeft size={14} />
            Begin Research
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
