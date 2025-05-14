import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Dashboard = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    // Tidak ada token → redirect ke login
    redirect('/login');
  }

  const res = await fetch('http://localhost:3000/api/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (res.status === 401) {
    // Token tidak valid atau expired → redirect ke login
    redirect('/login');
  }

  const data = await res.json();

  // Cek role user
  if (data.user?.role !== 'admin') {
    // Jika bukan admin, redirect ke halaman lain
    redirect('/unauthorized'); // kamu bisa buat halaman ini
  }

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang, {data.user?.name}!</p>
    </div>
  );
};

export default Dashboard;
