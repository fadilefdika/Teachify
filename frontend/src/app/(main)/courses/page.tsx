'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Filter, BookOpen, Users, Clock, Star, Play, Edit, Trash2, MoreHorizontal, TrendingUp } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AddCourseModal from './components/AddCourseModal';
import Link from 'next/link';

const stats = [
  {
    title: 'Total Courses',
    value: '156',
    description: '+12 this month',
    icon: BookOpen,
    color: 'from-blue-500 to-sky-500',
    bgColor: 'from-blue-500/10 to-sky-500/10',
  },
  {
    title: 'Active Students',
    value: '2,847',
    description: '+245 this week',
    icon: Users,
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-500/10 to-gray-500/10',
  },
  {
    title: 'Completion Rate',
    value: '78%',
    description: '+5% improvement',
    icon: TrendingUp,
    color: 'from-blue-500 to-sky-500',
    bgColor: 'from-blue-500/10 to-sky-500/10',
  },
  {
    title: 'Revenue',
    value: '$125.4K',
    description: '+8% this month',
    icon: TrendingUp,
    color: 'from-slate-500 to-gray-500',
    bgColor: 'from-slate-500/10 to-gray-500/10',
  },
];

// ✅ Tambahkan data dummy
interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  level: string;
  slug: string;
  price: number;
  status: string;
  category: string;
}

export default function CoursesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`/api/courses?page=1&limit=10`);
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  function handleAddSuccess() {
    setIsModalOpen(false);
    fetchCourses(); // refresh list setelah tambah course baru
  }

  if (isLoading || !user) return <div>Loading...</div>;
  return (
    <SidebarInset>
      {/* Header */}
      <header className="flex h-16 items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Admin Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Courses</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search courses..." className="pl-10 w-64 bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20 rounded-xl backdrop-blur-sm" />
            </div>
            <Button variant="outline" className="rounded-xl border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 shadow-lg" onClick={() => setIsModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
            <AddCourseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={handleAddSuccess} />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-6 p-6 pt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="space-y-2">
          <h1 className="text-4xl text-blue-600 font-bold">Course Management</h1>
          <p className="text-lg text-muted-foreground">Manage and monitor all courses in your learning platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-900/80 hover:shadow-lg">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`} />
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold">{stat.title}</CardTitle>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg mt-10">No courses available. Try adding some!</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link href={`/courses/${course.slug}`} key={course.id} className="group">
                <Card key={course.id} className="group overflow-hidden border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all hover:shadow-xl">
                  <div className="relative">
                    <img src={course.thumbnail || '/placeholder.svg'} alt={course.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-3 left-3">
                      <Badge variant={course.status === 'Active' ? 'default' : 'secondary'}>{course.status}</Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white rounded-lg shadow-md">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Course
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-bold line-clamp-1">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.level}
                      </Badge>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">5</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>3 students</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
