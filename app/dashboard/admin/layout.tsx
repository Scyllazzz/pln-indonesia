import AuthGuard from '@/app/components/dashboard/AuthGuard';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowedRole="ADMIN">{children}</AuthGuard>;
}
