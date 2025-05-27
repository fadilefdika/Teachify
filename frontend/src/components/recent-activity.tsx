'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, UserPlus, FileText, Play, Trophy } from 'lucide-react';

const activities = [
  {
    user: 'Sarah Johnson',
    action: 'menyelesaikan kursus',
    course: 'React Fundamentals',
    time: '2 menit yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    type: 'completion',
    icon: Trophy,
    color: 'text-blue-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/20',
  },
  {
    user: 'Michael Chen',
    action: 'mendaftar kursus',
    course: 'Node.js Backend',
    time: '15 menit yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    type: 'enrollment',
    icon: UserPlus,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-900/20',
  },
  {
    user: 'Emily Davis',
    action: 'mengirim tugas',
    course: 'UI/UX Design',
    time: '1 jam yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    type: 'submission',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/20',
  },
  {
    user: 'David Wilson',
    action: 'memulai kursus',
    course: 'Python Programming',
    time: '2 jam yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    type: 'start',
    icon: Play,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 dark:bg-slate-900/20',
  },
  {
    user: 'Lisa Anderson',
    action: 'menyelesaikan quiz',
    course: 'Data Science',
    time: '3 jam yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    type: 'quiz',
    icon: CheckCircle,
    color: 'text-blue-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/20',
  },
];

export function RecentActivity() {
  return (
    <Card className="lg:col-span-5 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-xl font-bold">Aktivitas Terbaru</CardTitle>
        </div>
        <CardDescription>Aktivitas siswa dalam 24 jam terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="group flex items-center space-x-4 p-3 rounded-xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 border border-transparent hover:border-white/20 dark:hover:border-gray-700/20">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                  <AvatarImage src={activity.avatar || '/placeholder.svg'} alt={activity.user} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white font-semibold">
                    {activity.user
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${activity.bgColor} border-2 border-white dark:border-gray-900`}>
                  <activity.icon className={`h-3 w-3 ${activity.color}`} />
                </div>
              </div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">{activity.user}</p>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} <span className="font-medium text-blue-600">{activity.course}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
