import { Header } from '@/components/header';
import SummarySection from './summary-section';
import RoomsSection from './rooms-section';
import RightColumn from './right-column';
import SubHeader from './sub-header';
import { DashboardProvider } from './dashboard-provider';

export default async function DashboardPage() {
  return (
    <DashboardProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="space-y-8">
            <SubHeader />
            <SummarySection />
            <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RoomsSection />
              </div>
              <RightColumn />
            </div>
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}
