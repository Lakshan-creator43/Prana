import { ExternalLink } from 'lucide-react';
import { getSourceById } from '../data/sources';

export default function SourceBadge({ sourceRef, compact = false }) {
  if (!sourceRef) return null;
  const source = getSourceById(sourceRef.id);
  if (!source) return null;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-body font-medium bg-white/5 text-white/40 border border-white/8">
        <span style={{ color: source.color }}>{source.shortName}</span>
      </span>
    );
  }

  return (
    <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
      <div
        className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-body font-bold shrink-0 mt-0.5"
        style={{ backgroundColor: `${source.color}15`, color: source.color }}
      >
        {source.monogram}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-body text-white/50 leading-relaxed">
          {sourceRef.citation}
        </p>
        <p className="text-[10px] font-body text-white/25 mt-0.5 flex items-center gap-1">
          {source.shortName}
          <ExternalLink size={8} className="inline" />
        </p>
      </div>
    </div>
  );
}
