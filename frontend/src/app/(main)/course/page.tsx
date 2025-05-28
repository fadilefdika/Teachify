// app/profile/page.tsx

'use client';

import { useAuth } from '@/context/AuthContext'; // pastikan path sesuai
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CoursesPage } from './CoursePageContent';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect ke login jika tidak ada user setelah loading selesai
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) return <div>Loading...</div>;

  const handleBack = () => router.push('/dashboard'); // atau gunakan `window.history.back()`

  return <CoursesPage onBack={handleBack} />;
}
