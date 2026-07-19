'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { usePublicCategories } from '@/features/categories/categoryQueries';
import { getApiAssetUrl } from '@/lib/config/api';

const featureCards = [
  {
    icon: '/categories/iconPREMIUM.png',
    title: 'PREMIUM QUALITY',
    subtitle: 'Carefully selected high quality diving equipment.',
  },
  {
    icon: '/categories/iconTRUSTED.png',
    title: 'TRUSTED BRANDS',
    subtitle: 'Top diving brands you can rely on.',
  },
  {
    icon: '/categories/iconSUPPORT.png',
    title: 'EXPERT SUPPORT',
    subtitle: "We're here to help you every step of the way.",
  },
];

const fallbackCategoryImage = '/products/Dumm/iamge1.png';

export default function CategoriesPage() {
  const categoriesQuery = usePublicCategories({ pageNumber: 1, pageSize: 100, search: '' });
  const categories = categoriesQuery.data?.categories ?? [];

  return (
    <div className="bg-white">
      <section className="relative flex min-h-[300px] w-full items-center overflow-hidden md:min-h-[380px]">
        <Image
          src="/categories/CategoriesDesktop.png"
          alt="Categories Hero"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#00113A]/50" />
        <motion.div
          className="container relative z-10 mx-auto px-4 text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav className="mb-3 flex items-center text-sm font-medium text-white/90 md:mb-5">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Categories</span>
          </nav>
          <h1 className="mb-3 text-4xl font-extrabold leading-tight md:mb-4 md:text-6xl">Categories</h1>
          <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-lg">
            Discover professional diving gear categories designed for safety, comfort, and performance.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <motion.div
          className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0037AD]">Shop by need</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#00113A] md:text-4xl">All Equipment Categories</h2>
          </div>
          <p className="text-sm font-semibold text-[#5E6675]">{categories.length} categories</p>
        </motion.div>

        {categoriesQuery.isLoading && (
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <div className="h-72 animate-pulse bg-[#EAF1FF]" />
                <div className="space-y-3 p-8">
                  <div className="h-7 animate-pulse rounded bg-[#EAF1FF]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#F2F6FF]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {categoriesQuery.isError && (
          <div className="mb-16">
            <ApiErrorMessage error={categoriesQuery.error} title="Could not load categories" />
          </div>
        )}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length > 0 && (
          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category, index) => {
              const imageSrc = getApiAssetUrl(category.imageUrl) || fallbackCategoryImage;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/products?categoryId=${category.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#F7FAFF] lg:h-72">
                      <Image
                        src={imageSrc}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-gray-50 px-8 py-6">
                      <div className="min-w-0">
                        <p className="break-words text-xl font-bold text-[#0037AD] [overflow-wrap:anywhere] lg:text-2xl">
                          {category.name}
                        </p>
                        <p className="mt-1 text-base text-[#6B7280]">
                          {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0037AD] text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:scale-110">
                        <FiArrowRight className="h-5 w-5" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 && (
          <div className="mb-16 rounded-3xl border border-[#E5ECF8] bg-[#F7FAFF] px-6 py-14 text-center">
            <h2 className="text-2xl font-extrabold text-[#00113A]">No categories yet</h2>
            <p className="mt-2 text-[#5E6675]">Equipment categories will appear here once they are published.</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              className="flex items-center gap-5 rounded-[20px] px-8 py-8 shadow-sm"
              style={{ backgroundColor: '#B5CCFE80' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: '#0041C91A' }}
              >
                <Image src={card.icon} alt={card.title} width={24} height={24} className="h-auto w-6 object-contain" />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[#00113A] lg:text-base">
                  {card.title}
                </p>
                <p className="text-sm leading-relaxed text-[#444650] lg:text-base">{card.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
