'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import EditUserModal from '@/app/components/dashboard/EditUserModal';
import { Download, Filter, Edit2, Trash2 } from 'lucide-react';

interface User {
  id: number;
  name: string;
  username: string;
  divisi: string;
  role: string;
}

function formatRole(role: string) {
  return role
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function ListUserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchUsers]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`/api/users/${updatedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setIsModalOpen(false);
        alert('User berhasil diperbarui');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Gagal memperbarui user');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert('User berhasil dihapus');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Gagal menghapus user');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="superadmin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="Superadmin" />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">List User (Superadmin)</h1>
              <p className="text-gray-600 mt-2">Berikut adalah data pengguna sistem.</p>
            </div>

            {/* Tools Bar */}
            <div className="flex justify-between items-center mb-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Download size={20} />
                <span>Export ke Excel</span>
              </button>

              <div className="flex gap-4">
                <input
                  type="date"
                  placeholder="Pilih tanggal awal"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                />
                <input
                  type="date"
                  placeholder="Pilih tanggal akhir"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                />
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Filter size={20} />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-600">Loading...</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No.</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nama</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Username</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Roles</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Divisi</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.username}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {formatRole(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{user.divisi}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 text-sm text-gray-600">
              Menampilkan 1 - {users.length} dari {users.length} data
            </div>
          </div>
        </div>
      </div>

      <EditUserModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
