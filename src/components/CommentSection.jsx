import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Reply, Trash2, User, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { getComments, addComment, deleteComment } from '../services/api';

const reveal = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function SingleComment({ comment, onReply, onDelete, depth = 0 }) {
  const [showReplies, setShowReplies] = useState(true);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <motion.div
      variants={reveal}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      style={{ marginLeft: depth > 0 ? Math.min(depth * 24, 72) : 0 }}
    >
      <div
        className={`relative p-4 rounded-xl border transition-all duration-300 ${
          depth > 0
            ? 'border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08]'
            : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]'
        }`}
      >
        {/* Reply connector line */}
        {depth > 0 && (
          <div
            className="absolute -left-3 top-1/2 w-3 h-px bg-prana-gold/15"
            aria-hidden
          />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-prana-gold/20 to-prana-gold/5 flex items-center justify-center">
              <User size={11} className="text-prana-gold/60" />
            </div>
            <span className="font-body text-xs font-medium text-white/50">
              {comment.authorName}
            </span>
            <span className="text-[10px] text-white/20 font-body">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onReply(comment.id)}
              className="p-1 rounded-md text-white/20 hover:text-prana-gold/60 hover:bg-prana-gold/5 transition-all duration-200"
              aria-label="Reply"
              title="Reply"
            >
              <Reply size={12} />
            </button>
            <button
              onClick={() => onDelete(comment.id)}
              className="p-1 rounded-md text-white/20 hover:text-red-400/60 hover:bg-red-500/5 transition-all duration-200"
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="font-body text-sm text-white/45 leading-relaxed pl-8">
          {comment.content}
        </p>

        {/* Toggle replies */}
        {hasReplies && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-1 mt-2 pl-8 text-[10px] text-prana-gold/40 hover:text-prana-gold/70 font-body transition-colors duration-200"
          >
            {showReplies ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}
      </div>

      {/* Nested replies */}
      <AnimatePresence>
        {hasReplies && showReplies && (
          <motion.div
            className="mt-2 space-y-2 relative"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {depth > 0 && (
              <div
                className="absolute left-0 top-0 bottom-0 w-px bg-prana-gold/8"
                aria-hidden
              />
            )}
            {comment.replies.map((reply) => (
              <SingleComment
                key={reply.id}
                comment={reply}
                onReply={onReply}
                onDelete={onDelete}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CommentSection({ remedyId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(remedyId);
      setComments(data.comments || []);
    } catch (err) {
      console.error('[PRANA] Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [remedyId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const data = await addComment(remedyId, authorName || 'Anonymous', content.trim(), replyingTo);
      if (data.comment) {
        // Re-fetch to get correct threaded structure
        await fetchComments();
        setContent('');
        setReplyingTo(null);
      }
    } catch (err) {
      console.error('[PRANA] Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      await fetchComments();
    } catch (err) {
      console.error('[PRANA] Failed to delete comment:', err);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    // Focus the textarea
    setTimeout(() => {
      document.getElementById('comment-content')?.focus();
    }, 100);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Find the comment being replied to (for display)
  const findComment = (list, id) => {
    for (const c of list) {
      if (c.id === id) return c;
      if (c.replies) {
        const found = findComment(c.replies, id);
        if (found) return found;
      }
    }
    return null;
  };
  const replyTarget = replyingTo ? findComment(comments, replyingTo) : null;

  return (
    <motion.section
      className="mb-14"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={reveal}
    >
      {/* Section Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between mb-6 group"
      >
        <h2 className="font-heading text-2xl text-prana-ivory flex items-center gap-2">
          <MessageCircle size={18} className="text-prana-gold/50" />
          Comments
          {comments.length > 0 && (
            <span className="text-sm font-body text-white/20 font-normal ml-1">
              ({comments.length})
            </span>
          )}
        </h2>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-white/20 group-hover:text-white/40 transition-colors"
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                {/* Reply indicator */}
                <AnimatePresence>
                  {replyTarget && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center justify-between px-3 py-2 rounded-lg bg-prana-gold/5 border border-prana-gold/10"
                    >
                      <p className="text-[11px] font-body text-prana-gold/60">
                        <Reply size={10} className="inline mr-1" />
                        Replying to <span className="font-medium">{replyTarget.authorName}</span>
                      </p>
                      <button
                        type="button"
                        onClick={cancelReply}
                        className="text-[10px] text-white/30 hover:text-white/50 font-body transition-colors"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name field */}
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your name (optional)"
                  maxLength={100}
                  className="w-full mb-3 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 placeholder:text-white/15 font-body text-sm focus:outline-none focus:border-prana-gold/30 focus:bg-white/[0.04] transition-all duration-300"
                  id="comment-author"
                />

                {/* Content field */}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={replyingTo ? 'Write your reply...' : 'Share your experience with this remedy...'}
                  maxLength={2000}
                  rows={3}
                  className="w-full mb-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 placeholder:text-white/15 font-body text-sm leading-relaxed resize-none focus:outline-none focus:border-prana-gold/30 focus:bg-white/[0.04] transition-all duration-300"
                  id="comment-content"
                />

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/15 font-body">
                    {content.length}/2000
                  </span>
                  <button
                    type="submit"
                    disabled={!content.trim() || submitting}
                    className="flex items-center gap-1.5 px-5 py-2 text-xs font-body font-medium text-prana-gold bg-prana-gold/8 border border-prana-gold/20 rounded-full hover:bg-prana-gold/15 disabled:opacity-30 disabled:hover:bg-prana-gold/8 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send size={12} />
                        {replyingTo ? 'Reply' : 'Post Comment'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={20} className="text-prana-gold/40 animate-spin" />
              </div>
            ) : comments.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <MessageCircle size={28} className="mx-auto mb-3 text-white/10" />
                <p className="text-white/20 font-body text-sm">
                  No comments yet. Be the first to share your experience!
                </p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {comments.map((comment) => (
                    <SingleComment
                      key={comment.id}
                      comment={comment}
                      onReply={handleReply}
                      onDelete={handleDelete}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
