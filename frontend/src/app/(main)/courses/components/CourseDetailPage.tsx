'use client';

import { use, useEffect, useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Play, FileText, Video, HelpCircle, Clock, Users, Star, Edit, Trash2, MoreHorizontal, Eye, EyeOff, DotIcon as DragHandleDots2, BookOpen, Award, BarChart3, Settings, Download, Upload } from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { Course } from '@/types/course';

interface CourseDetailPageProps {
  slug: string;
  onBack: () => void;
}

export default function CourseDetailPage({ onBack, slug }: CourseDetailPageProps) {
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [isDeleteLessonOpen, setIsDeleteLessonOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const { getCourseBySlug, courses } = useCourse();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourseBySlug(slug);
        console.log('ini data', data);
        if (!data) {
          console.warn('Course not found.');
          return;
        }
        console.log(data);
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, getCourseBySlug]);

  if (loading) return <div>Loading course...</div>;
  if (!course) return <div>Course not found.</div>;

  const handleEditLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setIsEditLessonOpen(true);
  };

  const handleDeleteLesson = (lesson: any) => {
    setCurrentLesson(lesson);
    setIsDeleteLessonOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'text':
        return FileText;
      case 'quiz':
        return HelpCircle;
      case 'assignment':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'text':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'quiz':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'assignment':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" className="text-blue-600 hover:text-blue-700">
                  Admin Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" onClick={onBack} className="text-blue-600 hover:text-blue-700">
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">{course?.title || 'Course Details'}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={onBack} className="rounded-xl border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
            <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lesson
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {/* Course Header */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img src={course?.thumbnail || '/placeholder.svg?height=120&width=200'} alt={course?.title} className="w-32 h-20 object-cover rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl font-bold">{course?.title}</CardTitle>
                    <Badge className={getStatusColor(course?.status || 'active')}>{course?.status || 'Active'}</Badge>
                  </div>
                  <CardDescription className="text-base">{course?.description}</CardDescription>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>2 students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {Math.floor(2 / 60)}h {Math.floor(2 % 60)}m
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{2} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{course?.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            {/* <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course?.instructorAvatar || '/placeholder.svg'} alt={course?.instructor} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white font-semibold">
                    {course?.instructor
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{course?.instructor}</div>
                  <div className="text-sm text-muted-foreground">Course Instructor</div>
                </div>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-xs">
                    {course?.category}
                  </Badge>
                </div>
              </div>
            </CardContent> */}
          </Card>

          {/* Course Stats */}
          <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Course Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{course?.progress}%</span>
                </div>
                <Progress value={course?.progress} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{2}</div>
                  <div className="text-xs text-muted-foreground">Published</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-600">{2 - 2}</div>
                  <div className="text-xs text-muted-foreground">Draft</div>
                </div>
              </div>
              <div className="pt-2 space-y-2">
                <Button variant="outline" className="w-full rounded-xl">
                  <Settings className="mr-2 h-4 w-4" />
                  Course Settings
                </Button>
                <Button variant="outline" className="w-full rounded-xl">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons Management */}
        <Tabs defaultValue="lessons" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl p-1">
              <TabsTrigger value="lessons" className="rounded-lg">
                Lessons
              </TabsTrigger>
              <TabsTrigger value="modules" className="rounded-lg">
                Modules
              </TabsTrigger>
              <TabsTrigger value="assignments" className="rounded-lg">
                Assignments
              </TabsTrigger>
            </TabsList>
            {/* <div className="flex gap-2">
              <Select value={selectedModule} onValueChange={setSelectedModule}>
                <SelectTrigger className="w-[180px] rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                  <SelectValue placeholder="Filter by module" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                  <SelectItem value="all">All Modules</SelectItem>
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" className="rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div> */}
          </div>

          {/* <TabsContent value="lessons">
            <div className="space-y-6">
              {courses.map((course) => {
                const moduleLessons = selectedModule === 'all' ? module.lessons : selectedModule === module.id ? module.lessons : [];

                if (moduleLessons.length === 0) return null;

                return (
                  <Card key={module.id} className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">{module.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {moduleLessons.length} lessons
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {moduleLessons.map((lesson, index) => {
                          const TypeIcon = getTypeIcon(lesson.type);
                          return (
                            <div
                              key={lesson.id}
                              className="group flex items-center gap-4 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-200 border border-white/20 dark:border-gray-700/20"
                            >
                              <div className="flex items-center gap-2">
                                <DragHandleDots2 className="h-4 w-4 text-gray-400 cursor-grab" />
                                <span className="text-sm font-medium text-gray-500 w-6">{lesson.order}</span>
                              </div>

                              <img src={lesson.thumbnail || '/placeholder.svg'} alt={lesson.title} className="w-16 h-10 object-cover rounded-lg" />

                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{lesson.title}</h3>
                                  <Badge className={`text-xs ${getTypeColor(lesson.type)}`}>
                                    <TypeIcon className="h-3 w-3 mr-1" />
                                    {lesson.type}
                                  </Badge>
                                  <Badge className={`text-xs ${getStatusColor(lesson.status)}`}>
                                    {lesson.status === 'published' ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                                    {lesson.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{lesson.views} views</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    <span>{lesson.completions} completed</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                  <Play className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                                    <DropdownMenuItem className="rounded-lg" onClick={() => handleEditLesson(lesson)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Lesson
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg">
                                      <Play className="mr-2 h-4 w-4" />
                                      Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg">
                                      {lesson.status === 'published' ? (
                                        <>
                                          <EyeOff className="mr-2 h-4 w-4" />
                                          Unpublish
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="mr-2 h-4 w-4" />
                                          Publish
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="rounded-lg text-red-600" onClick={() => handleDeleteLesson(lesson)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent> */}

          <TabsContent value="modules">
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Lesson Management</h3>
                    <p className="text-muted-foreground mb-4">Organize your lessons into lessons for better course structure.</p>
                    <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lesson
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Assignment Management</h3>
                    <p className="text-muted-foreground mb-4">Create and manage assignments for your course.</p>
                    <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Assignment
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Lesson Dialog */}
        <Dialog open={isAddLessonOpen} onOpenChange={setIsAddLessonOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add New Lesson</DialogTitle>
              <DialogDescription>Create a new lesson for this course. You can add content after creating the lesson.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="lessonTitle">Lesson Title</Label>
                <Input id="lessonTitle" placeholder="Enter lesson title" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessonDescription">Description</Label>
                <Textarea id="lessonDescription" placeholder="Enter lesson description" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lessonType">Lesson Type</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text/Article</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessonModule">Module</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    {/* <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          {module.name}
                        </SelectItem>
                      ))}
                    </SelectContent> */}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lessonDuration">Duration (mm:ss)</Label>
                  <Input id="lessonDuration" placeholder="15:30" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessonOrder">Order</Label>
                  <Input id="lessonOrder" type="number" placeholder="1" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddLessonOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700" onClick={() => setIsAddLessonOpen(false)}>
                Create Lesson
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Lesson Dialog */}
        <Dialog open={isEditLessonOpen} onOpenChange={setIsEditLessonOpen}>
          <DialogContent className="sm:max-w-[600px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Lesson</DialogTitle>
              <DialogDescription>Update lesson information and settings.</DialogDescription>
            </DialogHeader>
            {currentLesson && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editLessonTitle">Lesson Title</Label>
                  <Input id="editLessonTitle" defaultValue={currentLesson.title} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLessonDescription">Description</Label>
                  <Textarea id="editLessonDescription" defaultValue={currentLesson.description} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLessonType">Lesson Type</Label>
                    <Select defaultValue={currentLesson.type}>
                      <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text/Article</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLessonStatus">Status</Label>
                    <Select defaultValue={currentLesson.status}>
                      <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editLessonDuration">Duration (mm:ss)</Label>
                    <Input id="editLessonDuration" defaultValue={currentLesson.duration} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLessonOrder">Order</Label>
                    <Input id="editLessonOrder" type="number" defaultValue={currentLesson.order} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditLessonOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700" onClick={() => setIsEditLessonOpen(false)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Lesson Dialog */}
        <Dialog open={isDeleteLessonOpen} onOpenChange={setIsDeleteLessonOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Delete Lesson</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete the lesson and all its content.</DialogDescription>
            </DialogHeader>
            {currentLesson && (
              <div className="py-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                  <Trash2 className="h-6 w-6 text-red-600" />
                  <div>
                    <h4 className="font-semibold">Are you sure you want to delete this lesson?</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">{currentLesson.title}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteLessonOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button variant="destructive" className="rounded-xl" onClick={() => setIsDeleteLessonOpen(false)}>
                Delete Lesson
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Spacer */}
        <div className="h-4" />
      </div>
    </SidebarInset>
  );
}
