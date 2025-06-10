import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Loader2 } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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

  return data.url.split('?')[0]; // return clean S3 URL
}

export default function AddCourseModal({ isOpen, onClose, onSuccess }: AddCourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(''); // ✅ ditambahkan

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleImageUpload(file: File) {
    setUploading(true);

    try {
      const url = await uploadToS3(file, 'creator-thumbnail/');
      setImageUrl(url);
      setThumbnail(file);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUpload(file);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    if (!imageUrl) {
      alert('Please upload a thumbnail image');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description,
        thumbnail: imageUrl,
        level,
        price: parseFloat(price) || 0,
        status,
        category,
      };

      console.log('Payload:', payload); // 🔍 Lihat hasil ini di console

      const res = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      console.log(res);
      if (!res.ok) throw new Error('Failed to add course');
      console.log('imagUrl', imageUrl);
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setThumbnail(null);
      setLevel('');
      setPrice('');
      setStatus('');
      setCategory('');

      onSuccess();
      onClose();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Add New Course
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-1 mb-6">Fill in the essential details to create a new course.</DialogDescription>
        </DialogHeader>

        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            placeholder="Enter course title"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            placeholder="Enter course description..."
            className="w-full min-h-[100px] rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              placeholder="e.g. Web Development"
              className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
              Level
            </label>
            <Select value={level} onValueChange={setLevel} disabled={loading}>
              <SelectTrigger className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-1.5">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 leading-tight">
              Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
              <Input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={loading}
                placeholder="0.00"
                type="number"
                min="0"
                step="0.01"
                className="w-full pl-8 pr-3 py-2.5 text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 leading-tight">
              Status
            </label>
            <Select value={status} onValueChange={setStatus} disabled={loading}>
              <SelectTrigger id="status" className="w-full py-2.5 px-3 text-sm border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="text-sm border-gray-200 rounded-md shadow-lg">
                <SelectItem value="draft" className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50">
                  Draft
                </SelectItem>
                <SelectItem value="published" className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50">
                  Published
                </SelectItem>
                <SelectItem value="archived" className="px-3 py-2 hover:bg-gray-50 focus:bg-gray-50">
                  Archived
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            disabled={loading || uploading}
            onChange={onFileChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
          {imageUrl && <img src={imageUrl} alt="Uploaded" className="mt-2 h-24 object-contain rounded-md border border-gray-200" />}
        </div>

        <DialogFooter className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
          <Button variant="outline" onClick={onClose} disabled={loading} className="border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-3">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !title.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding Course...
              </div>
            ) : (
              'Add Course'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
