import { DashboardLayout } from '@/components/layout/DashboardLayout';

export const metadata = { title: 'Upload - AI Analytics' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
