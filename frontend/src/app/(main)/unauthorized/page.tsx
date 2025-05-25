'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const Unauthorized = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/login'); // Redirect ke halaman login
  };

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">Akses ditolak</h1>
      <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Button onClick={handleRedirect} className="mt-4">
        Kembali ke login
      </Button>
    </div>
  );
};

export default Unauthorized;
