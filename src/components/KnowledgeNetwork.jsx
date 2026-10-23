import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const NODES = [
  { id: 'symptoms', label: 'Symptoms', x: 50, y: 50, color: '#D6AD6C', size: 56 },
  { id: 'who', label: 'WHO', x: 20, y: 20, color: '#0093D5', size: 44 },
  { id: 'nccih', label: 'NCCIH', x: 80, y: 18, color: '#1B5E20', size: 44 },
  { id: 'ayush', label: 'AYUSH', x: 15, y: 75, color: '#E65100', size: 44 },
  { id: 'pubmed', label: 'PubMed', x: 82, y: 72, color: '#1565C0', size: 44 },
  { id: 'mayo', label: 'Mayo Clinic', x: 50, y: 90, color: '#0D47A1', size: 44 },
];

const CONNECTIONS = [
  { from: 'symptoms', to: 'who' },
  { from: 'symptoms', to: 'nccih' },
  { from: 'symptoms', to: 'ayush' },
  { from: 'symptoms', to: 'pubmed' },
  { from: 'symptoms', to: 'mayo' },
];

export default function KnowledgeNetwork({ activeNodeIndex = -1 }) {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 600, h: 500 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ w: width, h: height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getPos = (node) => ({
    x: (node.x / 100) * dims.w,
    y: (node.y / 100) * dims.h,
  });

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-2xl mx-auto aspect-square"
      aria-label="Knowledge network visualization"
    >
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${dims.w} ${dims.h}`}>
        {CONNECTIONS.map((conn, i) => {
          const from = NODES.find((n) => n.id === conn.from);
          const to = NODES.find((n) => n.id === conn.to);
          const fromPos = getPos(from);
          const toPos = getPos(to);
          const toNodeIndex = NODES.findIndex((n) => n.id === conn.to);
          const isActive = toNodeIndex <= activeNodeIndex + 1;

          return (
            <g key={`${conn.from}-${conn.to}`}>
              {/* Line */}
              <motion.line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={isActive ? to.color : 'rgba(255,255,255,0.05)'}
                strokeWidth={isActive ? 1.5 : 0.5}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.3 }}
              />

              {/* Travelling particle */}
              {isActive && (
                <motion.circle
                  r="3"
                  fill={to.color}
                  initial={{ cx: fromPos.x, cy: fromPos.y, opacity: 0 }}
                  animate={{
                    cx: [fromPos.x, toPos.x, fromPos.x],
                    cy: [fromPos.y, toPos.y, fromPos.y],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const pos = getPos(node);
        const isCenter = node.id === 'symptoms';
        const isActive = isCenter || i <= activeNodeIndex + 1;

        return (
          <motion.div
            key={node.id}
            className="absolute flex flex-col items-center"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            {/* Glow rings */}
            {isActive && (
              <>
                <div
                  className="absolute rounded-full ring-pulse"
                  style={{
                    width: node.size + 20,
                    height: node.size + 20,
                    backgroundColor: `${node.color}08`,
                    border: `1px solid ${node.color}20`,
                  }}
                />
                <div
                  className="absolute rounded-full ring-pulse-delayed"
                  style={{
                    width: node.size + 36,
                    height: node.size + 36,
                    backgroundColor: `${node.color}04`,
                    border: `1px solid ${node.color}10`,
                  }}
                />
              </>
            )}

            {/* Node circle */}
            <div
              className="rounded-full flex items-center justify-center transition-all duration-700"
              style={{
                width: node.size,
                height: node.size,
                backgroundColor: isActive ? `${node.color}15` : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${isActive ? `${node.color}40` : 'rgba(255,255,255,0.06)'}`,
                boxShadow: isActive ? `0 0 20px ${node.color}15` : 'none',
              }}
            >
              <span
                className="font-body text-[10px] sm:text-xs font-medium text-center leading-tight px-1"
                style={{ color: isActive ? node.color : 'rgba(255,255,255,0.3)' }}
              >
                {node.label}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
