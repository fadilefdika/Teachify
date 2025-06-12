'use client';
import CourseDetailPage from '../components/CourseDetailPage';
export default function CourseSlugPage({ params }: { params: { slug: string } }) {
  return <CourseDetailPage slug={params.slug} onBack={() => {}} />;
}
