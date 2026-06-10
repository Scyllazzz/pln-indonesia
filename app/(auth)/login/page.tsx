import LoginForm from '@/app/components/LoginForm';

export const metadata = {
  title: 'Login - PLN',
  description: 'Halaman login PLN Indonesia',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
