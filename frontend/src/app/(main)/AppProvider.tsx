'use client';

import { CourseProvider } from '@/context/CourseContext';
import { AuthProvider } from '@/context/AuthContext';
// Tambahkan context lainnya sesuai kebutuhan

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CourseProvider>
        {/* Tambah provider lain jika ada */}
        {children}
      </CourseProvider>
    </AuthProvider>
  );
}
