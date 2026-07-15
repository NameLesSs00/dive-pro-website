'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import BlogCard from '@/components/blogs/BlogCard';
import { usePublicBlogCategories } from '@/features/blogCategories/blogCategoryQueries';
import { usePublicBlogs } from '@/features/blogs/blogQueries';

function SectionHeading() {
  return (
    <motion.div
      className="mb-8 text-center md:mb-14"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#0037AD]">Learn before you dive</p>
      <h2 className="text-2xl font-extrabold leading-tight text-[#00113A] md:text-4xl">Diving Tips & Guides</h2>
      <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#0037AD]" />
    </motion.div>
  );
}

export default function HomeBlogGuides() {
  const blogsQuery = usePublicBlogs({ pageNumber: 1, pageSize: 3, search: '' });
  const categoriesQuery = usePublicBlogCategories({ pageNumber: 1, pageSize: 100, search: '' });
  const categories = categoriesQuery.data?.blogCategories ?? [];
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]));
  const blogs = (blogsQuery.data?.blogs ?? []).map((blog) => ({
    ...blog,
    categoryName: blog.categoryName || categoryNameById.get(blog.categoryId) || blog.categoryName,
  }));

  return (
    <section className="bg-[#F8FAFE] py-12 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <SectionHeading />

        {blogsQuery.isLoading && (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {[0, 1, 2].map((item) => (
              <div key={item} className="min-w-[86%] snap-center overflow-hidden rounded-[28px] border border-[#E5ECF8] bg-white md:min-w-0">
                <div className="h-64 animate-pulse bg-[#EAF1FF]" />
                <div className="space-y-4 p-6">
                  <div className="h-6 animate-pulse rounded bg-[#EAF1FF]" />
                  <div className="h-4 animate-pulse rounded bg-[#F2F6FF]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#F2F6FF]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {blogsQuery.isError && (
          <div className="mx-auto max-w-2xl">
            <ApiErrorMessage error={blogsQuery.error} title="Could not load diving guides" />
          </div>
        )}

        {!blogsQuery.isLoading && !blogsQuery.isError && blogs.length > 0 && (
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {blogs.map((blog, index) => (
              <div key={blog.id} className="min-w-[86%] snap-center md:min-w-0">
                <BlogCard blog={blog} index={index} />
              </div>
            ))}
          </div>
        )}

        {!blogsQuery.isLoading && !blogsQuery.isError && blogs.length === 0 && (
          <div className="rounded-[28px] border border-[#E5ECF8] bg-white px-6 py-12 text-center shadow-[0_18px_45px_rgba(0,17,58,0.06)]">
            <h3 className="text-xl font-extrabold text-[#00113A]">Guides are coming soon</h3>
            <p className="mt-2 text-[#5E6675]">New diving tips will appear here once they are published.</p>
          </div>
        )}

        <motion.div
          className="mt-5 text-center md:mt-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/blogs" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0037AD] bg-white px-8 font-bold text-[#0037AD] transition-colors hover:bg-[#0037AD] hover:text-white">
            See More Guides <FaArrowRight className="text-sm" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
