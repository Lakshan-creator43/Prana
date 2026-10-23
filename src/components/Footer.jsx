import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#030303]" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="14" stroke="#D6AD6C" strokeWidth="1.5" />
                <path
                  d="M16 6C16 6 12 12 12 18C12 22 14 26 16 26C18 26 20 22 20 18C20 12 16 6 16 6Z"
                  fill="#2D5A3D"
                  opacity="0.8"
                />
              </svg>
              <span className="font-heading text-lg tracking-widest text-prana-ivory font-semibold">
                PRANA
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-3">
              Traditional Knowledge. Modern Trust.
            </p>
            <p className="text-white/30 text-xs leading-relaxed">
              PRANA provides retrieved, cited information from trusted medical
              and traditional-medicine sources. It does not constitute medical
              advice, diagnosis, or treatment. Always consult a qualified
              healthcare professional for medical concerns.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <h4 className="text-prana-ivory/60 text-xs font-body font-semibold uppercase tracking-widest mb-4">
                Explore
              </h4>
              <div className="flex flex-col gap-2.5">
                <Link to="/how-it-works" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  How It Works
                </Link>
                <Link to="/sources" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  Sources
                </Link>
                <Link to="/history" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                  History
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/25 text-xs">
            &copy; {new Date().getFullYear()} PRANA. All rights reserved.
          </p>
          <p className="text-white/25 text-xs flex items-center gap-1.5">
            Built with{' '}
            <Heart size={12} className="text-prana-gold/50" fill="currentColor" />{' '}
            by{' '}
            <span className="text-white/40 font-medium">SideQuest</span>
            <span className="text-white/20 mx-1">|</span>
            AI &amp; Data Science, Dhanalakshmi Srinivasan College of Engineering, Coimbatore
          </p>
        </div>
      </div>
    </footer>
  );
}
