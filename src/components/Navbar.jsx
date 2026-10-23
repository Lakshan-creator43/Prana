import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/sources', label: 'Sources' },
  { to: '/history', label: 'History' },
  { to: '/saved', label: 'Saved' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="glass fixed top-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="PRANA Home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            className="transition-transform duration-500 group-hover:rotate-12"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="14" stroke="#D6AD6C" strokeWidth="1.5" />
            <path
              d="M16 6C16 6 12 12 12 18C12 22 14 26 16 26C18 26 20 22 20 18C20 12 16 6 16 6Z"
              fill="#2D5A3D"
              opacity="0.8"
            />
            <path
              d="M16 8C16 8 13 13 13 18C13 21 14.5 24 16 24"
              stroke="#D6AD6C"
              strokeWidth="0.75"
              fill="none"
            />
          </svg>
          <span className="font-heading text-xl tracking-widest text-prana-ivory font-semibold">
            PRANA
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-body transition-colors duration-300 ${
                pathname === link.to
                  ? 'text-prana-gold'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/5 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-body py-2 transition-colors duration-300 ${
                    pathname === link.to
                      ? 'text-prana-gold'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
