'use client';

import { User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  role?: string;
}

export default function Header({ role = 'Superadmin' }: HeaderProps) {
  const displayName = getLoggedInUserName(role);

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
          <User size={20} className="text-gray-600" />
          <span className="text-gray-700 font-medium" suppressHydrationWarning>
            {displayName}
          </span>
          <ChevronDown size={16} className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}

function getLoggedInUserName(fallback: string) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return fallback;
  }

  try {
    const user = JSON.parse(atob(token));
    return user.name || user.username || fallback;
  } catch {
    return fallback;
  }
}
