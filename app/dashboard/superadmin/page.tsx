'use client';

import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { Filter } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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
}

export default function DashboardPage() {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServiceRequests = useCallback(async () => {
    try {
      const response = await fetch('/api/service-requests');

      if (response.ok) {
        const data = await response.json();
        setServiceRequests(data);
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchServiceRequests();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchServiceRequests]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="superadmin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="Superadmin" />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard (Superadmin)</h1>
              <p className="text-gray-600 mt-2">Berikut adalah data Service Request dari pengguna.</p>
            </div>

            <div className="flex justify-end items-center mb-6">
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No.</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">NO SR</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service Requests</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Seksi</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No. WO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Keterangan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tanggal Pengerjaan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">D</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : serviceRequests.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada data request
                      </td>
                    </tr>
                  ) : (
                    serviceRequests.map((item, idx) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.noSR}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.serviceRequests}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.seksi}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.noWO || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.status}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.keterangan || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.tanggalPengerjaan || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{item.d || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">-</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              Menampilkan {serviceRequests.length === 0 ? 0 : 1} - {serviceRequests.length} dari {serviceRequests.length} data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
