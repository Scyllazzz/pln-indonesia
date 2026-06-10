'use client';

import { useRouter, useParams } from 'next/navigation';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { useState, useEffect } from 'react';

interface ServiceRequest {
  id: number;
  date: string;
  unit: string;
  noSR: string;
  serviceRequests: string;
  seksi: string;
  noWO?: string;
  status: string;
  keterangan?: string;
  tanggalPengerjaan?: string;
  d?: string;
  user: {
    name: string;
    username: string;
  };
}

export default function AdminEditServiceRequestPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<ServiceRequest>>({});

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await fetch(`/api/service-requests/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRequest(data);
          setFormData(data);
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`/api/service-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Request berhasil diperbarui!');
        router.push('/dashboard/admin/riwayat');
      } else {
        alert('Terjadi kesalahan saat memperbarui request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDelete = async () => {
    if (confirm('Apakah Anda yakin ingin menghapus request ini?')) {
      try {
        const response = await fetch(`/api/service-requests/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Request berhasil dihapus!');
          router.push('/dashboard/admin/riwayat');
        } else {
          alert('Terjadi kesalahan saat menghapus request');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan');
      }
    }
  };

  const handleBack = () => {
    router.push('/dashboard/admin/riwayat');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar role="admin" />
        <div className="flex-1 flex flex-col">
          <Header role="Admin" />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar role="admin" />
        <div className="flex-1 flex flex-col">
          <Header role="Admin" />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Request tidak ditemukan</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="Admin" />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
              <a href="/dashboard/admin/riwayat" className="hover:text-gray-900">Riwayat Request</a>
              <span>&gt;</span>
              <span>Edit Request</span>
            </div>

            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Edit Service Request</h1>
              <p className="text-gray-600 mt-2">Ubah data Service Request sesuai kebutuhan.</p>
            </div>

            {/* User Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600">Nama User</label>
                  <p className="font-semibold text-gray-900">{request.user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Username</label>
                  <p className="font-semibold text-gray-900">{request.user.username}</p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="bg-white rounded-lg shadow p-8">
              <div className="space-y-6">
                {/* Date */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Date</label>
                  <div className="flex-1">
                    <input
                      type="date"
                      name="date"
                      value={formData.date || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Unit */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Unit</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="unit"
                      value={formData.unit || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* No SR */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">No SR</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="noSR"
                      value={formData.noSR || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Service Requests */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Service Requests</label>
                  <div className="flex-1">
                    <textarea
                      name="serviceRequests"
                      value={formData.serviceRequests || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Seksi */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Seksi</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="seksi"
                      value={formData.seksi || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* No. WO */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">No. WO</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="noWO"
                      value={formData.noWO || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Status</label>
                  <div className="flex-1">
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROSES">Proses</option>
                      <option value="SELESAI">Selesai</option>
                      <option value="DITOLAK">Ditolak</option>
                    </select>
                  </div>
                </div>

                {/* Keterangan */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Keterangan</label>
                  <div className="flex-1">
                    <textarea
                      name="keterangan"
                      value={formData.keterangan || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Tanggal Pengerjaan */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">Tanggal Pengerjaan</label>
                  <div className="flex-1">
                    <input
                      type="date"
                      name="tanggalPengerjaan"
                      value={formData.tanggalPengerjaan || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* D */}
                <div className="flex items-start">
                  <label className="w-40 text-gray-700 font-medium pt-2">D</label>
                  <div className="flex-1">
                    <input
                      type="text"
                      name="d"
                      value={formData.d || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <span>← Kembali</span>
                </button>
                <div className="flex-1"></div>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100"
                >
                  🗑️ Hapus Data
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ✓ Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
