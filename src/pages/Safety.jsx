import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Pill,
  Heart,
  Phone,
  UserCog,
  Home,
} from 'lucide-react';
import { usePrana } from '../context/PranaContext';
import { useToast } from '../components/Toast';
import { getSafety } from '../services/api';
import RiskRing from '../components/RiskRing';
import SourceBadge from '../components/SourceBadge';
import UserProfileModal from '../components/UserProfileModal';
import { SafetySkeleton } from '../components/Skeleton';
import PageTransition from '../components/PageTransition';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

export default function Safety() {
  const { riskLevel, redFlags, selectedRemedy, safetyData, setSafetyData, userProfile, setUserProfile } = usePrana();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [demoLevel, setDemoLevel] = useState(riskLevel);
  const [loading, setLoading] = useState(!safetyData);
  const [profileOpen, setProfileOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchSafety = async (profile = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSafety(
        selectedRemedy?.id || 'ginger-honey-decoction',
        profile || undefined,
      );
      setSafetyData(data);
    } catch (err) {
      setError('Failed to load safety data. Please try again.');
      toast('Safety check failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!safetyData) {
      fetchSafety(userProfile);
    }
  }, []);

  const handleProfileSubmit = (profile) => {
    setUserProfile(profile);
    setSafetyData(null);
    fetchSafety(profile);
    const hasData =
      profile.allergies.length > 0 ||
      profile.conditions.length > 0 ||
      profile.medications.length > 0;
    if (hasData) {
      toast('Running personalised safety check...', 'info');
    }
  };

  const activeLevel = demoLevel;
  const isHigh = activeLevel === 'high';

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            to={isHigh ? '/symptoms' : '/results'}
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
            Safety Assessment
          </motion.h1>

          <motion.p
            className="text-center text-white/30 font-body text-sm mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Comprehensive safety check based on your symptoms and selected remedies.
          </motion.p>

          {/* Personalise button */}
          {!isHigh && (
            <motion.div
              className="flex justify-center mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 px-5 py-2 text-xs font-body font-medium text-prana-gold bg-prana-gold/8 border border-prana-gold/20 rounded-full hover:bg-prana-gold/15 transition-all duration-300"
              >
                <UserCog size={14} />
                {userProfile ? 'Update Health Profile' : 'Add Your Health Profile'}
              </button>
              {userProfile && (
                <span className="ml-3 self-center text-[10px] font-body text-green-400/60">
                  ✓ Profile applied
                </span>
              )}
            </motion.div>
          )}

          {/* Risk Ring */}
          {!loading && (
            <motion.div
              className="flex justify-center mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <RiskRing level={activeLevel} size={220} />
            </motion.div>
          )}

          {/* Loading skeleton */}
          {loading && <SafetySkeleton />}

          {/* Error state */}
          {error && !loading && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle size={28} className="text-red-400/60 mx-auto mb-4" />
              <p className="text-white/40 font-body text-sm mb-4">{error}</p>
              <button
                onClick={() => fetchSafety(userProfile)}
                className="px-6 py-2 text-sm font-body font-medium text-prana-gold bg-prana-gold/10 border border-prana-gold/30 rounded-full hover:bg-prana-gold/20 transition-all duration-300"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* HIGH RISK BLOCK */}
          {isHigh && !loading && (
            <motion.div
              className="mb-12 p-8 rounded-2xl border border-red-500/20 bg-red-500/[0.03] text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <AlertTriangle size={32} className="text-red-400 mx-auto mb-4" />
              <h2 className="font-heading text-2xl text-red-400 mb-2">
                HIGH RISK: These symptoms may require professional medical attention.
              </h2>
              <p className="text-white/40 font-body text-sm mb-6 max-w-md mx-auto">
                Based on the symptoms described, we've identified indicators
                that suggest professional medical evaluation is recommended.
                No remedies are shown for high-risk assessments.
              </p>
              {redFlags.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {redFlags.map((flag) => (
                    <span
                      key={flag}
                      className="px-3 py-1 text-xs font-body bg-red-500/10 text-red-400 border border-red-500/20 rounded-full"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              )}
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-8 py-3 text-sm font-body font-medium text-white bg-red-500/20 border border-red-500/30 rounded-full hover:bg-red-500/30 transition-all duration-300"
              >
                <Phone size={14} />
                Consult a Healthcare Professional
              </a>
            </motion.div>
          )}

          {/* Safety details (for low/moderate) */}
          {!isHigh && !loading && !error && safetyData && (
            <motion.div
              className="space-y-8"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Symptom Risk */}
              <motion.section
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                variants={reveal}
              >
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-prana-gold/60" />
                  <h3 className="font-heading text-xl text-prana-ivory">
                    Symptom Risk Assessment
                  </h3>
                </div>
                <p className="text-white/40 font-body text-sm leading-relaxed">
                  Based on the symptoms described, no high-risk indicators were
                  identified. The symptoms are consistent with common conditions
                  that traditional remedies have historically addressed.
                </p>
              </motion.section>

              {/* Allergy Check */}
              <motion.section
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                variants={reveal}
              >
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={16} className="text-amber-400/60" />
                  <h3 className="font-heading text-xl text-prana-ivory">
                    Allergy Check
                  </h3>
                </div>
                {safetyData.allergyWarnings.length === 0 ? (
                  <p className="text-white/30 font-body text-xs italic">
                    No allergy warnings detected for this remedy.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {safetyData.allergyWarnings.map((w, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="font-body text-sm text-white/50 font-medium">
                          {w.allergen}
                        </p>
                        <p className="font-body text-xs text-white/30 mt-0.5">
                          Severity: {w.severity}
                        </p>
                        <SourceBadge sourceRef={w.source} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Condition Check */}
              <motion.section
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                variants={reveal}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart size={16} className="text-prana-gold/60" />
                  <h3 className="font-heading text-xl text-prana-ivory">
                    Existing Condition Check
                  </h3>
                </div>
                {safetyData.conditionWarnings.length === 0 ? (
                  <p className="text-white/30 font-body text-xs italic">
                    No condition-related warnings detected.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {safetyData.conditionWarnings.map((w, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="font-body text-sm text-white/50 font-medium">
                          {w.condition}
                        </p>
                        <p className="font-body text-xs text-white/30 mt-1">
                          {w.note}
                        </p>
                        <SourceBadge sourceRef={w.source} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Medication Interactions */}
              <motion.section
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
                variants={reveal}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Pill size={16} className="text-amber-400/60" />
                  <h3 className="font-heading text-xl text-prana-ivory">
                    Medication Interaction Check
                  </h3>
                </div>
                {safetyData.medicationInteractions.length === 0 ? (
                  <p className="text-white/30 font-body text-xs italic">
                    No medication interactions detected.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {safetyData.medicationInteractions.map((w, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <p className="font-body text-sm text-white/50 font-medium">
                          {w.medication}
                        </p>
                        <p className="font-body text-xs text-white/30 mt-1">
                          {w.interaction}
                        </p>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-body font-semibold ${
                            w.severity === 'high'
                              ? 'bg-red-500/10 text-red-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {w.severity.toUpperCase()}
                        </span>
                        <SourceBadge sourceRef={w.source} />
                      </div>
                    ))}
                  </div>
                )}
              </motion.section>

              {/* Important Warning */}
              <motion.section
                className="p-6 rounded-2xl border border-amber-500/10 bg-amber-500/[0.02]"
                variants={reveal}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-amber-400" />
                  <h3 className="font-heading text-lg text-amber-400">
                    Important Warnings
                  </h3>
                </div>
                <p className="text-white/40 font-body text-xs leading-relaxed">
                  These remedies provide retrieved, cited information and are
                  not a substitute for professional medical advice. If symptoms
                  persist or worsen, consult a qualified healthcare
                  professional. Always inform your doctor about any traditional
                  remedies you are using.
                </p>
              </motion.section>
            </motion.div>
          )}

          {/* Demo state switcher */}
          <motion.div
            className="mt-12 p-4 rounded-xl border border-white/5 bg-white/[0.02]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-white/25 text-[10px] font-body mb-2 uppercase tracking-wider">
              Demo: Preview risk states
            </p>
            <div className="flex gap-2">
              {['low', 'moderate', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDemoLevel(level)}
                  className={`px-3 py-1.5 text-xs font-body rounded-full border transition-all duration-300 ${
                    demoLevel === level
                      ? 'bg-prana-gold/10 text-prana-gold border-prana-gold/30'
                      : 'bg-white/[0.03] text-white/30 border-white/8 hover:bg-white/[0.06]'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
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
              {!isHigh && (
                <Link
                  to="/sources"
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-body font-medium text-[#050505] bg-prana-gold rounded-full gold-glow hover:brightness-110 transition-all duration-300"
                >
                  See Sources
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSubmit={handleProfileSubmit}
        initialProfile={userProfile}
      />
    </PageTransition>
  );
}
