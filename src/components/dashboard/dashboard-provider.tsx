'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';

interface DashboardContextType {
  date: Date;
  setDate: (date: Date) => void;
  refresh: boolean;
  setRefresh: (refresh: boolean) => void;
}

export const DashboardContext = createContext<DashboardContextType>({
    date: new Date(),
    setDate: () => {},
    refresh: false,
    setRefresh: () => {},
});

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState<Date>(new Date('2025-12-10T00:00:00'));
  const [refresh, setRefresh] = useState(false);

  return (
    <DashboardContext.Provider value={{ date, setDate, refresh, setRefresh }}>
      {children}
    </DashboardContext.Provider>
  );
};
