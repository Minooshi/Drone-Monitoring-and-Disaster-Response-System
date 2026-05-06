import React, { createContext, useContext, useState, ReactNode } from 'react';

type DroneStatus = 'In Flight' | 'Grounded';

interface DroneContextType {
  status: DroneStatus;
  setStatus: (status: DroneStatus) => void;
  toggleStatus: () => void;
}

const DroneContext = createContext<DroneContextType | undefined>(undefined);

export function DroneProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<DroneStatus>('In Flight');

  const toggleStatus = () => {
    setStatus(prev => prev === 'In Flight' ? 'Grounded' : 'In Flight');
  };

  return (
    <DroneContext.Provider value={{ status, setStatus, toggleStatus }}>
      {children}
    </DroneContext.Provider>
  );
}

export function useDrone() {
  const context = useContext(DroneContext);
  if (context === undefined) {
    throw new Error('useDrone must be used within a DroneProvider');
  }
  return context;
}
