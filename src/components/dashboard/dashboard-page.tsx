'use client';
import { Header } from '@/components/header';
import SummarySection from './summary-section';
import RoomsSection from './rooms-section';
import RightColumn from './right-column';
import SubHeader from './sub-header';
import { DashboardProvider, useDashboard } from './dashboard-provider';
import { useCallback, useEffect, useState } from 'react';

function DashboardContent() {
  const { refresh, setRefresh } = useDashboard();
  const [key, setKey] = useState(0);

  const handleBookingSuccess = useCallback(() => {
    setRefresh(true);
    // Force re-render of rooms section
    setKey(prev => prev + 1);
  }, [setRefresh]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <SubHeader />
          <SummarySection />
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RoomsSection key={key} onBookingSuccess={handleBookingSuccess} />
            </div>
            <RightColumn />
          </div>
        </div>
      </main>
    </div>
  )
}


export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}
