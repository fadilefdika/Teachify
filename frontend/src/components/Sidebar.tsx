'use client';

import { Home, User, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const menuItems = [
    { label: 'Dashboard', icon: <Home size={20} />, href: '/dashboard' },
    { label: 'Profile', icon: <User size={20} />, href: '/profile' },
    { label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
  ];

  return (
    <div className={cn('fixed top-0 left-0 h-full bg-white shadow-md border-r transition-all duration-300 flex flex-col', isOpen ? 'w-48' : 'w-16')}>
      <div className="flex flex-col space-y-4 mt-8">
        {menuItems.map((item, idx) => (
          <Link key={idx} href={item.href} className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors">
            <span className="text-gray-700">{item.icon}</span>
            {isOpen && <span className="ml-4 text-gray-800 text-sm font-medium">{item.label}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
