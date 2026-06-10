import AuthGuard from '@/app/components/dashboard/AuthGuard';

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard allowedRole="USER">{children}</AuthGuard>;
}
