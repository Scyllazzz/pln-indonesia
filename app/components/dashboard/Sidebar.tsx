'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Package, LogOut } from 'lucide-react';

interface SidebarProps {
  role?: 'superadmin' | 'admin' | 'user';
}

export default function Sidebar({ role = 'superadmin' }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = role === 'user'
    ? [
        { href: '/dashboard/user', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/user/riwayat', label: 'Riwayat Request', icon: Users },
      ]
    : role === 'admin' 
    ? [
        { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/admin/riwayat', label: 'Riwayat Request', icon: Users },
      ]
    : [
        { href: '/dashboard/superadmin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/superadmin/list-user', label: 'List User', icon: Users },
        { href: '/dashboard/superadmin/list-barang', label: 'List Barang', icon: Package },
      ];

  return (
    <div className="w-48 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold text-gray-900">PLN Indonesia</h2>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
