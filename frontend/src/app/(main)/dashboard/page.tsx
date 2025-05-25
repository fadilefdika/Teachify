'use client';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    // Fetch API dengan cookie otomatis terkirim (credentials: 'include')
    fetch('http://localhost:3000/api/dashboard', {
      credentials: 'include', // ini penting supaya cookie dikirim
      cache: 'no-store',
    })
      .then(async (res) => {
        if (res.status === 401) {
          setError('Token tidak valid atau sudah expired.');
          return;
        }
        if (!res.ok) {
          setError(`Gagal mengambil data dashboard. Status: ${res.status}`);
          return;
        }
        const data = await res.json();
        setUser(data.user);
        console.log(data.user);
      })
      .catch((err) => {
        setError(`Terjadi kesalahan saat mengambil data dashboard: ${err.message}`);
      });
  }, []);

  if (error) {
    return (
      <div className="text-red-500">
        <h1>{error}</h1>
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Dashboard</h1>
      <p>Selamat datang, {user.name || 'Pengguna'}!</p>
    </div>
  );
};

export default Dashboard;
