'use client';

import { BookOpen, Users, GraduationCap, BarChart3, Settings, FileText, Calendar, MessageSquare, CreditCard, Shield, Home, Video, Award, Sparkles } from 'lucide-react';

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    color: 'text-violet-600',
  },
  {
    title: 'Pengguna',
    url: '#',
    icon: Users,
    color: 'text-violet-600',
  },
  {
    title: 'Kursus',
    url: '#',
    icon: BookOpen,
    color: 'text-violet-600',
  },
  {
    title: 'Instruktur',
    url: '#',
    icon: GraduationCap,
    color: 'text-violet-600',
  },
  {
    title: 'Konten',
    url: '#',
    icon: Video,
    color: 'text-violet-600',
  },
  {
    title: 'Sertifikat',
    url: '#',
    icon: Award,
    color: 'text-violet-600',
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
    title: 'Jadwal',
    url: '#',
    icon: Calendar,
    color: 'text-slate-600',
  },
  {
    title: 'Pesan',
    url: '#',
    icon: MessageSquare,
    color: 'text-slate-600',
  },
  {
    title: 'Pembayaran',
    url: '#',
    icon: CreditCard,
    color: 'text-slate-600',
  },
  {
    title: 'Dokumen',
    url: '#',
    icon: FileText,
    color: 'text-slate-600',
  },
];

const systemItems = [
  {
    title: 'Keamanan',
    url: '#',
    icon: Shield,
    color: 'text-slate-600',
  },
  {
    title: 'Pengaturan',
    url: '/profile',
    icon: Settings,
    color: 'text-slate-600',
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="inset" className="border-r-0">
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-white/20 dark:border-gray-800/20">
        <SidebarHeader className="border-b border-white/10 dark:border-gray-800/10">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-3 p-2">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg">
                    <Sparkles className="size-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">EduVerse</span>
                    <span className="truncate text-xs text-muted-foreground">Learning Universe</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Navigasi Utama</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={item.title === 'Dashboard'}
                      className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-800/60 data-[active=true]:bg-gradient-to-r data-[active=true]:from-violet-500/10 data-[active=true]:to-purple-500/10 data-[active=true]:border data-[active=true]:border-violet-200 dark:data-[active=true]:border-violet-800"
                    >
                      <a href={item.url} className="flex items-center gap-3 p-2">
                        <item.icon className={`size-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="font-medium">{item.title}</span>
                      </a>
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
                      <a href={item.url} className="flex items-center gap-3 p-2">
                        <item.icon className={`size-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="font-medium">{item.title}</span>
                      </a>
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
                      <a href={item.url} className="flex items-center gap-3 p-2">
                        <item.icon className={`size-5 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
                        <span className="font-medium">{item.title}</span>
                      </a>
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
                    className="group rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-200 dark:border-violet-800 hover:from-violet-500/20 hover:to-purple-500/20 transition-all duration-200"
                  >
                    <Avatar className="h-9 w-9 rounded-xl border-2 border-white shadow-lg">
                      <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Admin" />
                      <AvatarFallback className="rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Admin User</span>
                      <span className="truncate text-xs text-muted-foreground">admin@eduverse.com</span>
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuItem className="rounded-lg">
                    <span>Profil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-lg">
                    <span>Pengaturan Akun</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="rounded-lg text-red-600">
                    <span>Keluar</span>
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
