import { createContext, useContext, useState, useCallback } from 'react';

const PranaContext = createContext(null);

const DEFAULT_SYMPTOMS = '';

export function PranaProvider({ children }) {
  const [symptoms, setSymptoms] = useState(DEFAULT_SYMPTOMS);
  const [riskLevel, setRiskLevel] = useState('low');
  const [redFlags, setRedFlags] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [sourcesUsed, setSourcesUsed] = useState([]);
  const [safetyData, setSafetyData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedRemedyIds, setSavedRemedyIds] = useState(new Set());
  const [userProfile, setUserProfile] = useState(null);

  const toggleSaveRemedy = useCallback((remedyId) => {
    setSavedRemedyIds((prev) => {
      const next = new Set(prev);
      if (next.has(remedyId)) {
        next.delete(remedyId);
      } else {
        next.add(remedyId);
      }
      return next;
    });
  }, []);

  const isRemedySaved = useCallback(
    (remedyId) => savedRemedyIds.has(remedyId),
    [savedRemedyIds],
  );

  const reset = useCallback(() => {
    setSymptoms('');
    setRiskLevel('low');
    setRedFlags([]);
    setResults([]);
    setSelectedRemedy(null);
    setSourcesUsed([]);
    setSafetyData(null);
    setCurrentStep(0);
  }, []);

  const value = {
    symptoms,
    setSymptoms,
    riskLevel,
    setRiskLevel,
    redFlags,
    setRedFlags,
    results,
    setResults,
    selectedRemedy,
    setSelectedRemedy,
    sourcesUsed,
    setSourcesUsed,
    safetyData,
    setSafetyData,
    currentStep,
    setCurrentStep,
    savedRemedyIds,
    toggleSaveRemedy,
    isRemedySaved,
    userProfile,
    setUserProfile,
    reset,
  };

  return <PranaContext.Provider value={value}>{children}</PranaContext.Provider>;
}

export function usePrana() {
  const ctx = useContext(PranaContext);
  if (!ctx) throw new Error('usePrana must be used within a PranaProvider');
  return ctx;
}
