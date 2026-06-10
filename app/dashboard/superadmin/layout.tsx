import AuthGuard from '@/app/components/dashboard/AuthGuard';

export default function SuperadminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowedRole="SUPERADMIN">{children}</AuthGuard>;
}
