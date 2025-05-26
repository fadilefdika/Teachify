'use client';

import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/profile', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('User profile:', data);
        setUser(data.user);
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not logged in</div>;

  return (
    <div>
      <h1>Profile Page</h1>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}
