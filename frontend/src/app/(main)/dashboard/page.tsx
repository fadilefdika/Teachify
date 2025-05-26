'use client';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { StatsCards } from '@/components/stats-cards';
import { RecentActivity } from '@/components/recent-activity';
import { CourseOverview } from '@/components/course-overview';
import { UserManagement } from '@/components/user-management';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-violet-600 hover:text-violet-700">
                  Dashboard Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Overview</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Cari..." className="pl-10 w-64 bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20 rounded-xl backdrop-blur-sm" />
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Dashboard EduVerse</h1>
          <p className="text-lg text-muted-foreground">Selamat datang {user.name} di universe pembelajaran digital ✨</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-12">
          <CourseOverview />
          <RecentActivity />
        </div>

        <UserManagement />
      </div>
    </SidebarInset>
  );
};

export default Dashboard;
