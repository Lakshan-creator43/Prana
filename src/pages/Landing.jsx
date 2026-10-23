import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShieldCheck,
  FileText,
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import HeroScroll from '../components/HeroScroll';
import FloatingBotanicals from '../components/FloatingBotanicals';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const INSTITUTIONS = [
  { name: 'WHO', full: 'World Health Organization' },
  { name: 'NCCIH', full: 'National Center for Complementary and Integrative Health' },
  { name: 'AYUSH', full: 'Ministry of AYUSH' },
  { name: 'PubMed', full: 'National Library of Medicine' },
  { name: 'Mayo Clinic', full: 'Mayo Clinic' },
];

const PRINCIPLES = [
  {
    icon: Search,
    number: '01',
    title: 'Source-first',
    text: 'Every recommendation begins with a search across trusted medical and traditional-medicine databases — not a language model\'s imagination.',
  },
  {
    icon: ShieldCheck,
    number: '02',
    title: 'Safety-checked',
    text: 'Symptoms are assessed for red flags, allergens are cross-referenced, and medication interactions are flagged before any remedy is shown.',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Cited by default',
    text: 'Every claim, ingredient, step, and precaution shows exactly where it came from. No anonymous tips, no "studies show."',
  },
];

const STEPS = [
  { icon: BookOpen, label: 'Symptoms', desc: 'Describe what you\'re feeling' },
  { icon: AlertTriangle, label: 'Danger Check', desc: 'Screen for red flags' },
  { icon: Search, label: 'Source Search', desc: 'Query trusted databases' },
  { icon: FileText, label: 'Extraction', desc: 'Extract relevant remedies' },
  { icon: ShieldCheck, label: 'Allergy Check', desc: 'Cross-reference safety' },
  { icon: CheckCircle, label: 'Cited Result', desc: 'Present with sources' },
];

export default function Landing() {
  return (
    <PageTransition>
      <FloatingBotanicals />

      {/* ── Hero ── */}
      <HeroScroll />

      {/* ── Trusted Sources Strip ── */}
      <motion.section
        className="py-24 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.p
          className="text-center text-xs font-body text-white/25 uppercase tracking-[0.2em] mb-10"
          variants={reveal}
        >
          Researching from trusted sources
        </motion.p>
        <motion.div
          className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 max-w-4xl mx-auto"
          variants={stagger}
        >
          {INSTITUTIONS.map((inst) => (
            <motion.div
              key={inst.name}
              className="flex flex-col items-center gap-1"
              variants={reveal}
            >
              <span className="font-heading text-lg sm:text-xl text-prana-ivory/40 tracking-wide">
                {inst.name}
              </span>
              <span className="text-[10px] font-body text-white/15 text-center max-w-[120px]">
                {inst.full}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── "A research archive, not a chatbot" ── */}
      <motion.section
        className="py-28 px-6 max-w-5xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2
          className="font-heading text-4xl sm:text-5xl md:text-6xl text-prana-ivory text-center mb-4 tracking-tight"
          variants={reveal}
        >
          A research archive, not a chatbot.
        </motion.h2>
        <motion.p
          className="text-center text-white/30 font-body text-sm mb-20 max-w-lg mx-auto"
          variants={reveal}
        >
          PRANA doesn't generate advice. It retrieves cited information from the world's most trusted health authorities.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-8 sm:gap-12"
          variants={stagger}
        >
          {PRINCIPLES.map((p) => (
            <motion.div
              key={p.number}
              className="group"
              variants={reveal}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-prana-gold/30 font-heading text-3xl font-light">
                  {p.number}
                </span>
                <p.icon size={18} className="text-prana-gold/50" />
              </div>
              <h3 className="font-heading text-xl text-prana-ivory mb-2">
                {p.title}
              </h3>
              <p className="text-white/35 text-sm font-body leading-relaxed">
                {p.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Six-Step Path ── */}
      <motion.section
        className="py-28 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-prana-ivory text-center mb-4 tracking-tight"
          variants={reveal}
        >
          From symptoms to cited results.
        </motion.h2>
        <motion.p
          className="text-center text-white/30 font-body text-sm mb-16 max-w-md mx-auto"
          variants={reveal}
        >
          Six steps. Every one transparent.
        </motion.p>

        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-6"
          variants={stagger}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-500 group"
              variants={reveal}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-prana-gold/5 flex items-center justify-center">
                  <step.icon size={14} className="text-prana-gold/50" />
                </div>
                <span className="text-white/15 font-body text-xs">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-heading text-lg text-prana-ivory mb-1">
                {step.label}
              </h3>
              <p className="text-white/30 text-xs font-body">
                {step.desc}
              </p>
              {i < STEPS.length - 1 && (
                <ArrowRight
                  size={12}
                  className="absolute top-1/2 -right-3 text-white/10 hidden md:block"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* ── Safety-First Band ── */}
      <motion.section
        className="py-20 px-6 border-y border-white/5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            className="w-12 h-12 rounded-full bg-prana-gold/5 flex items-center justify-center mx-auto mb-6"
            variants={reveal}
          >
            <ShieldCheck size={20} className="text-prana-gold/60" />
          </motion.div>
          <motion.h2
            className="font-heading text-3xl sm:text-4xl text-prana-ivory mb-4 tracking-tight"
            variants={reveal}
          >
            Safety is not optional.
          </motion.h2>
          <motion.p
            className="text-white/35 font-body text-sm leading-relaxed max-w-xl mx-auto"
            variants={reveal}
          >
            Serious symptoms automatically halt the flow and show "Consult a
            Healthcare Professional" instead of any remedy. Allergies,
            medication interactions, and existing conditions are checked before
            you see a single ingredient.
          </motion.p>
        </div>
      </motion.section>

      {/* ── Final CTA ── */}
      <motion.section
        className="py-32 px-6 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2
          className="font-heading text-4xl sm:text-5xl md:text-6xl text-prana-ivory mb-4 tracking-tight"
          variants={reveal}
        >
          Begin Research
        </motion.h2>
        <motion.p
          className="text-white/30 font-body text-sm mb-10 max-w-md mx-auto"
          variants={reveal}
        >
          Describe your symptoms. We'll search trusted sources and show you
          exactly where every claim comes from.
        </motion.p>
        <motion.div variants={reveal}>
          <Link
            to="/symptoms"
            className="inline-block px-10 py-3.5 font-body text-sm font-medium text-[#050505] bg-prana-gold rounded-full gold-glow-strong hover:brightness-110 transition-all duration-300"
          >
            Begin Research
          </Link>
        </motion.div>
      </motion.section>
    </PageTransition>
  );
}
