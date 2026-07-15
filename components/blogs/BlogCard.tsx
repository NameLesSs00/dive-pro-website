'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { getApiAssetUrl } from '@/lib/config/api';
import { Blog } from '@/lib/models/blog';

const fallbackImage = '/categories/CategoriesDesktop.png';

function getExcerpt(value: string, maxLength = 150) {
  const normalized = value.trim();
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, maxLength).trim()}...`;
}

export default function BlogCard({ blog, index = 0 }: { blog: Blog; index?: number }) {
  const imageSrc = getApiAssetUrl(blog.imageUrl) || fallbackImage;
  const sectionCount = blog.sections?.length ?? 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ delay: index * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/blogs/${blog.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E5ECF8] bg-white shadow-[0_18px_45px_rgba(0,17,58,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,17,58,0.14)]"
      >
        <div className="relative h-64 overflow-hidden bg-[#EAF1FF]">
          <Image
            src={imageSrc}
            alt={blog.title}
            fill
            sizes="(max-width: 768px) 86vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#00113A]/65 to-transparent" />
          <span className="absolute left-4 top-4 max-w-[calc(100%-2rem)] break-words rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#0037AD] shadow-sm [overflow-wrap:anywhere]">
            {blog.categoryName || 'Guide'}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="line-clamp-2 break-words text-xl font-extrabold leading-tight text-[#00113A] transition-colors [overflow-wrap:anywhere] group-hover:text-[#0037AD]">
            {blog.title}
          </h3>
          <p className="mt-4 line-clamp-3 flex-1 break-words text-sm leading-6 text-[#5E6675] [overflow-wrap:anywhere]">
            {getExcerpt(blog.description)}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#7A8494]">
              {sectionCount ? `${sectionCount} sections` : 'Article'}
            </span>
            <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#EAF1FF] px-4 text-sm font-extrabold text-[#0037AD] transition-colors group-hover:bg-[#0037AD] group-hover:text-white">
              Read
              <FiArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
