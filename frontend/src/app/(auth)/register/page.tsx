'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, BookOpen } from 'lucide-react';
import AuthLayout from './layout';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error); // Display backend error
        return;
      }

      const data = await res.json();

      //   Cookies.set('token', data.token, {
      //     path: '/',
      //     secure: true,
      //     sameSite: 'Lax',
      //   });

      // ✅ Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl space-y-10">
          {' '}
          {/* max-w diperbesar */}
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-800">LMS Platform</span>
            </div>
          </div>
          {/* Card */}
          <div className="rounded-xl bg-white shadow-xl p-10 space-y-6">
            {' '}
            {/* padding diperluas */}
            {/* Header */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold text-gray-800">Create an account</h2>
              <p className="text-sm text-gray-500">Enter your details to create an account</p>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {' '}
              {/* buat jadi 2 kolom */}
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                />
              </div>
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
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="rounded-md pr-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="rounded-md pr-10 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                  />
                  <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition" onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {/* Button - span 2 kolom */}
              <div className="md:col-span-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>
                {error && <div className="text-red-500 text-sm mt-2">*{error}</div>}
              </div>
            </form>
            {/* Footer */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium transition">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
