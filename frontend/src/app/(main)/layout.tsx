import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/Sidebar';
import { AppProvider } from './AppProvider';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/30 dark:from-gray-900 dark:via-violet-900/10 dark:to-purple-900/10">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main>{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </AppProvider>
  );
}
