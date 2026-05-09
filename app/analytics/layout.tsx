import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata = { title: 'Analytics - AI Analytics' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
