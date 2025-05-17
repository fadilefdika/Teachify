'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* Sidebar tetap render, tapi lebarnya berubah */}
          <Sidebar isOpen={sidebarOpen} />
          <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-48' : 'ml-16'}`}>
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 overflow-auto p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
