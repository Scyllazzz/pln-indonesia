'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const dashboardByRole: Record<string, string> = {
  SUPERADMIN: '/dashboard/superadmin',
  ADMIN: '/dashboard/admin',
  USER: '/dashboard/user',
};

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalItems, setModalItems] = useState<string[]>([]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validasi field kosong
    const missing: string[] = [];

    if (!username.trim()) missing.push('Username');
    if (!password.trim()) missing.push('Password');

    if (missing.length) {
      setIsLoading(false);
      setModalMessage('Silakan lengkapi field berikut:');
      setModalItems(missing);
      setShowModal(true);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setModalMessage(data.message || 'Username atau password salah');
        setModalItems([]);
        setShowModal(true);
        return;
      }

      // Simpan token ke localStorage atau cookie
      localStorage.setItem('token', data.token);

      const dashboardPath = dashboardByRole[data.user?.role] || '/dashboard';
      router.push(dashboardPath);
    } catch {
      setModalMessage('Terjadi kesalahan. Coba lagi.');
      setModalItems([]);
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg border-2 border-gray-300 p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 border-2 border-gray-400 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-black">
          Login
        </h1>
        <p className="text-center text-black mb-8">
          Silakan login untuk melanjutkan
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Username
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-3 border-2 text-black border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Password
            </label>

            <div className="relative">
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-12 py-3 border-2 text-black border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a
              href="#"
              className="text-sm text-gray-700 hover:text-blue-600 underline"
            >
              Lupa Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-semibold py-3 rounded transition duration-200"
          >
            {isLoading ? 'Sedang login...' : 'Login'}
          </button>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600">
            Belum punya akun?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Daftar di sini
            </a>
          </div>
        </form>
      </div>

      {showModal && (
        <Modal
          message={modalMessage}
          items={modalItems}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function Modal({
  message,
  items,
  onClose,
}: {
  message: string;
  items?: string[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="z-10 w-11/12 max-w-md">
        <div className="bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2 text-black">
            Perhatian
          </h3>

          <p className="text-sm text-black/90 mb-3">
            {message}
          </p>

          {items && items.length > 0 && (
            <ul className="list-disc list-inside text-sm text-black/90 mb-4">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}

          <div className="text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600/90 text-white rounded hover:bg-blue-700/90"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}