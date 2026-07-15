import { notFound } from 'next/navigation';
import BlogDetailClient from '@/app/blogs/[id]/BlogDetailClient';

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blogId = Number(resolvedParams.id);

  if (!Number.isInteger(blogId) || blogId <= 0) {
    notFound();
  }

  return <BlogDetailClient blogId={blogId} />;
}
