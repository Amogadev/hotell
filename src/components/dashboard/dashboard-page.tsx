import { Header } from '@/components/header';
import SummarySection from './summary-section';
import RoomsSection from './rooms-section';
import CalendarSection from './calendar-section';
import RevenueSection from './revenue-section';

export default async function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <SummarySection />
          
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RoomsSection />
            </div>
            <div className="space-y-8">
              <CalendarSection />
              <RevenueSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
