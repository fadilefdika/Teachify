import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddCourseModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [lessons, setLessons] = useState(0);
  const [progress, setProgress] = useState(0);
  const [rating, setRating] = useState(0);
  const [students, setStudents] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          image_url: imageUrl,
          level,
          duration: parseInt(duration), // pastikan int
          price: parseFloat(price), // pastikan float
          status,
          category,
        }),
      });
      if (!res.ok) throw new Error('Failed to add course');
      // Reset form
      setTitle('');
      setDescription('');
      setImageUrl('');
      setLevel('');
      setDuration('');
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
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Course</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left Column - Basic Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Course Information</h3>

            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title *
              </label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} disabled={loading} />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} disabled={loading} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="level" className="block text-sm font-medium mb-1">
                  Level
                </label>
                <Select value={level} onValueChange={setLevel} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading} />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Course Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium mb-1">
                  Duration
                </label>
                <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} disabled={loading} placeholder="e.g. 8 weeks" />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-1">
                  Price
                </label>
                <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} disabled={loading} placeholder="0.00" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <Select value={status} onValueChange={setStatus} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label htmlFor="lastUpdated" className="block text-sm font-medium mb-1">
                  Last Updated
                </label>
                <Input type="date" id="lastUpdated" value={lastUpdated} onChange={(e) => setLastUpdated(e.target.value)} disabled={loading} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !title}>
            {loading ? 'Adding...' : 'Add Course'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
