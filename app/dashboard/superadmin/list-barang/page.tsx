'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/app/components/dashboard/Sidebar';
import Header from '@/app/components/dashboard/Header';
import { Download, Filter, Edit2, Trash2 } from 'lucide-react';

interface Barang {
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

export default function ListBarangPage() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    unit: '',
    noSR: '',
    serviceRequests: '',
    seksi: '',
    noWO: '',
    status: '',
    keterangan: '',
    tanggalPengerjaan: '',
  });

  const fetchBarangList = useCallback(async () => {
    try {
      const response = await fetch('/api/service-requests');

      if (response.ok) {
        const data = await response.json();
        setBarangList(data);
      }
    } catch (error) {
      console.error('Error fetching barang:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchBarangList();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchBarangList]);

  const handleEditClick = (barang: Barang) => {
    setSelectedBarang(barang);
    setFormData({
      date: barang.date,
      unit: barang.unit,
      noSR: barang.noSR,
      serviceRequests: barang.serviceRequests,
      seksi: barang.seksi,
      noWO: barang.noWO,
      status: barang.status,
      keterangan: barang.keterangan,
      tanggalPengerjaan: barang.tanggalPengerjaan,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteBarang = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
      setBarangList(barangList.filter(b => b.id !== id));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveBarang = () => {
    if (selectedBarang) {
      setBarangList(barangList.map(b => 
        b.id === selectedBarang.id 
          ? { ...selectedBarang, ...formData }
          : b
      ));
      setIsEditModalOpen(false);
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
              <h1 className="text-3xl font-bold text-gray-900">List Barang (Superadmin)</h1>
              <p className="text-gray-600 mt-2">Berikut adalah data barang sistem.</p>
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : barangList.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                        Tidak ada data barang
                      </td>
                    </tr>
                  ) : (
                    barangList.map((barang, idx) => (
                      <tr key={barang.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{idx + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.unit}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.noSR}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.serviceRequests}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.seksi}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.noWO || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.status}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.keterangan || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{barang.tanggalPengerjaan || '-'}</td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() => handleEditClick(barang)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDeleteBarang(barang.id)}
                            className="p-2 hover:bg-gray-100 rounded"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 text-sm text-gray-600">
              Menampilkan {barangList.length === 0 ? 0 : 1} - {barangList.length} dari {barangList.length} data
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedBarang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Edit Barang</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {['date', 'unit', 'noSR', 'serviceRequests', 'seksi', 'noWO', 'status', 'keterangan', 'tanggalPengerjaan'].map(field => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  {field === 'keterangan' ? (
                    <textarea
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  ) : (
                    <input
                      type="text"
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 p-6 border-t justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSaveBarang}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
