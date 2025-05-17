'use client';

import React from 'react';
import { useAuth, AuthProvider } from '@/context/AuthContext';
import Profile from '@/components/Profile';

function ProfilePageContent() {
  const { user, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not logged in</div>;

  return <Profile username={user.username} email={user.email} role={user.role} avatarUrl={user.avatarUrl} />;
}

export default function ProfilePage() {
  // Bungkus dengan AuthProvider supaya context tersedia
  return (
    <AuthProvider>
      <ProfilePageContent />
    </AuthProvider>
  );
}
