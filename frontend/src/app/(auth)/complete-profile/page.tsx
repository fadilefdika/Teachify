'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@radix-ui/react-scroll-area';

// Dummy uploader, ganti dengan endpoint asli kamu
async function uploadToS3(file: File, folder: string): Promise<string> {
  const fileName = `${folder}${Date.now()}_${file.name}`;
  const res = await fetch(`/api/presigned-url?filename=${encodeURIComponent(fileName)}`);

  if (!res.ok) throw new Error('Failed to get presigned URL');

  const data = await res.json();

  const uploadRes = await fetch(data.url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) throw new Error('Failed to upload to S3');

  // Return clean S3 URL (tanpa tanda tanya)
  return data.url.split('?')[0];
}

export default function CreatorRegistrationForm() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [userId, setUserId] = useState<string>('');
  const [bankAccount, setBankAccount] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [socialMedia, setSocialMedia] = useState('');
  const [biography, setBiography] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    console.log('[DEBUG] Component mounted');
    console.log('[DEBUG] LocalStorage userId:', storedUserId);

    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.warn('[DEBUG] No userId found in localStorage');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log('[DEBUG] Form submission started');
    console.log('[DEBUG] phoneNumber:', phoneNumber);
    console.log('[DEBUG] address:', address);
    console.log('[DEBUG] userId:', userId);
    console.log('[DEBUG] Files => KTP:', ktpFile, '| CV:', cvFile, '| Selfie:', selfieFile);

    if (!ktpFile || !cvFile || !selfieFile || !phoneNumber || !address || !biography) {
      console.error('[DEBUG] Incomplete form submission');
      setError('Please complete all required fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('[DEBUG] Uploading files to S3...');

      const ktpUrl = await uploadToS3(ktpFile, 'creator-ktp/');
      const cvUrl = await uploadToS3(cvFile, 'creator-cv/');
      const selfieUrl = await uploadToS3(selfieFile, 'creator-selfie/');

      console.log('[DEBUG] S3 Uploads Complete => KTP:', ktpUrl, '| CV:', cvUrl, '| Selfie:', selfieUrl);

      const payload = {
        userId,
        phoneNumber,
        address,
        bankAccount,
        ktpUrl,
        cvUrl,
        selfieUrl,
        portfolioUrl,
        socialMedia,
        biography,
      };

      console.log('[DEBUG] Final Payload:', payload);

      const res = await fetch('/api/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      console.log('[DEBUG] Fetch Response => Status:', res.status);
      console.log('[DEBUG] Response Headers:', [...res.headers.entries()]);
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await res.json();
        console.log('[DEBUG] Response JSON:', data);
      } else {
        console.log('[DEBUG] Response non-JSON');
      }

      if (!res.ok) {
        setError('Failed to submit registration. Please check your data.');
        return;
      }

      console.log('[DEBUG] Redirecting to /dashboard...');
      router.push('/dashboard');
    } catch (err) {
      console.error('[DEBUG] Submission Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full m-4 p-10 bg-white rounded-2xl shadow-xl border border-gray-200 space-y-10 transition-all">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Become a Creator</h1>
        <p className="text-gray-500 text-lg">Fill in the form below to register as a course creator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" name="phone" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankAccount">Bank Account (optional)</Label>
          <Input id="bankAccount" name="bankAccount" value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Full Address</Label>
          <Textarea id="address" name="address" rows={3} required value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ktp">Upload National ID (KTP)</Label>
          <Input id="ktp" name="ktp" type="file" accept="image/*" required onChange={(e) => setKtpFile(e.target.files?.[0] || null)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="selfie">Upload Selfie with ID</Label>
          <Input id="selfie" name="selfie" type="file" accept="image/*" required onChange={(e) => setSelfieFile(e.target.files?.[0] || null)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cv">Upload CV (PDF)</Label>
          <Input id="cv" name="cv" type="file" accept=".pdf" required onChange={(e) => setCvFile(e.target.files?.[0] || null)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio URL (optional)</Label>
          <Input id="portfolio" name="portfolio" type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="socialMedia">Social Media</Label>
          <Input id="socialMedia" name="socialMedia" type="url" value={socialMedia} onChange={(e) => setSocialMedia(e.target.value)} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="biography">Short Biography</Label>
          <Textarea id="biography" name="biography" rows={4} required value={biography} onChange={(e) => setBiography(e.target.value)} />
        </div>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox id="terms" checked={termsAccepted} onCheckedChange={(v) => setTermsAccepted(!!v)} />
        <Label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the{' '}
          <Dialog>
            <DialogTrigger className="text-blue-600 underline hover:text-blue-800 transition">terms and conditions</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Terms & Conditions for Course Creators</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] pr-4">
                <div className="text-sm text-gray-700 space-y-4 mt-4">
                  <p>Welcome to our Creator Program. By registering, you agree to the following terms:</p>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      <strong>Content Ownership:</strong> You retain ownership of the courses you upload, but grant us non-exclusive rights to distribute and display them.
                    </li>
                    <li>
                      <strong>Content Guidelines:</strong> Your content must not contain harmful, misleading, or plagiarized material. We reserve the right to remove any content that violates these guidelines.
                    </li>
                    <li>
                      <strong>Payments:</strong> Revenue sharing is based on net revenue and will be paid monthly. You are responsible for providing accurate payment information.
                    </li>
                    <li>
                      <strong>Code of Conduct:</strong> Be respectful to learners and the community. Harassment or abuse of any kind will result in removal.
                    </li>
                    <li>
                      <strong>Termination:</strong> We may terminate your account if you violate any of these terms.
                    </li>
                  </ol>
                  <p>For any questions, feel free to contact our support team. These terms are subject to change at any time.</p>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </Label>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="pt-4">
        <Button type="submit" disabled={!termsAccepted || isLoading} className="w-full md:w-fit px-8 py-3 text-lg">
          {isLoading ? 'Submitting...' : 'Submit Registration'}
        </Button>
      </div>
    </form>
  );
}
