import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ArrowRight,
  AlertTriangle,
  Clock,
  Users,
  Leaf,
  XCircle,
  Home,
} from 'lucide-react';
import { usePrana } from '../context/PranaContext';
import { getRemedyById } from '../data/remedies';
import SourceBadge from '../components/SourceBadge';
import CommentSection from '../components/CommentSection';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function RemedyDetail() {
  const { id } = useParams();
  const { selectedRemedy } = usePrana();
  const navigate = useNavigate();
  const remedy = selectedRemedy || getRemedyById(id);

  if (!remedy) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-28 pb-20 px-6 flex flex-col items-center justify-center">
          <h1 className="font-heading text-3xl text-prana-ivory mb-4">Remedy not found.</h1>
          <button onClick={() => navigate(-1)} className="text-prana-gold text-sm font-body hover:underline">
            Go back
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-white/30 hover:text-white/50 text-sm font-body transition-colors mb-8"
          >
            <ChevronLeft size={14} />
            Back
          </button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-prana-gold/8 flex items-center justify-center">
                <Leaf size={18} className="text-prana-gold/60" />
              </div>
              <div>
                <p className="text-white/25 font-body text-[11px] italic">
                  {remedy.traditionalName}
                </p>
                <p className="text-white/20 font-body text-[10px]">
                  {remedy.tradition}
                </p>
              </div>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl text-prana-ivory tracking-tight mb-4">
              {remedy.name}
            </h1>
            <p className="text-white/40 font-body text-sm leading-relaxed mb-4">
              {remedy.description}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-white/25 text-xs font-body">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                {remedy.prepTime}
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                {remedy.servings}
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  remedy.riskLevel === 'low'
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-amber-500/10 text-amber-400'
                }`}
              >
                {remedy.riskLevel.toUpperCase()} RISK
              </span>
            </div>
          </motion.div>

          {/* Traditional Use */}
          <motion.section
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="font-heading text-2xl text-prana-ivory mb-3"
              variants={reveal}
            >
              Traditional Use
            </motion.h2>
            <motion.p
              className="text-white/40 font-body text-sm leading-relaxed"
              variants={reveal}
            >
              {remedy.traditionalUse}
            </motion.p>
          </motion.section>

          {/* Ingredients */}
          <motion.section
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="font-heading text-2xl text-prana-ivory mb-4"
              variants={reveal}
            >
              Ingredients
            </motion.h2>
            <div className="space-y-3">
              {remedy.ingredients.map((ing, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02]"
                  variants={reveal}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-body text-sm text-white/70 font-medium">
                        {ing.name}
                      </p>
                      <p className="font-body text-xs text-white/30 mt-0.5">
                        {ing.amount}
                      </p>
                    </div>
                    {ing.allergens.length > 0 && (
                      <div className="flex gap-1">
                        {ing.allergens.map((a) => (
                          <span
                            key={a}
                            className="px-2 py-0.5 rounded text-[9px] font-body font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <SourceBadge sourceRef={ing.source} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Steps */}
          <motion.section
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="font-heading text-2xl text-prana-ivory mb-4"
              variants={reveal}
            >
              Preparation
            </motion.h2>
            <div className="space-y-4">
              {remedy.steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="flex gap-4"
                  variants={reveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-prana-gold/8 border border-prana-gold/20 flex items-center justify-center text-xs font-body text-prana-gold font-medium shrink-0">
                      {i + 1}
                    </div>
                    {i < remedy.steps.length - 1 && (
                      <div className="w-px flex-1 bg-white/5 mt-2" />
                    )}
                  </div>
                  <div className="pb-6 flex-1">
                    <p className="font-body text-sm text-white/60 leading-relaxed">
                      {step.instruction}
                    </p>
                    <SourceBadge sourceRef={step.source} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Usage */}
          <motion.section
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={reveal}
          >
            <h2 className="font-heading text-2xl text-prana-ivory mb-3">Usage</h2>
            <p className="text-white/40 font-body text-sm leading-relaxed">
              {remedy.usage}
            </p>
          </motion.section>

          {/* Precautions */}
          <motion.section
            className="mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="font-heading text-2xl text-prana-ivory mb-4 flex items-center gap-2"
              variants={reveal}
            >
              <AlertTriangle size={18} className="text-amber-400/60" />
              Precautions
            </motion.h2>
            <div className="space-y-3">
              {remedy.precautions.map((p, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl border border-amber-500/10 bg-amber-500/[0.02]"
                  variants={reveal}
                >
                  <p className="font-body text-sm text-white/50 leading-relaxed">
                    {p.text}
                  </p>
                  <SourceBadge sourceRef={p.source} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Who Should Avoid */}
          <motion.section
            className="mb-14"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              className="font-heading text-2xl text-prana-ivory mb-4 flex items-center gap-2"
              variants={reveal}
            >
              <XCircle size={18} className="text-red-400/60" />
              Who Should Avoid
            </motion.h2>
            <div className="space-y-3">
              {remedy.whoShouldAvoid.map((w, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-xl border border-red-500/8 bg-red-500/[0.02]"
                  variants={reveal}
                >
                  <p className="font-body text-sm text-white/50 leading-relaxed">
                    {w.text}
                  </p>
                  <SourceBadge sourceRef={w.source} />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Comments */}
          <CommentSection remedyId={remedy.id} />

          {/* Navigation */}
          <div className="flex items-center justify-between border-t border-white/5 pt-8">
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
                to="/safety"
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300"
              >
                Check Safety
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
