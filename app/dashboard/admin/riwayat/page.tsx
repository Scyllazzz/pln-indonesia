'use client';

import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download } from 'lucide-react';

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
    id: number;
    name: string;
    username: string;
  };
}

export default function AdminRiwayatRequestPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const itemsPerPage = 7;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token || ''));
        const divisi = user.divisi;
        const response = await fetch(`/api/service-requests?divisi=${divisi}`);
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

  const handleEdit = (id: number) => {
    router.push(`/dashboard/admin/riwayat/edit/${id}`);
  };

  const handleFilter = () => {
    setCurrentPage(1);
  };

  const handleExportExcel = () => {
    const headers = [
      'No.',
      'User',
      'Username',
      'Date',
      'Unit',
      'No SR',
      'Service Requests',
      'Seksi',
      'No WO',
      'Status',
      'Keterangan',
      'Tanggal Pengerjaan',
      'D',
    ];

    const rows = filteredRequests.map((request, idx) => [
      idx + 1,
      request.user.name,
      request.user.username,
      request.date,
      request.unit,
      request.noSR,
      request.serviceRequests,
      request.seksi,
      request.noWO || '',
      request.status,
      request.keterangan || '',
      request.tanggalPengerjaan || '',
      request.d || '',
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `service-requests-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredRequests = filterStatus
    ? requests.filter((req) => req.status === filterStatus)
    : requests;

  const statuses = [...new Set(requests.map((req) => req.status))];
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIdx, startIdx + itemsPerPage);
  const displayStart = filteredRequests.length === 0 ? 0 : startIdx + 1;
  const displayEnd = Math.min(startIdx + itemsPerPage, filteredRequests.length);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700';
      case 'PROSES':
        return 'bg-blue-50 text-blue-700';
      case 'SELESAI':
        return 'bg-green-50 text-green-700';
      case 'DITOLAK':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header role="Admin" />
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Riwayat Request</h1>
              <p className="text-gray-600 mt-2">Berikut adalah riwayat Service Request dari pengguna</p>
            </div>

            {/* Tools Bar */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handleExportExcel}
                disabled={filteredRequests.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                <span>Export ke Excel</span>
              </button>

              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    handleFilter();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Semua Status</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">No.</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Service Requests</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : paginatedRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada data riwayat request
                      </td>
                    </tr>
                  ) : (
                    paginatedRequests.map((request, idx) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{startIdx + idx + 1}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{request.user.name}</div>
                          <div className="text-gray-500 text-xs">{request.user.username}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{request.serviceRequests}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <button 
                            onClick={() => handleEdit(request.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            ✎
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Menampilkan {filteredRequests.length === 0 ? 0 : displayStart} - {displayEnd} dari {filteredRequests.length} data
              </div>
              
              {totalPages > 1 && (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 bg-white">
                    {currentPage}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
