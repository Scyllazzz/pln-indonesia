'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const dashboardByRole: Record<string, string> = {
  SUPERADMIN: '/dashboard/superadmin',
  ADMIN: '/dashboard/admin',
  USER: '/dashboard/user',
};

interface AuthGuardProps {
  allowedRole: keyof typeof dashboardByRole;
  children: React.ReactNode;
}

function decodeToken(token: string) {
  return JSON.parse(atob(token));
}

function subscribeToAuthChanges(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getAuthRole() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const user = decodeToken(token);
    return typeof user.role === 'string' ? user.role : 'INVALID';
  } catch {
    return 'INVALID';
  }
}

export default function AuthGuard({ allowedRole, children }: AuthGuardProps) {
  const router = useRouter();
  const [currentRole, setCurrentRole] = useState<string | null | 'INVALID' | undefined>(
    undefined
  );

  useEffect(() => {
    // initialize role on mount (avoid reading localStorage during SSR/hydration)
    const init = () => setCurrentRole(getAuthRole());
    init();

    const unsubscribe = subscribeToAuthChanges(() => {
      setCurrentRole(getAuthRole());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (currentRole === undefined) return; // not initialized yet

    if (!currentRole) {
      router.replace('/login');
      return;
    }

    if (currentRole === 'INVALID') {
      localStorage.removeItem('token');
      router.replace('/login');
      return;
    }

    if (currentRole !== allowedRole) {
      router.replace(dashboardByRole[currentRole] || '/login');
    }
  }, [allowedRole, currentRole, router]);

  if (currentRole === undefined || currentRole !== allowedRole) {
    return <div>Loading...</div>;
  }

  return children;
}
