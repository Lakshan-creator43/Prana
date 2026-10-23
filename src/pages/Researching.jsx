import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { usePrana } from '../context/PranaContext';
import { useToast } from '../components/Toast';
import { analyzeSymptoms, researchRemedies } from '../services/api';
import KnowledgeNetwork from '../components/KnowledgeNetwork';
import StepIndicator from '../components/StepIndicator';
import PageTransition from '../components/PageTransition';

const CHECKLIST = [
  'Understanding symptoms',
  'Checking medical information',
  'Searching trusted sources',
  'Comparing information',
  'Checking safety factors',
  'Preparing verified results',
];

export default function Researching() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    symptoms,
    setRiskLevel,
    setRedFlags,
    setResults,
    setSourcesUsed,
    setCurrentStep,
  } = usePrana();

  const [activeCheck, setActiveCheck] = useState(0);
  const [activeNode, setActiveNode] = useState(-1);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // Redirect if no symptoms
    if (!symptoms || symptoms.trim().length < 1) {
      navigate('/symptoms');
      return;
    }

    setCurrentStep(2);

    // Clear previous results
    setResults([]);
    setSourcesUsed([]);

    /* Checklist animation */
    const checkInterval = setInterval(() => {
      setActiveCheck((prev) => {
        if (prev >= CHECKLIST.length - 1) {
          clearInterval(checkInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    /* Node activation */
    const nodeInterval = setInterval(() => {
      setActiveNode((prev) => {
        if (prev >= 4) {
          clearInterval(nodeInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1400);

    /* Actually fetch data */
    const doResearch = async () => {
      try {
        const analysis = await analyzeSymptoms(symptoms);
        setRiskLevel(analysis.riskLevel);
        setRedFlags(analysis.redFlags || []);

        // For HIGH risk: skip remedy research entirely — go straight to safety page
        if (analysis.riskLevel === 'high') {
          setResults([]);
          setSourcesUsed([]);
          setTimeout(() => {
            setCurrentStep(3);
            navigate('/safety', { replace: true });
          }, Math.max(0, CHECKLIST.length * 1200 - 2000));
          return;
        }

        const research = await researchRemedies(symptoms);
        const remedies = research.remedies || [];
        setResults(remedies);
        setSourcesUsed(research.sourcesUsed || []);

        if (remedies.length === 0) {
          toast('No remedies found for these symptoms. Try different keywords.', 'info');
        }

        /* Wait for animation to finish */
        setTimeout(() => {
          setCurrentStep(3);
          navigate('/results', { replace: true });
        }, Math.max(0, CHECKLIST.length * 1200 - 2000));
      } catch (err) {
        console.error('[PRANA] Research error:', err);
        toast('Research failed. Please check your connection and try again.', 'error', 5000);
        /* Navigate back to symptoms so user can retry */
        setTimeout(() => navigate('/symptoms', { replace: true }), 3000);
      }
    };

    doResearch();

    return () => {
      clearInterval(checkInterval);
      clearInterval(nodeInterval);
    };
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <StepIndicator current={2} />

          <motion.h1
            className="font-heading text-3xl sm:text-4xl md:text-5xl text-prana-ivory text-center mb-3 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Researching trusted sources.
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Querying medical and traditional-medicine databases for "{symptoms.slice(0, 60)}
            {symptoms.length > 60 ? '...' : ''}"
          </motion.p>

          {/* Knowledge Network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <KnowledgeNetwork activeNodeIndex={activeNode} />
          </motion.div>

          {/* Checklist */}
          <motion.div
            className="max-w-sm mx-auto space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {CHECKLIST.map((item, i) => {
              const isDone = i < activeCheck;
              const isActive = i === activeCheck;
              return (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isDone
                        ? 'bg-prana-gold/20'
                        : isActive
                        ? 'bg-prana-gold/10 border border-prana-gold/30'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    {isDone ? (
                      <Check size={10} className="text-prana-gold" />
                    ) : isActive ? (
                      <Loader2 size={10} className="text-prana-gold animate-spin" />
                    ) : null}
                  </div>
                  <span
                    className={`font-body text-sm transition-colors duration-500 ${
                      isDone
                        ? 'text-white/50'
                        : isActive
                        ? 'text-prana-ivory/70'
                        : 'text-white/20'
                    }`}
                  >
                    {item}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
