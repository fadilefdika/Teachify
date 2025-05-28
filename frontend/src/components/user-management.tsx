'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, UserPlus, Users, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const users = [
  {
    id: '1',
    name: 'Alice Cooper',
    email: 'alice@example.com',
    role: 'Siswa',
    status: 'Aktif',
    courses: 3,
    lastActive: '2 jam yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    roleColor: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'Instruktur',
    status: 'Aktif',
    courses: 5,
    lastActive: '1 jam yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    roleColor: 'bg-violet-100 text-blue-800 dark:bg-violet-900/20 dark:text-blue-400',
  },
  {
    id: '3',
    name: 'Carol Johnson',
    email: 'carol@example.com',
    role: 'Siswa',
    status: 'Tidak Aktif',
    courses: 1,
    lastActive: '3 hari yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    roleColor: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400',
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david@example.com',
    role: 'Admin',
    status: 'Aktif',
    courses: 0,
    lastActive: '30 menit yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    roleColor: 'bg-violet-100 text-blue-800 dark:bg-violet-900/20 dark:text-blue-400',
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva@example.com',
    role: 'Siswa',
    status: 'Aktif',
    courses: 2,
    lastActive: '5 jam yang lalu',
    avatar: '/placeholder.svg?height=32&width=32',
    roleColor: 'bg-slate-100 text-slate-800 dark:bg-slate-900/20 dark:text-slate-400',
  },
];

export function UserManagement() {
  return (
    <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-xl font-bold">Manajemen Pengguna</CardTitle>
              <CardDescription>Kelola siswa, instruktur, dan admin</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-900/20">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button className="rounded-xl bg-gradient-to-r bg-blue-500  shadow-lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah Pengguna
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/20 dark:border-gray-800/20 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-50/70 dark:hover:bg-gray-800/70">
                <TableHead className="font-semibold">Pengguna</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Kursus</TableHead>
                <TableHead className="font-semibold">Terakhir Aktif</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors duration-200">
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                        <AvatarImage src={user.avatar || '/placeholder.svg'} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br text-blue-500 font-semibold">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-full ${user.roleColor} border-0`}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'Aktif' ? 'default' : 'secondary'}
                      className={`rounded-full ${user.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'} border-0`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{user.courses}</span>
                      <span className="text-sm text-muted-foreground">kursus</span>
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
                        <DropdownMenuItem className="rounded-lg">Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg">Edit Pengguna</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg text-red-600">Hapus Pengguna</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
