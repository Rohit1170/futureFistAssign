import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata = { title: 'Settings - AI Analytics' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
