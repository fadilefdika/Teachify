'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Clock } from 'lucide-react';

const courses = [
  {
    name: 'React Fundamentals',
    students: 245,
    completion: 78,
    status: 'Aktif',
    category: 'Frontend',
    duration: '8 minggu',
    color: 'from-violet-500/5 to-purple-500/5',
  },
  {
    name: 'Node.js Backend',
    students: 189,
    completion: 65,
    status: 'Aktif',
    category: 'Backend',
    duration: '10 minggu',
    color: 'from-slate-500/5 to-gray-500/5',
  },
  {
    name: 'UI/UX Design',
    students: 156,
    completion: 82,
    status: 'Aktif',
    category: 'Design',
    duration: '6 minggu',
    color: 'from-violet-500/5 to-purple-500/5',
  },
  {
    name: 'Python Programming',
    students: 298,
    completion: 71,
    status: 'Aktif',
    category: 'Programming',
    duration: '12 minggu',
    color: 'from-slate-500/5 to-gray-500/5',
  },
  {
    name: 'Data Science',
    students: 134,
    completion: 59,
    status: 'Draft',
    category: 'Analytics',
    duration: '16 minggu',
    color: 'from-violet-500/5 to-purple-500/5',
  },
];

export function CourseOverview() {
  return (
    <Card className="lg:col-span-7 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          <CardTitle className="text-xl font-bold">Overview Kursus</CardTitle>
        </div>
        <CardDescription>Statistik kursus yang sedang berjalan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {courses.map((course, index) => (
          <div key={course.name} className={`group p-4 rounded-2xl bg-gradient-to-r ${course.color} bg-opacity-5 hover:bg-opacity-10 transition-all duration-300 border border-white/20 dark:border-gray-800/20 hover:scale-[1.02]`}>
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{course.name}</h3>
                  <Badge variant={course.status === 'Aktif' ? 'default' : 'secondary'} className="text-xs">
                    {course.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{course.students} siswa</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.duration}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{course.completion}%</div>
                <div className="text-xs text-muted-foreground">Selesai</div>
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={course.completion} className={`h-3 bg-gray-200 dark:bg-gray-700`} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress pembelajaran</span>
                <span>{course.completion}% dari target</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
