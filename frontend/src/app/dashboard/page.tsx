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

  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Selamat datang!</p>
    </div>
  );
};

export default Dashboard;
