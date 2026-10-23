import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  AlertTriangle,
  Search,
  FileText,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
  Home,
} from 'lucide-react';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const STEPS = [
  {
    icon: BookOpen,
    number: '01',
    title: 'Describe Symptoms',
    description:
      'You describe what you\'re experiencing in plain language. No forms, no dropdowns — just tell us how you feel.',
    detail: 'Your input is analysed locally to understand the nature and severity of your symptoms.',
  },
  {
    icon: AlertTriangle,
    number: '02',
    title: 'Danger Check',
    description:
      'Symptoms are immediately screened against a database of high-risk indicators (chest pain, difficulty breathing, etc.).',
    detail:
      'If red flags are detected, the flow halts and you\'re advised to consult a healthcare professional. No remedies are shown.',
  },
  {
    icon: Search,
    number: '03',
    title: 'Source Search',
    description:
      'We query five trusted medical and traditional-medicine databases: WHO, NCCIH, Ministry of AYUSH, PubMed, and Mayo Clinic.',
    detail:
      'Each source is queried independently and results are cross-referenced for consistency and reliability.',
  },
  {
    icon: FileText,
    number: '04',
    title: 'Extraction',
    description:
      'Relevant traditional and home remedies are extracted from the search results, along with their preparation methods and usage guidelines.',
    detail:
      'Only remedies with verifiable citations from the queried sources are included in the results.',
  },
  {
    icon: ShieldCheck,
    number: '05',
    title: 'Safety Check',
    description:
      'Each remedy is checked for common allergens, potential medication interactions, and contraindications for existing conditions.',
    detail:
      'Allergen tags are added to individual ingredients, and interaction warnings are flagged prominently.',
  },
  {
    icon: CheckCircle,
    number: '06',
    title: 'Cited Result',
    description:
      'You receive the remedy with every claim — ingredients, steps, precautions — visibly tagged with its source citation.',
    detail:
      'Nothing is anonymous. You can trace every piece of information back to the institution that published it.',
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

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
            className="font-heading text-4xl sm:text-5xl md:text-6xl text-prana-ivory text-center mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            How PRANA Works
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-20 max-w-md mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Six transparent steps from your symptoms to a fully cited,
            safety-checked traditional remedy.
          </motion.p>

          {/* Steps */}
          <motion.div
            className="space-y-0"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                className="relative flex gap-6"
                variants={reveal}
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-prana-gold/5 border border-prana-gold/15 flex items-center justify-center shrink-0">
                    <step.icon size={20} className="text-prana-gold/50" />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-prana-gold/10 to-transparent my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-12 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-prana-gold/25 font-heading text-2xl font-light">
                      {step.number}
                    </span>
                    <h2 className="font-heading text-2xl text-prana-ivory">
                      {step.title}
                    </h2>
                  </div>
                  <p className="text-white/45 font-body text-sm leading-relaxed mb-2">
                    {step.description}
                  </p>
                  <p className="text-white/25 font-body text-xs leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="text-center mt-8 pt-12 border-t border-white/5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/30 font-body text-sm mb-6">
              Ready to try it?
            </p>
            <Link
              to="/symptoms"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-body font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300"
            >
              Begin Research
              <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
