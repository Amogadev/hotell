import AuthGuard from '@/components/auth-guard';
import DashboardPage from '@/components/dashboard/dashboard-page';

export default function Home() {
  return (
    <AuthGuard>
      <DashboardPage />
    </AuthGuard>
  );
}
