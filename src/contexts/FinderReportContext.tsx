import React, { createContext, useCallback, useContext, useState } from 'react';
import { FinderLocation } from '../types/finder';

interface FinderReportContextValue {
  photoUri: string | null;
  location: FinderLocation | null;
  setPhoto: (uri: string) => void;
  setLocation: (loc: FinderLocation) => void;
  reset: () => void;
}


const FinderReportContext = createContext<FinderReportContextValue | undefined>(undefined);
export function FinderReportProvider({ children }: { children: React.ReactNode }) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocationState] = useState<FinderLocation | null>(null);

  const setPhoto = useCallback((uri: string) => setPhotoUri(uri), []);
  const setLocation = useCallback((loc: FinderLocation) => setLocationState(loc), []);
  const reset = useCallback(() => {
    setPhotoUri(null);
    setLocationState(null);
  }, []);

  return (
    <FinderReportContext.Provider value={{ photoUri, location, setPhoto, setLocation, reset }}>
      {children}
    </FinderReportContext.Provider>
  );
}

export function useFinderReport() {
  const ctx = useContext(FinderReportContext);
  if (!ctx) throw new Error('useFinderReport must be used inside FinderReportProvider');
  return ctx;
}
