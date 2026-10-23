import { motion } from 'framer-motion';

/**
 * Reusable skeleton loading components that match PRANA's dark aesthetic.
 */

export function SkeletonLine({ width = '100%', height = 12, className = '' }) {
  return (
    <motion.div
      className={`rounded-md bg-white/[0.04] ${className}`}
      style={{ width, height }}
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-3 ${className}`}>
      <SkeletonLine width="40%" height={18} />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '70%' : '100%'} height={12} />
      ))}
    </div>
  );
}

export function SkeletonRing({ size = 160, className = '' }) {
  return (
    <motion.div
      className={`rounded-full border-2 border-white/5 ${className}`}
      style={{ width: size, height: size }}
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export function SafetySkeleton() {
  return (
    <div className="space-y-8 animate-pulse-none">
      {/* Risk ring */}
      <div className="flex justify-center mb-10">
        <SkeletonRing size={220} />
      </div>

      {/* Cards */}
      <SkeletonCard lines={2} />
      <SkeletonCard lines={3} />
      <SkeletonCard lines={3} />
      <SkeletonCard lines={2} />
    </div>
  );
}

export function HistorySkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <motion.div
              className="w-3 h-3 rounded-full bg-white/[0.06] mt-6"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            />
            {i < count - 1 && <div className="w-px flex-1 bg-white/5" />}
          </div>
          <div className="flex-1 p-5 mb-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
            <div className="flex items-start justify-between gap-3">
              <SkeletonLine width="75%" height={14} />
              <SkeletonLine width={50} height={18} />
            </div>
            <div className="flex gap-4">
              <SkeletonLine width={80} height={10} />
              <SkeletonLine width={100} height={10} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
