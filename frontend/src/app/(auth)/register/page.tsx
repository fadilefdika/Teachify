'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon, BookOpen } from 'lucide-react';

import AuthLayout from '../layout';

const roles = [
  { label: 'User', value: 'user' },
  { label: 'Creator', value: 'creator' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    if (!form.role) {
      setError('Please select a role');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('api/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      if (form.role === 'creator') router.push('/complete-profile');
      else router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br px-4 py-1">
        <div className="w-full max-w-xl">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-800 tracking-tight">LMS Platform</span>
            </div>
          </div>

          {/* Card Container */}
          <Card className="rounded-2xl shadow-2xl bg-white/70 backdrop-blur-md border border-gray-200">
            <CardHeader className="text-center space-y-2 pt-1">
              <CardTitle className="text-2xl font-semibold text-gray-900">Create an account</CardTitle>
              <CardDescription className="text-sm text-gray-600">Enter your details below to get started</CardDescription>
            </CardHeader>

            <CardContent className="px-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6" noValidate>
                {/* Username */}
                <div className="flex flex-col">
                  <Label htmlFor="username" className="text-gray-700 font-medium mb-1">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="john_doe"
                    value={form.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    disabled={isLoading}
                    className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <Label htmlFor="email" className="text-gray-700 font-medium mb-1">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                    className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>

                {/* Role selection */}
                <div className="flex flex-col sm:col-span-2">
                  <Label htmlFor="role" className="text-gray-700 font-medium mb-2">
                    Select Role
                  </Label>
                  <select
                    id="role"
                    name="role"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={form.role || ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                    disabled={isLoading}
                  >
                    <option value="" disabled>
                      -- Select role --
                    </option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Password */}
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm Password
                  </Label>

                  {/* Wrap Input + Icon */}
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full rounded-md border-gray-300 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    {/* Eye icon */}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="sm:col-span-2">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300 disabled:opacity-50" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>

                  {error && (
                    <p className="mt-3 text-center text-sm text-red-600 font-medium" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              </form>
            </CardContent>

            <CardFooter className="text-center text-sm text-gray-700 pb-8">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:underline ml-1">
                Sign in
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthLayout>
  );
}
