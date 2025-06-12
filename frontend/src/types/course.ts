export interface Course {
  id: string;
  slug: string;
  title: string;
  description?: string;
  thumbnail?: string;
  level?: string;
  duration?: number;
  price?: number;
  status?: string;
  category?: string;
  lesson_count?: number;
  progress?: number;
  rating?: number;
  student_count?: number;
  last_updated?: string;
  creator_id: string;
  creator: {
    id: string;
    name: string;
    email: string;
  };
  lessons?: any[];
}
