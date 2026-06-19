'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    divisi: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalItems, setModalItems] = useState<string[]>([]);
  const router = useRouter();

  const divisions = ['Operasi', 'Listrik', 'Instrumen', 'Mekanik'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Client-side validation to avoid native browser tooltip and show our popup
    const missing: string[] = [];
    if (!formData.name.trim()) missing.push('Nama');
    if (!formData.username.trim()) missing.push('Username');
    if (!formData.password.trim()) missing.push('Password');
    if (!formData.divisi) missing.push('Divisi');
    if (missing.length) {
      setIsLoading(false);
      setModalMessage('Silakan lengkapi field berikut:');
      setModalItems(missing);
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Pendaftaran gagal');
        return;
      }

      setSuccess('Pendaftaran berhasil! Redirecting ke login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white rounded-lg border-2 border-gray-300 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 border-2 border-gray-400 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-black">Register</h1>
        <p className="text-center text-gray-600 mb-8">Buat akun baru untuk mendaftar</p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="w-full pl-10 pr-4 py-3 border-2 text-black border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-3 border-2 text-black border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-black text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-12 py-3 border-2 text-black border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Divisi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Divisi</label>
            <div className="relative">
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
              </svg>
              <select
                name="divisi"
                value={formData.divisi}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border-2 text-black border-gray-300 rounded focus:outline-none focus:border-blue-500 appearance-none"
              >
                <option value="" disabled>
                  Pilih Divisimu
                </option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {div}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-3 w-5 h-5 text-black pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <p className="text-xs text-black mt-1">Divisi: Operasi, Listrik, Instrumen, Mekanik</p>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-semibold py-3 rounded transition duration-200"
          >
            {isLoading ? 'Sedang daftar...' : 'Register'}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold underline">
              Login di sini
            </a>
          </div>
        </form>
      </div>
        {showModal && (
          <Modal message={modalMessage} items={modalItems} onClose={() => setShowModal(false)} />
        )}
      </div>
    );
}

function Modal({ message, items, onClose }: { message: string; items?: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="z-10 w-11/12 max-w-md">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 text-black">Perhatian</h3>
          <p className="text-sm text-black/90 mb-3">{message}</p>
          {items && items.length > 0 && (
            <ul className="list-disc list-inside text-sm text-black/90 mb-4">
              {items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          )}
          <div className="text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600/90 text-white rounded hover:bg-blue-700/90 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
