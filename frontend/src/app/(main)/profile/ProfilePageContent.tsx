'use client';

import { ArrowLeft, Shield, Mail, Phone, MapPin, Calendar, Camera, Edit } from 'lucide-react';

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface User {
  name?: string;
  email?: string;
  // Tambahkan properti lain kalau ada
}
interface ProfilePageProps {
  user: User;
  onBack: () => void;
}

export function ProfilePageContent({ user, onBack }: ProfilePageProps) {
  return (
    <SidebarInset>
      <header className="flex h-16 items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20">
        <div className="flex items-center gap-2 px-4 flex-1">
          <SidebarTrigger className="-ml-1 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-lg" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#" onClick={onBack} className="text-blue-600 hover:text-blue-700">
                  Admin Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold">Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <Button variant="outline" onClick={onBack} className="rounded-xl border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-900/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r text-blue-600 bg-clip-text">Profile Settings</h1>
          <p className="text-lg text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Overview Card */}
          <Card className="lg:col-span-1 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src="/placeholder.svg" alt="Admin User" />
                  <AvatarFallback className="bg-gradient-to-br text-blue-500 text-2xl font-bold">{user.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white shadow-lg hover:bg-gray-50">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>System Administrator</CardDescription>
                <Badge className="bg-violet-100 text-blue-800 dark:bg-violet-900/20 dark:text-blue-400">
                  <Shield className="mr-1 h-3 w-3" />
                  Admin
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>bujang, CA</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined March 2023</span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card className="lg:col-span-2 border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and contact information</CardDescription>
                </div>
                <Button variant="outline" className="rounded-xl">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue="Experienced system administrator with a passion for educational technology and learning management systems." className="min-h-[100px]" />
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="rounded-xl bg-gradient-to-r bg-blue-500 ">Save Changes</Button>
                <Button variant="outline" className="rounded-xl">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Settings */}
        <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Security Settings</CardTitle>
            <CardDescription>Manage your account security and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>

            <div className="flex gap-2 pt-4">
              <Button className="rounded-xl bg-gradient-to-r bg-blue-500 ">Update Password</Button>
              <Button variant="outline" className="rounded-xl">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
