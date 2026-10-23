import { motion } from 'framer-motion';

const RISK_CONFIG = {
  low: {
    color: '#4CAF50',
    label: 'LOW RISK',
    description: 'Based on the symptoms described, no high-risk indicators were identified.',
    bgGlow: 'rgba(76,175,80,0.06)',
  },
  moderate: {
    color: '#D4A844',
    label: 'MODERATE',
    description: 'Some symptoms may warrant attention. Review the safety details below.',
    bgGlow: 'rgba(212,168,68,0.06)',
  },
  high: {
    color: '#C44D3F',
    label: 'HIGH RISK',
    description: 'These symptoms may require professional medical attention.',
    bgGlow: 'rgba(196,77,63,0.06)',
  },
};

export default function RiskRing({ level = 'low', size = 200 }) {
  const config = RISK_CONFIG[level] || RISK_CONFIG.low;
  const r = size / 2 - 15;
  const circumference = 2 * Math.PI * r;
  const fillPercent = level === 'low' ? 0.3 : level === 'moderate' ? 0.6 : 0.95;

  return (
    <div className="flex flex-col items-center gap-6" role="status" aria-label={`Risk level: ${config.label}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow rings */}
        <div
          className="absolute inset-0 rounded-full ring-pulse"
          style={{
            background: `radial-gradient(circle, ${config.bgGlow} 0%, transparent 70%)`,
            transform: 'scale(1.5)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full ring-pulse-delayed"
          style={{
            background: `radial-gradient(circle, ${config.bgGlow} 0%, transparent 70%)`,
            transform: 'scale(2)',
          }}
        />
        <div
          className="absolute inset-0 rounded-full ring-pulse-delayed-2"
          style={{
            background: `radial-gradient(circle, ${config.bgGlow} 0%, transparent 70%)`,
            transform: 'scale(2.5)',
          }}
        />

        {/* SVG Ring */}
        <svg width={size} height={size} className="relative z-10">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="3"
          />
          {/* Fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={config.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - fillPercent) }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
              filter: `drop-shadow(0 0 8px ${config.color}40)`,
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span
            className="font-heading text-2xl sm:text-3xl font-semibold tracking-wide"
            style={{ color: config.color }}
          >
            {config.label}
          </span>
        </div>
      </div>

      <p className="text-white/40 text-sm font-body text-center max-w-xs">
        {config.description}
      </p>
    </div>
  );
}
