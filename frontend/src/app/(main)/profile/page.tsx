'use client';

import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  // fields lain kalau perlu
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token yang akan dikirim:', token);

    if (!token) {
      console.error('Token tidak ditemukan di localStorage!');
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    fetch('http://localhost:3000/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Pastikan token dikirim sesuai format Bearer
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('User profile:', data);
        setUser(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not logged in</div>;

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
