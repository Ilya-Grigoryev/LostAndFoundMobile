import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CategoryId, LocationValue, LoserReport } from '../types/loser';

interface LoserReportContextValue extends LoserReport {
  setCategory: (id: CategoryId, customLabel?: string) => void;
  setLocation: (value: LocationValue) => void;
  setPushOptIn: (value: boolean) => void;
  reset: () => void;
}

const LoserReportContext = createContext<LoserReportContextValue | undefined>(undefined);

const INITIAL: LoserReport = { category: null, customLabel: undefined, location: null, pushOptIn: true };

export function LoserReportProvider({ children }: { children: React.ReactNode }) {
  const [report, setReport] = useState<LoserReport>(INITIAL);

  const setCategory = useCallback((id: CategoryId, customLabel?: string) => {
    setReport(prev => ({ ...prev, category: id, customLabel }));
  }, []);

  const setLocation = useCallback((value: LocationValue) => {
    setReport(prev => ({ ...prev, location: value }));
  }, []);

  const setPushOptIn = useCallback((value: boolean) => {
    setReport(prev => ({ ...prev, pushOptIn: value }));
  }, []);

  const reset = useCallback(() => setReport(INITIAL), []);

  const value = useMemo<LoserReportContextValue>(
    () => ({ ...report, setCategory, setLocation, setPushOptIn, reset }),
    [report, setCategory, setLocation, setPushOptIn, reset],
  );

  return <LoserReportContext.Provider value={value}>{children}</LoserReportContext.Provider>;
}

export function useLoserReport() {
  const ctx = useContext(LoserReportContext);
  if (!ctx) throw new Error('useLoserReport must be used inside LoserReportProvider');
  return ctx;
}
