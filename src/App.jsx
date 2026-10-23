import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PranaProvider } from './context/PranaContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Symptoms from './pages/Symptoms';
import Researching from './pages/Researching';
import Results from './pages/Results';
import RemedyDetail from './pages/RemedyDetail';
import Safety from './pages/Safety';
import Sources from './pages/Sources';
import History from './pages/History';
import HowItWorks from './pages/HowItWorks';
import SavedRemedies from './pages/SavedRemedies';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <PranaProvider>
      <ToastProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-prana-bg font-body">
          <Navbar />
          <main>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/symptoms" element={<Symptoms />} />
                <Route path="/researching" element={<Researching />} />
                <Route path="/results" element={<Results />} />
                <Route path="/remedy/:id" element={<RemedyDetail />} />
                <Route path="/safety" element={<Safety />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/history" element={<History />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/saved" element={<SavedRemedies />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </PranaProvider>
  );
}
