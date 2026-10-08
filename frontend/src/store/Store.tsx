import React, { createContext, useContext, useState } from 'react';

// Store Types
export type AlertStatus = 'ACTIVE' | 'RESOLVED';
export type SafetyStatus = 'SAFE' | 'CAUTION' | 'BLOCKED';

export interface Alert {
  id: string;
  type: string;
  severity: string;
  location: string;
  lat: number;
  lng: number;
  time: string;
}

export interface Recommendation {
  id: string;
  action: string;
  target: string;
  reason: string;
  safetyStatus: SafetyStatus;
  confidence: number;
  blockReason?: string;
  saferAlternative?: string;
}

export interface Evidence {
  id: string;
  source: string;
  claim: string;
  ageMins: number;
  reliability: number;
  isConflict: boolean;
}

interface State {
  alerts: Alert[];
  recommendations: Recommendation[];
  evidences: Evidence[];
  floodLevelCm: number;
  infoBlindSpots: { lat: number, lng: number, radius: number }[];
}

interface StoreContextType {
  state: State;
  setFloodLevel: (level: number) => void;
  addEvidence: (evidence: Evidence) => void;
  triggerConflict: () => void;
  reassessSafety: (floodLevel: number, hasConflict?: boolean) => void;
  resetDemo: () => void;
  runFullDemo: () => void;
}

const initialState: State = {
  alerts: [
    { id: '1', type: 'Heavy Rain', severity: 'High', location: 'Mangaluru', lat: 12.9141, lng: 74.8560, time: new Date().toISOString() }
  ],
  recommendations: [
    { 
      id: 'r1', action: 'Send Field Team A', target: 'Relief Camp B', reason: 'High confidence match for missing person Ravi Kumar', safetyStatus: 'SAFE', confidence: 91
    }
  ],
  evidences: [
    { id: 'e1', source: 'Official Alert', claim: 'Heavy rainfall expected in next 24h', ageMins: 15, reliability: 95, isConflict: false }
  ],
  floodLevelCm: 0,
  infoBlindSpots: []
};

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<State>(initialState);

  const setFloodLevel = (level: number) => {
    setState(s => ({ ...s, floodLevelCm: level }));
    reassessSafety(level);
  };

  const addEvidence = (evidence: Evidence) => {
    setState(s => ({ ...s, evidences: [...s.evidences, evidence] }));
    reassessSafety(state.floodLevelCm);
  };

  const triggerConflict = () => {
    const conflictEv: Evidence = { id: Date.now().toString(), source: 'Satellite (Sim)', claim: 'Water accumulation detected on Route B', ageMins: 2, reliability: 88, isConflict: true };
    const conflictEv2: Evidence = { id: Date.now().toString()+'_2', source: 'Field Worker', claim: 'Route B impassable', ageMins: 5, reliability: 90, isConflict: true };
    setState(s => ({ ...s, evidences: [...s.evidences, conflictEv, conflictEv2] }));
    
    // Auto reassess
    setTimeout(() => reassessSafety(state.floodLevelCm, true), 1000);
  };

  const reassessSafety = (floodLevel: number, hasConflict = false) => {
    setState(s => {
      const newRecs = s.recommendations.map(r => {
        if (hasConflict || floodLevel > 20) {
          return {
            ...r,
            safetyStatus: 'BLOCKED' as SafetyStatus,
            blockReason: 'Latest flood evidence indicates Route B is unsafe. Conflict detected.',
            saferAlternative: 'Route C + remote verification'
          };
        } else if (floodLevel > 10) {
          return {
            ...r,
            safetyStatus: 'CAUTION' as SafetyStatus,
            blockReason: undefined
          };
        }
        return r;
      });
      return { ...s, recommendations: newRecs };
    });
  };

  const resetDemo = () => setState(initialState);

  const runFullDemo = () => {
    resetDemo();
    
    // Sequence of events to trigger the disaster cascade over time
    setTimeout(() => {
      // 1. Add field report evidence
      setState(s => ({
        ...s,
        evidences: [...s.evidences, {
          id: Date.now().toString() + '1',
          source: 'Field Report',
          claim: 'ROAD B FLOODED.',
          ageMins: 1,
          reliability: 90,
          isConflict: true
        }]
      }));
    }, 1500);

    setTimeout(() => {
      // 2. Add satellite simulation evidence and raise flood level
      setState(s => ({
        ...s,
        floodLevelCm: 25,
        evidences: [...s.evidences, {
          id: Date.now().toString() + '2',
          source: 'Satellite (Sim)',
          claim: 'WATER ACCUMULATION detected on Route B.',
          ageMins: 0,
          reliability: 85,
          isConflict: true
        }]
      }));
    }, 3000);

    setTimeout(() => {
      // 3. Force reassessment which will block the action
      reassessSafety(25, true);
    }, 4500);
  };

  return (
    <StoreContext.Provider value={{ state, setFloodLevel, addEvidence, triggerConflict, reassessSafety, resetDemo, runFullDemo }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
