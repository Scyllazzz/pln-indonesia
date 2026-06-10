'use client';

import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { Plus } from 'lucide-react';
import { useState } from 'react';

function getLoggedInUserId() {
  const token = localStorage.getItem('token');

  if (!token) {
    return null;
  }

  try {
    const user = JSON.parse(atob(token));
    return typeof user.userId === 'number' ? user.userId : null;
  } catch {
    return null;
  }
}

export default function UserDashboardPage() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRequest = async () => {
    try {
      // Validate required fields
      if (!formData.unit || !formData.serviceRequests) {
        alert('Mohon isi field Unit dan Service Requests');
        return;
      }

      const userId = getLoggedInUserId();

      if (!userId) {
        alert('Sesi login tidak valid. Silakan login ulang.');
        return;
      }

      // Submit to API
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (response.ok) {
        alert('Request berhasil ditambahkan!');
        // Reset form
        setFormData({
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
      } else {
        alert('Terjadi kesalahan saat menambahkan request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
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
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Silakan isi data Service Request</p>
            </div>

            {/* Add Request Button */}
            <div className="mb-6">
              <button 
                onClick={handleAddRequest}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                <Plus size={20} />
                <span>Tambah Request</span>
              </button>
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
                        onClick={handleAddRequest}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-semibold"
                      >
                        ↓
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
