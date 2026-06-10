'use client';

import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    unit: '',
    noSR: '',
    serviceRequests: '',
    seksi: '',
    noWO: '',
    status: 'Pending',
    keterangan: '',
    tanggalPengerjaan: '',
    d: '',
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/service-requests');
        if (response.ok) {
          const data = await response.json();
          setServiceRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewRequest = () => {
    router.push('/dashboard/admin/riwayat');
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Silakan isi data Service Request</p>
            </div>

            {/* Form Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
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
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="noSR"
                        value={formData.noSR}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="serviceRequests"
                        value={formData.serviceRequests}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="seksi"
                        value={formData.seksi}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="noWO"
                        value={formData.noWO}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-gray-100 focus:outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        name="keterangan"
                        value={formData.keterangan}
                        onChange={handleChange}
                        placeholder=""
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="date"
                        name="tanggalPengerjaan"
                        value={formData.tanggalPengerjaan}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={handleViewRequest}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-semibold"
                      >
                        ↓
                      </button>
                    </td>
                  </tr>

                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : serviceRequests.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada data request
                      </td>
                    </tr>
                  ) : (
                    serviceRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{request.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.noSR}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.serviceRequests}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.seksi}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.noWO || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.status}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.keterangan || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.tanggalPengerjaan || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{request.d || 'Lorem'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
