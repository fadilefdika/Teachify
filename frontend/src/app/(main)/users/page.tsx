'use client';

import { useState } from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Filter, Users, UserPlus, UserCheck, UserX, Mail, Calendar, MoreHorizontal, Edit, Trash2, Ban, ShieldAlert, ShieldCheck, Download, RefreshCw, AlertCircle } from 'lucide-react';

interface UsersPageProps {
  onBack: () => void;
}

// Sample user data
const users = [
  {
    id: '1',
    name: 'Alice Cooper',
    email: 'alice@example.com',
    role: 'Student',
    status: 'Active',
    courses: 3,
    lastActive: '2 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 123-4567',
    joinDate: 'Jan 15, 2023',
    verified: true,
    location: 'New York, USA',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Instructor',
    status: 'Active',
    courses: 5,
    lastActive: '1 hour ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 234-5678',
    joinDate: 'Feb 3, 2023',
    verified: true,
    location: 'San Francisco, USA',
  },
  {
    id: '3',
    name: 'Carol Johnson',
    email: 'carol@example.com',
    role: 'Student',
    status: 'Blocked',
    courses: 1,
    lastActive: '3 days ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 345-6789',
    joinDate: 'Mar 20, 2023',
    verified: true,
    location: 'Chicago, USA',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Admin',
    status: 'Active',
    courses: 0,
    lastActive: '30 minutes ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 456-7890',
    joinDate: 'Dec 5, 2022',
    verified: true,
    location: 'Boston, USA',
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    role: 'Student',
    status: 'Active',
    courses: 2,
    lastActive: '5 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 567-8901',
    joinDate: 'Apr 12, 2023',
    verified: false,
    location: 'Miami, USA',
  },
  {
    id: '6',
    name: 'Frank Wilson',
    email: 'frank@example.com',
    role: 'Instructor',
    status: 'Pending',
    courses: 4,
    lastActive: '1 day ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 678-9012',
    joinDate: 'May 8, 2023',
    verified: false,
    location: 'Seattle, USA',
  },
  {
    id: '7',
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'Student',
    status: 'Active',
    courses: 6,
    lastActive: '4 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 789-0123',
    joinDate: 'Jun 22, 2023',
    verified: true,
    location: 'Austin, USA',
  },
  {
    id: '8',
    name: 'Henry Garcia',
    email: 'henry@example.com',
    role: 'Student',
    status: 'Inactive',
    courses: 1,
    lastActive: '2 weeks ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 890-1234',
    joinDate: 'Jul 17, 2023',
    verified: true,
    location: 'Denver, USA',
  },
  {
    id: '9',
    name: 'Irene Taylor',
    email: 'irene@example.com',
    role: 'Instructor',
    status: 'Active',
    courses: 3,
    lastActive: '6 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 901-2345',
    joinDate: 'Aug 9, 2023',
    verified: true,
    location: 'Portland, USA',
  },
  {
    id: '10',
    name: 'Jack Robinson',
    email: 'jack@example.com',
    role: 'Student',
    status: 'Active',
    courses: 2,
    lastActive: '3 hours ago',
    avatar: '/placeholder.svg?height=40&width=40',
    phone: '+1 (555) 012-3456',
    joinDate: 'Sep 14, 2023',
    verified: true,
    location: 'Atlanta, USA',
  },
];

// Stats for the dashboard
const stats = [
  {
    title: 'Total Users',
    value: '3,842',
    description: '+12% from last month',
    icon: Users,
    color: 'from-blue-500 to-sky-500',
    bgColor: 'from-blue-500/10 to-sky-500/10',
  },
  {
    title: 'Active Users',
    value: '2,945',
    description: '76% of total users',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-500/10 to-emerald-500/10',
  },
  {
    title: 'Inactive Users',
    value: '897',
    description: '24% of total users',
    icon: UserX,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-500/10 to-orange-500/10',
  },
  {
    title: 'New Registrations',
    value: '156',
    description: 'This month',
    icon: UserPlus,
    color: 'from-blue-500 to-sky-500',
    bgColor: 'from-blue-500/10 to-sky-500/10',
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isBlockUserOpen, setIsBlockUserOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole.toLowerCase();
    const matchesStatus = selectedStatus === 'all' || user.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    setCurrentUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleBlockUser = (user: any) => {
    setCurrentUser(user);
    setIsBlockUserOpen(true);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'blocked':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'instructor':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'student':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400';
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
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Users</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20 rounded-xl backdrop-blur-sm"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 shadow-lg">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Add New User</DialogTitle>
                  <DialogDescription>Create a new user account. They will receive an email to set their password.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Enter first name" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Enter last name" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email address" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="instructor">Instructor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="Enter phone number" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="City, Country" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="sendEmail" />
                    <Label htmlFor="sendEmail">Send welcome email with password setup instructions</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)} className="rounded-xl">
                    Cancel
                  </Button>
                  <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700" onClick={() => setIsAddUserOpen(false)}>
                    Create User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">User Management</h1>
          <p className="text-lg text-muted-foreground">Manage all users in your learning platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="group relative overflow-hidden border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:scale-105">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`} />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Management Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl p-1">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white transition-colors">
                All Users
              </TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white transition-colors">
                Students
              </TabsTrigger>
              <TabsTrigger value="instructors" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white transition-colors">
                Instructors
              </TabsTrigger>
              <TabsTrigger value="admins" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-sky-600 data-[state=active]:text-white transition-colors">
                Admins
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px] rounded-xl bg-white/70 dark:bg-gray-800/70 border border-white/30 dark:border-gray-700/30 shadow-sm">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="rounded-xl bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="rounded-xl bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="all">
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="rounded-xl overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-800/70">
                        <TableHead className="w-[50px]">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="font-semibold">User</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Courses</TableHead>
                        <TableHead className="font-semibold">Joined</TableHead>
                        <TableHead className="font-semibold">Last Active</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors duration-200">
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                                <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white font-semibold">
                                  {user.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`rounded-full ${getRoleBadgeClass(user.role)} border-0`}>{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`rounded-full ${getStatusBadgeClass(user.status)} border-0`}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="font-semibold">{user.courses}</span>
                              <span className="text-sm text-muted-foreground">courses</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {user.joinDate}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{user.lastActive}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-white/60 dark:hover:bg-gray-800/60">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                                <DropdownMenuItem className="rounded-lg" onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg">
                                  <ShieldCheck className="mr-2 h-4 w-4" />
                                  Change Role
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="rounded-lg text-amber-600" onClick={() => handleBlockUser(user)}>
                                  <Ban className="mr-2 h-4 w-4" />
                                  {user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-lg text-red-600" onClick={() => handleDeleteUser(user)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t border-white/10 dark:border-gray-800/10 p-4">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{filteredUsers.length}</span> of <span className="font-medium">{users.length}</span> users
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <Users className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Student Management</h3>
                    <p className="text-muted-foreground mb-4">Filter by "Student" role above to view and manage student accounts.</p>
                    <Button onClick={() => setSelectedRole('student')} className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700">
                      View Students
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructors">
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <Users className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Instructor Management</h3>
                    <p className="text-muted-foreground mb-4">Filter by "Instructor" role above to view and manage instructor accounts.</p>
                    <Button onClick={() => setSelectedRole('instructor')} className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700">
                      View Instructors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admins">
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-center p-12">
                  <div className="text-center">
                    <ShieldAlert className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Admin Management</h3>
                    <p className="text-muted-foreground mb-4">Filter by "Admin" role above to view and manage administrator accounts.</p>
                    <Button onClick={() => setSelectedRole('admin')} className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700">
                      View Admins
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent className="sm:max-w-[525px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit User</DialogTitle>
              <DialogDescription>Update user information and settings.</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="grid gap-4 py-4">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={currentUser.avatar || '/placeholder.svg'} alt={currentUser.name} />
                      {/* <AvatarFallback className="bg-gradient-to-br from-blue-500 to-sky-600 text-white text-xl font-semibold">
                        {currentUser.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback> */}
                    </Avatar>
                    <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white shadow-lg hover:bg-gray-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editFirstName">First Name</Label>
                    <Input id="editFirstName" defaultValue={currentUser.name.split(' ')[0]} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLastName">Last Name</Label>
                    <Input id="editLastName" defaultValue={currentUser.name.split(' ')[1] || ''} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input id="editEmail" type="email" defaultValue={currentUser.email} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editRole">Role</Label>
                    <Select defaultValue={currentUser.role.toLowerCase()}>
                      <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editStatus">Status</Label>
                    <Select defaultValue={currentUser.status.toLowerCase()}>
                      <SelectTrigger className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editPhone">Phone Number</Label>
                    <Input id="editPhone" defaultValue={currentUser.phone} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLocation">Location</Label>
                    <Input id="editLocation" defaultValue={currentUser.location} className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="resetPassword" />
                  <Label htmlFor="resetPassword">Send password reset email</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditUserOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button className="rounded-xl bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700" onClick={() => setIsEditUserOpen(false)}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Delete User</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently delete the user account and remove their data from our servers.</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="py-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h4 className="font-semibold">Are you sure you want to delete this user?</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">{currentUser.name}</span> ({currentUser.email})
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button variant="destructive" className="rounded-xl" onClick={() => setIsDeleteUserOpen(false)}>
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Block User Dialog */}
        <Dialog open={isBlockUserOpen} onOpenChange={setIsBlockUserOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-800/20">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{currentUser?.status === 'Blocked' ? 'Unblock User' : 'Block User'}</DialogTitle>
              <DialogDescription>{currentUser?.status === 'Blocked' ? "This will restore the user's access to the platform." : 'This will prevent the user from accessing the platform until unblocked.'}</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="py-4">
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                  <Ban className="h-6 w-6 text-amber-600" />
                  <div>
                    <h4 className="font-semibold">{currentUser.status === 'Blocked' ? 'Are you sure you want to unblock this user?' : 'Are you sure you want to block this user?'}</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">{currentUser.name}</span> ({currentUser.email})
                    </p>
                  </div>
                </div>
                {currentUser.status !== 'Blocked' && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="blockReason">Reason for blocking (optional)</Label>
                    <Input id="blockReason" placeholder="Enter reason" className="rounded-xl bg-white/60 dark:bg-gray-800/60 border-white/20 dark:border-gray-700/20" />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox id="notifyUser" />
                      <Label htmlFor="notifyUser">Notify user via email</Label>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBlockUserOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" onClick={() => setIsBlockUserOpen(false)}>
                {currentUser?.status === 'Blocked' ? 'Unblock User' : 'Block User'}
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
