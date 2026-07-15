'use client';

import Image from 'next/image';
import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiSearch } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import BlogCard from '@/components/blogs/BlogCard';
import { usePublicBlogCategories } from '@/features/blogCategories/blogCategoryQueries';
import { usePublicBlogs } from '@/features/blogs/blogQueries';

const blogPageSize = 100;
const initialVisibleCount = 9;

export default function BlogsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const blogsQuery = usePublicBlogs({ pageNumber: 1, pageSize: blogPageSize, search });
  const categoriesQuery = usePublicBlogCategories({ pageNumber: 1, pageSize: 100, search: '' });

  const blogs = useMemo(() => blogsQuery.data?.blogs ?? [], [blogsQuery.data?.blogs]);
  const categories = useMemo(
    () => categoriesQuery.data?.blogCategories ?? [],
    [categoriesQuery.data?.blogCategories]
  );

  const categoryNameById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = categorySearch.trim().toLowerCase();
    if (!normalizedSearch) return categories;

    return categories.filter((category) => category.name.toLowerCase().includes(normalizedSearch));
  }, [categories, categorySearch]);

  const filteredBlogs = useMemo(() => {
    const categoryFiltered = activeCategoryId
      ? blogs.filter((blog) => blog.categoryId === activeCategoryId)
      : blogs;

    return categoryFiltered.map((blog) => ({
      ...blog,
      categoryName: blog.categoryName || categoryNameById.get(blog.categoryId) || blog.categoryName,
    }));
  }, [activeCategoryId, blogs, categoryNameById]);

  const visibleBlogs = filteredBlogs.slice(0, visibleCount);
  const activeCategoryName = activeCategoryId
    ? categoryNameById.get(activeCategoryId) || 'Selected category'
    : 'All Articles';

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setVisibleCount(initialVisibleCount);
  };

  const selectCategory = (categoryId: number | null) => {
    setActiveCategoryId(categoryId);
    setVisibleCount(initialVisibleCount);
  };

  return (
    <div className="bg-white text-[#00113A]">
      <section className="relative flex min-h-[340px] w-full items-center overflow-hidden md:min-h-[430px]">
        <Image
          src="/categories/CategoriesDesktop.png"
          alt="Diving guides"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#00113A]/55" />
        <motion.div
          className="container relative z-10 mx-auto px-4 py-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.26em] text-white/75">Dive Pro Journal</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl">
            Diving Guides & Expert Tips
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
            Browse equipment advice, safety notes, and field-tested tips written for divers who want a better day underwater.
          </p>
        </motion.div>
      </section>

      <section className="bg-[#F8FAFE] py-10 md:py-16">
        <div className="container mx-auto max-w-7xl px-4">
          <motion.div
            className="grid gap-8 lg:grid-cols-[300px_1fr]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[24px] border border-[#D9E4F5] bg-white p-5 shadow-[0_18px_45px_rgba(0,17,58,0.07)] md:p-6">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0037AD]">Browse by topic</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#00113A]">Categories</h2>
                </div>

                <label className="relative mb-4 block">
                  <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0037AD]" />
                  <input
                    value={categorySearch}
                    onChange={(event) => setCategorySearch(event.target.value)}
                    className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] pl-11 pr-4 text-sm text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="Search categories"
                  />
                </label>

                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                  <button
                    type="button"
                    onClick={() => selectCategory(null)}
                    className={`flex h-11 flex-shrink-0 items-center justify-between gap-4 rounded-lg px-4 text-left text-sm font-bold transition-colors lg:w-full ${
                      activeCategoryId === null
                        ? 'bg-[#0037AD] text-white shadow-[0_10px_24px_rgba(0,55,173,0.22)]'
                        : 'bg-[#F7FAFF] text-[#405169] hover:bg-[#EAF1FF] hover:text-[#0037AD]'
                    }`}
                  >
                    <span>All Articles</span>
                    <span>{blogs.length}</span>
                  </button>

                  {categoriesQuery.isLoading && (
                    <>
                      <div className="h-11 flex-shrink-0 rounded-lg bg-[#F2F6FF] lg:w-full" />
                      <div className="h-11 flex-shrink-0 rounded-lg bg-[#F2F6FF] lg:w-full" />
                    </>
                  )}

                  {!categoriesQuery.isLoading &&
                    filteredCategories.map((category) => {
                      const count = blogs.filter((blog) => blog.categoryId === category.id).length;
                      const isActive = activeCategoryId === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => selectCategory(category.id)}
                          className={`flex h-11 flex-shrink-0 items-center justify-between gap-4 rounded-lg px-4 text-left text-sm font-bold transition-colors lg:w-full ${
                            isActive
                              ? 'bg-[#0037AD] text-white shadow-[0_10px_24px_rgba(0,55,173,0.22)]'
                              : 'bg-[#F7FAFF] text-[#405169] hover:bg-[#EAF1FF] hover:text-[#0037AD]'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                </div>

                {categoriesQuery.isError && (
                  <div className="mt-4">
                    <ApiErrorMessage error={categoriesQuery.error} title="Could not load blog categories" />
                  </div>
                )}
              </div>
            </aside>

            <div className="min-w-0">
              <form
                onSubmit={handleSearchSubmit}
                className="mb-7 flex flex-col gap-3 rounded-[24px] border border-[#D9E4F5] bg-white p-3 shadow-[0_18px_45px_rgba(0,17,58,0.06)] sm:flex-row"
              >
                <label className="relative block flex-1">
                  <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0037AD]" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="h-13 w-full rounded-lg border border-transparent bg-[#F7FAFF] py-4 pl-12 pr-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="Search articles by title or description"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-7 py-4 font-extrabold text-white transition-colors hover:bg-[#00267A]"
                >
                  Search
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0037AD]">{activeCategoryName}</p>
                  <h2 className="mt-1 text-2xl font-extrabold text-[#00113A] md:text-3xl">
                    {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
                  </h2>
                </div>
                {search && <p className="text-sm font-semibold text-[#5E6675]">Search: &quot;{search}&quot;</p>}
              </div>

              {blogsQuery.isLoading && (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="overflow-hidden rounded-[28px] border border-[#E5ECF8] bg-white">
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

              {blogsQuery.isError && <ApiErrorMessage error={blogsQuery.error} title="Could not load blogs" />}

              {!blogsQuery.isLoading && !blogsQuery.isError && visibleBlogs.length > 0 && (
                <>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {visibleBlogs.map((blog, index) => (
                      <BlogCard key={blog.id} blog={blog} index={index} />
                    ))}
                  </div>

                  {visibleCount < filteredBlogs.length && (
                    <div className="mt-10 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((current) => current + initialVisibleCount)}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0037AD] bg-white px-8 font-bold text-[#0037AD] transition-colors hover:bg-[#0037AD] hover:text-white"
                      >
                        See More
                        <FiArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}

              {!blogsQuery.isLoading && !blogsQuery.isError && visibleBlogs.length === 0 && (
                <div className="rounded-[28px] border border-[#D9E4F5] bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(0,17,58,0.06)]">
                  <h3 className="text-2xl font-extrabold text-[#00113A]">No articles found</h3>
                  <p className="mx-auto mt-3 max-w-md text-[#5E6675]">
                    Try a different search term or choose another blog category.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
