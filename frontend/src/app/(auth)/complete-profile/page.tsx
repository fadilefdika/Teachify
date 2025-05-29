'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function CompleteProfilePage() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !address || !ktpFile || !cvFile) {
      setError('Please fill all required fields and upload all documents.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Buat form data untuk upload file
    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('address', address);
    formData.append('ktp', ktpFile);
    formData.append('cv', cvFile);

    try {
      const res = await fetch('/api/complete-profile', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit profile');
        setIsLoading(false);
        return;
      }

      // Redirect ke dashboard setelah submit sukses
      router.push('/dashboard');
    } catch (error) {
      setError('Something went wrong, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-center">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber" className="block text-gray-700 mb-1">
              Phone Number
            </Label>
            <Input id="phoneNumber" type="text" placeholder="08123456789" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          </div>
          {/* Address */}
          <div>
            <Label htmlFor="address" className="block text-gray-700 mb-1">
              Address
            </Label>
            <Input id="address" type="text" placeholder="Your Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </div>
          {/* KTP Upload */}
          <div>
            <Label htmlFor="ktp" className="block text-gray-700 mb-1">
              Upload KTP
            </Label>
            <input id="ktp" type="file" accept="image/*,application/pdf" onChange={(e) => handleFileChange(e, setKtpFile)} required className="block w-full text-sm text-gray-600" />
            {ktpFile && <p className="mt-1 text-sm text-gray-700">Selected: {ktpFile.name}</p>}
          </div>
          {/* CV Upload */}
          <div>
            <Label htmlFor="cv" className="block text-gray-700 mb-1">
              Upload CV
            </Label>
            <input id="cv" type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setCvFile)} required className="block w-full text-sm text-gray-600" />
            {cvFile && <p className="mt-1 text-sm text-gray-700">Selected: {cvFile.name}</p>}
          </div>
          {/* Error message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
}
