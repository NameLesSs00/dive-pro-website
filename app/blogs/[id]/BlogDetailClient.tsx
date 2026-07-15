'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiClock, FiShare2 } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { usePublicBlogCategories } from '@/features/blogCategories/blogCategoryQueries';
import { usePublicBlog, usePublicBlogs } from '@/features/blogs/blogQueries';
import { getApiAssetUrl } from '@/lib/config/api';
import { Blog } from '@/lib/models/blog';

const fallbackImage = '/categories/CategoriesDesktop.png';
const blogHeroImage = '/Home/customerSection.png';

function getReadingTime(blog: Blog) {
  const sectionText = (blog.sections ?? []).map((section) => `${section.title} ${section.description}`).join(' ');
  const words = `${blog.title} ${blog.description} ${sectionText}`.trim().split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 180));
}

export default function BlogDetailClient({ blogId }: { blogId: number | null }) {
  const blogQuery = usePublicBlog(blogId);
  const relatedQuery = usePublicBlogs({ pageNumber: 1, pageSize: 100, search: '' });
  const categoriesQuery = usePublicBlogCategories({ pageNumber: 1, pageSize: 100, search: '' });
  const categoryNameById = new Map((categoriesQuery.data?.blogCategories ?? []).map((category) => [category.id, category.name]));
  const rawBlog = blogQuery.data ?? null;
  const blog = rawBlog
    ? {
        ...rawBlog,
        categoryName: rawBlog.categoryName || categoryNameById.get(rawBlog.categoryId) || rawBlog.categoryName,
      }
    : null;
  const imageSrc = blog ? getApiAssetUrl(blog.imageUrl) || fallbackImage : fallbackImage;
  const sections = [...(blog?.sections ?? [])].sort((first, second) => first.sectionNo - second.sectionNo);
  const relatedBlogs = (relatedQuery.data?.blogs ?? [])
    .filter((relatedBlog) => relatedBlog.id !== blog?.id && relatedBlog.categoryId === blog?.categoryId)
    .map((relatedBlog) => ({
      ...relatedBlog,
      categoryName: relatedBlog.categoryName || categoryNameById.get(relatedBlog.categoryId) || relatedBlog.categoryName,
    }))
    .slice(0, 3);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;

    const shareUrl = window.location.href;
    if (navigator.share && blog) {
      await navigator.share({ title: blog.title, url: shareUrl });
      return;
    }

    await navigator.clipboard?.writeText(shareUrl);
  };

  if (!blogId) {
    return (
      <div className="bg-[#F8FAFE] px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-[#00113A]">Article not found</h1>
        <Link href="/blogs" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#0037AD] px-7 font-bold text-white">
          Back to blogs
        </Link>
      </div>
    );
  }

  if (blogQuery.isLoading) {
    return (
      <div className="bg-[#F8FAFE] py-10 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="h-8 w-36 animate-pulse rounded bg-[#EAF1FF]" />
          <div className="mt-8 h-12 max-w-3xl animate-pulse rounded bg-[#EAF1FF]" />
          <div className="mt-5 h-5 max-w-2xl animate-pulse rounded bg-[#F2F6FF]" />
          <div className="mt-10 h-[420px] animate-pulse rounded-[28px] bg-[#EAF1FF]" />
        </div>
      </div>
    );
  }

  if (blogQuery.isError || !blog) {
    return (
      <div className="bg-[#F8FAFE] py-16">
        <div className="container mx-auto max-w-3xl px-4">
          <ApiErrorMessage error={blogQuery.error} title="Could not load this blog" />
          <Link href="/blogs" className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#0037AD] px-7 font-bold text-white">
            Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-[#00113A]">
      <section className="relative isolate overflow-hidden bg-[#00113A]">
        <Image
          src={blogHeroImage}
          alt="Dive Pro blog"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#00113A]/68" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

        <div className="container relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8 md:pb-24 md:pt-12">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-extrabold text-white/90 transition-colors hover:text-white">
            <FiArrowLeft className="h-4 w-4" />
            Back to blogs
          </Link>

          <motion.div
            className="mx-auto max-w-4xl pt-14 text-center md:pt-20"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mx-auto w-fit rounded-full bg-white/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
              {blog.categoryName || 'Dive Pro Journal'}
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl break-words text-3xl font-extrabold leading-tight text-white [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl break-words text-base leading-7 text-white/86 [overflow-wrap:anywhere] md:text-lg md:leading-8">
              {blog.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#0037AD] shadow-sm">
                <FiClock className="h-4 w-4" />
                {getReadingTime(blog)} min read
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition-colors hover:bg-white hover:text-[#0037AD]"
              >
                <FiShare2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-14">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="relative h-[240px] overflow-hidden rounded-[24px] bg-[#EAF1FF] shadow-[0_18px_55px_rgba(0,17,58,0.12)] sm:h-[360px] md:h-[500px] lg:h-[580px]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={imageSrc}
              alt={blog.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1152px"
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="bg-white pb-10 md:pb-16">
        <div className="container mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[minmax(0,760px)_280px] lg:items-start">
          <article className="min-w-0">
            <motion.div
              className="rounded-[24px] border border-[#E5ECF8] bg-white p-5 shadow-[0_14px_45px_rgba(0,17,58,0.06)] md:p-10"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {sections.length > 0 ? (
                <div className="space-y-10">
                  {sections.map((section, index) => (
                    <motion.section
                      key={section.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-[#E5ECF8] pt-9"
                    >
                      {section.title && (
                        <h2 className="break-words text-2xl font-extrabold leading-tight text-[#00113A] [overflow-wrap:anywhere] md:text-3xl">
                          {section.title}
                        </h2>
                      )}
                      {section.description && (
                        <p className="mt-4 whitespace-pre-line break-words text-base leading-8 text-[#5E6675] [overflow-wrap:anywhere] md:text-lg">
                          {section.description}
                        </p>
                      )}
                    </motion.section>
                  ))}
                </div>
              ) : (
                <p className="break-words text-lg leading-8 text-[#405169] [overflow-wrap:anywhere]">
                  Article sections will appear here once they are published.
                </p>
              )}
            </motion.div>
          </article>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[24px] border border-[#D9E4F5] bg-[#F8FAFE] p-5 shadow-[0_18px_45px_rgba(0,17,58,0.06)]">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0037AD]">Article Details</p>
              <div className="mt-5 space-y-4 text-sm">
                <div>
                  <p className="font-bold text-[#7A8494]">Topic</p>
                  <p className="mt-1 break-words font-extrabold text-[#00113A] [overflow-wrap:anywhere]">
                    {blog.categoryName || 'Dive Pro Journal'}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-[#7A8494]">Read time</p>
                  <p className="mt-1 font-extrabold text-[#00113A]">{getReadingTime(blog)} min read</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0037AD] font-bold text-white transition-colors hover:bg-[#00267A]"
              >
                <FiShare2 className="h-4 w-4" />
                Share article
              </button>
            </div>
          </aside>
        </div>
      </section>

      {relatedBlogs.length > 0 && (
        <section className="bg-[#F8FAFE] py-12 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0037AD]">Keep reading</p>
                <h2 className="mt-2 text-3xl font-extrabold text-[#00113A]">Related Articles</h2>
              </div>
              <Link href="/blogs" className="hidden items-center gap-2 text-sm font-extrabold text-[#0037AD] sm:inline-flex">
                View all
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => {
                const relatedImage = getApiAssetUrl(relatedBlog.imageUrl) || fallbackImage;

                return (
                  <Link
                    key={relatedBlog.id}
                    href={`/blogs/${relatedBlog.id}`}
                    className="group min-w-0 overflow-hidden rounded-[22px] border border-[#E5ECF8] bg-white shadow-[0_14px_36px_rgba(0,17,58,0.06)] transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-[#EAF1FF] sm:h-40">
                      <Image
                        src={relatedImage}
                        alt={relatedBlog.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 p-4">
                      <h3 className="line-clamp-2 min-w-0 break-words text-base font-extrabold leading-6 text-[#00113A] [overflow-wrap:anywhere] group-hover:text-[#0037AD]">
                        {relatedBlog.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 min-w-0 break-words text-sm leading-6 text-[#5E6675] [overflow-wrap:anywhere]">
                        {relatedBlog.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
