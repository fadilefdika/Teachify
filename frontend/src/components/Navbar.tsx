'use client';

import { useState, useRef, useEffect } from 'react';
import { Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close profile dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include', // penting kalau cookie httpOnly di backend
      });

      if (!res.ok) {
        throw new Error('Failed to logout');
      }

      // Kamu bisa pakai router.replace supaya user diarahkan tanpa reload full page
      router.replace('/login');
    } catch (err: any) {
      alert('Logout failed: ' + err.message);
    }
  }

  return (
    <nav className="flex items-center justify-between bg-gray-100 px-4 py-3 shadow-md">
      {/* Hamburger + App name */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          aria-label="Toggle menu"
          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={toggleSidebar} // panggil fungsi dari props
        >
          <Menu size={24} />
        </button>
        <span className="text-xl font-semibold">My Application</span>
      </div>

      {/* Profile */}
      <div className="relative" ref={profileRef}>
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-haspopup="true"
          aria-expanded={isProfileOpen}
        >
          <User size={24} />
          <span className="hidden sm:inline">Profile</span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
            <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">
              Profile
            </Link>

            <button type="button" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
