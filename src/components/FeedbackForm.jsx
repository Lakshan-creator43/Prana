import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, CheckCircle2, MessageSquarePlus, Loader2 } from 'lucide-react';
import { submitFeedback } from '../services/api';

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
const RATING_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [helpful, setHelpful] = useState('');
  const [improve, setImprove] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      await submitFeedback(rating, helpful.trim(), improve.trim());
      setSubmitted(true);
    } catch (err) {
      console.error('[PRANA] Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const activeRating = hoveredStar || rating;

  return (
    <motion.section
      className="mb-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={reveal}
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          /* ── Success State ── */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 rounded-2xl border border-green-500/10 bg-green-500/[0.03] text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
            >
              <CheckCircle2 size={40} className="mx-auto mb-4 text-green-400/60" />
            </motion.div>
            <h3 className="font-heading text-2xl text-prana-ivory mb-2">
              Thank you for your feedback!
            </h3>
            <p className="text-white/30 font-body text-sm max-w-md mx-auto">
              Your feedback helps us improve the quality of our research and recommendations.
            </p>
          </motion.div>
        ) : (
          /* ── Feedback Form ── */
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
              <h2 className="font-heading text-2xl text-prana-ivory flex items-center gap-2">
                <MessageSquarePlus size={18} className="text-prana-gold/50" />
                How was this research?
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                {/* Star Rating */}
                <div className="mb-6">
                  <label className="block text-white/30 font-body text-xs mb-3">
                    Rate the quality of these results
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="group p-1 rounded-lg transition-all duration-200 hover:scale-110"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={28}
                          className={`transition-all duration-300 ${
                            star <= activeRating
                              ? 'fill-current drop-shadow-lg'
                              : 'text-white/10 group-hover:text-white/20'
                          }`}
                          style={{
                            color: star <= activeRating ? RATING_COLORS[activeRating] : undefined,
                          }}
                        />
                      </button>
                    ))}

                    {/* Rating label */}
                    <AnimatePresence mode="wait">
                      {activeRating > 0 && (
                        <motion.span
                          key={activeRating}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          className="ml-3 text-xs font-body font-medium px-2.5 py-1 rounded-full"
                          style={{
                            color: RATING_COLORS[activeRating],
                            backgroundColor: `${RATING_COLORS[activeRating]}12`,
                            borderWidth: 1,
                            borderColor: `${RATING_COLORS[activeRating]}25`,
                          }}
                        >
                          {RATING_LABELS[activeRating]}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Text fields — only show after rating is selected */}
                <AnimatePresence>
                  {rating > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* What was helpful */}
                      <div className="mb-4">
                        <label
                          htmlFor="feedback-helpful"
                          className="block text-white/30 font-body text-xs mb-2"
                        >
                          What was most helpful? <span className="text-white/15">(optional)</span>
                        </label>
                        <textarea
                          id="feedback-helpful"
                          value={helpful}
                          onChange={(e) => setHelpful(e.target.value)}
                          placeholder="e.g., The ingredients list was very detailed..."
                          maxLength={2000}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 placeholder:text-white/12 font-body text-sm leading-relaxed resize-none focus:outline-none focus:border-prana-gold/30 focus:bg-white/[0.04] transition-all duration-300"
                        />
                      </div>

                      {/* What to improve */}
                      <div className="mb-5">
                        <label
                          htmlFor="feedback-improve"
                          className="block text-white/30 font-body text-xs mb-2"
                        >
                          What could be improved? <span className="text-white/15">(optional)</span>
                        </label>
                        <textarea
                          id="feedback-improve"
                          value={improve}
                          onChange={(e) => setImprove(e.target.value)}
                          placeholder="e.g., I'd like more preparation variations..."
                          maxLength={2000}
                          rows={2}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 placeholder:text-white/12 font-body text-sm leading-relaxed resize-none focus:outline-none focus:border-prana-gold/30 focus:bg-white/[0.04] transition-all duration-300"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white/12 font-body">
                    Your feedback is anonymous
                  </p>
                  <button
                    type="submit"
                    disabled={rating === 0 || submitting}
                    className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-body font-medium text-prana-gold bg-prana-gold/8 border border-prana-gold/20 rounded-full hover:bg-prana-gold/15 disabled:opacity-30 disabled:hover:bg-prana-gold/8 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
