'use client';

import { BookOpen, Users, GraduationCap, BarChart3, Settings, FileText, Calendar, MessageSquare, CreditCard, Shield, Home, Video, Award, Sparkles } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    color: 'text-blue-600',
  },
  {
    title: 'Users',
    url: '#',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Courses',
    url: '#',
    icon: BookOpen,
    color: 'text-blue-600',
  },
  {
    title: 'Instructors',
    url: '#',
    icon: GraduationCap,
    color: 'text-blue-600',
  },
  {
    title: 'Video',
    url: '#',
    icon: Video,
    color: 'text-blue-600',
  },
  {
    title: 'Rewards',
    url: '#',
    icon: Award,
    color: 'text-blue-600',
  },
];

const managementItems = [
  {
    title: 'Analytics',
    url: '#',
    icon: BarChart3,
    color: 'text-slate-600',
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
    color: 'text-slate-600',
  },
  {
    title: 'Messages',
    url: '#',
    icon: MessageSquare,
    color: 'text-slate-600',
  },
  {
    title: 'Billing',
    url: '#',
    icon: CreditCard,
    color: 'text-slate-600',
  },
  {
    title: 'File Manager',
    url: '#',
    icon: FileText,
    color: 'text-slate-600',
  },
];

const systemItems = [
  {
    title: 'Security',
    url: '#',
    icon: Shield,
    color: 'text-slate-600',
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
    color: 'text-slate-600',
  },
];

export function AppSidebar() {
  const router = useRouter();
  const { logout } = useAuth();
  const { user, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Sidebar variant="inset" className="border-r-0 overflow-y-auto scrollbar-hide">
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/20">
        <SidebarHeader className="border-b border-white/10 dark:border-gray-800/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-3 p-2">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br text-blue-500 shadow-lg">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-lg bg-gradient-to-r text-blue-500 bg-clip-text">EduVerse</span>
                    <span className="truncate text-xs text-muted-foreground">Learning Universe</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Navigasi Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.title === 'Dashboard'}
                      className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-800/60 data-[active=true]:bg-gradient-to-r data-[active=true]:from-blue-500/10 data-[active=true]:to-blue-500/10 data-[active=true]:border data-[active=true]:border-blue-200 dark:data-[active=true]:border-blue-800"
                    >
                      <Link href={item.url} className="flex items-center gap-3 p-2">
                        <item.icon className={`size-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Manajemen</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {managementItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="group rounded-xl transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-800/60">
                      <Link href={item.url} className="flex items-center gap-3 p-2">
                        <item.icon className={`size-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Sistem</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {systemItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="group rounded-xl transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-800/60">
                      <Link href={item.url} className="flex items-center gap-3 p-2">
                        <item.icon className={`size-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-white/10 dark:border-gray-800/10 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="group rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/10 border border-blue-200 dark:border-blue-800 hover:from-blue-500/20 hover:to-blue-500/20 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-lg">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin" />
                      <AvatarFallback className="rounded-xl bg-gradient-to-br text-blue-500 font-bold">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.email}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem className="rounded-lg" asChild>
                    <Link href="/profile" className="w-full block">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-red-600">
                    <button type="button" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 cursor-pointer" onClick={handleLogout}>
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
