'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Course } from '@/types/course';

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  fetchCourses: () => void;
  getCourseBySlug: (slug: string) => Promise<Course | null>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/courses'); // Proxy to your BE
      const data = await res.json();
      setCourses(data?.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseBySlug = async (slug: string): Promise<Course | null> => {
    try {
      const res = await fetch(`/api/courses/${slug}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.course;
    } catch (error) {
      console.error('Failed to fetch course by slug:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return <CourseContext.Provider value={{ courses, loading, fetchCourses, getCourseBySlug }}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourse must be used within a CourseProvider');
  return context;
};
