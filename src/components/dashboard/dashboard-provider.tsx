'use client';

import React, { createContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  date: Date;
  setDate: (date: Date) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
    date: new Date(),
    setDate: () => {},
});

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState<Date>(new Date('2025-12-10T00:00:00'));

  return (
    <DashboardContext.Provider value={{ date, setDate }}>
      {children}
    </DashboardContext.Provider>
  );
};
