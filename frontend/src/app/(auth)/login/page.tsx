'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, BookOpen } from 'lucide-react';
import AuthLayout from '../layout';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError('Email dan password wajib diisi');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login response JSON:', data);

      if (res.ok) {
        localStorage.setItem('userId', data.user.id.toString());

        // Redirect berdasarkan kebutuhan
        // if (data.user.needsCompletion) {
        //   router.push('/dashboard');
        // } else {
        //   router.push('/complete-profile');
        // }

        router.push('/dashboard');
      } else {
        setError(data.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800">LMS Platform</span>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-lg bg-white shadow-md p-6 space-y-6 transition duration-300">
            {/* Header */}
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
              <p className="text-sm text-gray-500">Enter your email and password to access your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                />
              </div>
              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline transition">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="rounded-md pr-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Button */}
              <div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 cursor-pointer" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
              {error && <div className="error-message text-red-500 text-sm">*{error}</div>} {/* Tampilkan pesan error */}
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline font-medium transition">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
