'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const dashboardByRole: Record<string, string> = {
  SUPERADMIN: '/dashboard/superadmin',
  ADMIN: '/dashboard/admin',
  USER: '/dashboard/user',
};

function decodeToken(token: string) {
  return JSON.parse(atob(token));
}

export default function DashboardRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const decoded = decodeToken(token);
      router.replace(dashboardByRole[decoded.role] || '/login');
    } catch {
      localStorage.removeItem('token');
      router.replace('/login');
    }
  }, [router]);

  return <div>Loading...</div>;
}
