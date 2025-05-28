'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, TrendingUp, DollarSign, Award, ArrowUp } from 'lucide-react';

const stats = [
  {
    title: 'Total Siswa',
    value: '2,847',
    description: '+12% dari bulan lalu',
    icon: Users,
    trend: '+12%',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-500/10 ',
  },
  {
    title: 'Kursus Aktif',
    value: '156',
    description: '+3 kursus baru',
    icon: BookOpen,
    trend: '+3',
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-500/10 to-gray-500/10',
  },
  {
    title: 'Instruktur',
    value: '42',
    description: '+2 instruktur baru',
    icon: GraduationCap,
    trend: '+2',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Pendapatan',
    value: 'Rp 125,4M',
    description: '+8% dari bulan lalu',
    icon: DollarSign,
    trend: '+8%',
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-500/10 to-gray-500/10',
  },
  {
    title: 'Tingkat Penyelesaian',
    value: '78%',
    description: '+5% dari bulan lalu',
    icon: TrendingUp,
    trend: '+5%',
    color: 'bg-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Sertifikat Diterbitkan',
    value: '1,234',
    description: '+15% dari bulan lalu',
    icon: Award,
    trend: '+15%',
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-500/10 to-gray-500/10',
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card
          key={stat.title}
          className={`group relative overflow-hidden border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
          }`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`} />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium text-green-600">{stat.trend}</span>
              <span className="text-xs text-muted-foreground ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
