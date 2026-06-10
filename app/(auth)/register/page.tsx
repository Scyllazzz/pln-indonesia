import RegisterForm from '@/app/components/RegisterForm';

export const metadata = {
  title: 'Register - PLN',
  description: 'Halaman registrasi PLN Indonesia',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
