'use client';

import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { useEffect, useState } from 'react';

interface ServiceRequest {
  id: number;
  date: string;
  unit: string;
  noSR: string;
  serviceRequests: string;
  seksi: string;
  noWO: string;
  status: string;
  keterangan: string;
  tanggalPengerjaan: string;
}

export default function RiwayatRequestPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token || ''));
        const response = await fetch(`/api/service-requests?userId=${user.userId}`);
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'proses':
        return 'bg-blue-50 text-blue-700';
      case 'selesai':
        return 'bg-green-50 text-green-700';
      case 'ditolak':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="user" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="Username" />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Riwayat Request</h1>
              <p className="text-gray-600 mt-2">Berikut adalah riwayat Service Request yang sudah Anda buat</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading...
                </div>
              ) : requests.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Belum ada riwayat request
                </div>
              ) : (
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
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, idx) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.noSR}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.serviceRequests}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.seksi}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.noWO}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.keterangan}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.tanggalPengerjaan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Info */}
            {requests.length > 0 && (
              <div className="mt-6 text-sm text-gray-600">
                Total: {requests.length} data
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
