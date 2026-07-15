'use client';

import Link from 'next/link';
import {
  FiArrowRight,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiLayers,
  FiList,
  FiMapPin,
  FiMaximize,
  FiMessageSquare,
  FiPackage,
  FiShield,
  FiStar,
  FiUsers,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useAdminUsers } from '@/features/admins/adminUsersQueries';
import { selectAccessToken, selectAdminEmail, selectAdminRoles } from '@/features/auth/authSelectors';
import { useBlogs } from '@/features/blogs/blogQueries';
import { useCategories } from '@/features/categories/categoryQueries';
import { useFaqs } from '@/features/faqs/faqQueries';
import { useLocators } from '@/features/locators/locatorQueries';
import { useMaterials } from '@/features/materials/materialQueries';
import { useProducts } from '@/features/products/productQueries';
import { useReviews } from '@/features/reviews/reviewQueries';
import { useSizes } from '@/features/sizes/sizeQueries';
import { useSubCategories } from '@/features/subCategories/subCategoryQueries';
import { Review } from '@/lib/models/review';
import { useAppSelector } from '@/store/hooks';

type PaginationLike = {
  totalCount?: number;
} | null | undefined;

type StatCardProps = {
  label: string;
  value: number;
  href: string;
  icon: IconType;
  isLoading?: boolean;
  isError?: boolean;
  helper: string;
};

function getTotalCount(pagination: PaginationLike, fallback: number) {
  return Number(pagination?.totalCount ?? fallback);
}

function RatingStars({ rate }: { rate: number }) {
  const normalizedRate = Math.max(0, Math.min(5, Math.round(rate || 0)));

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar key={star} className={`h-4 w-4 ${star <= normalizedRate ? 'fill-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function StatCard({ label, value, href, icon: Icon, isLoading, isError, helper }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-[#D9E4F5] bg-white p-4 shadow-[0_12px_34px_rgba(0,17,58,0.05)] transition-transform hover:-translate-y-0.5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD]">
          <Icon className="h-5 w-5" />
        </span>
        <FiArrowRight className="h-4 w-4 text-[#0037AD] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5E6675]">{label}</p>
      <p className="mt-2 text-3xl font-extrabold text-[#00113A]">{isLoading ? '...' : isError ? '-' : value}</p>
      <p className="mt-2 text-sm leading-5 text-[#5E6675]">{isError ? 'Could not load this count.' : helper}</p>
    </Link>
  );
}

function SectionHeader({ label, title, href }: { label: string; title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0037AD]">{label}</p>
        <h2 className="mt-1 text-xl font-bold text-[#00113A]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-bold text-[#0037AD]">
          Open
          <FiArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return <div className="rounded-lg bg-[#F7FAFF] px-4 py-8 text-center text-sm font-semibold text-[#5E6675]">{message}</div>;
}

export default function AdminDashboardPage() {
  const token = useAppSelector(selectAccessToken);
  const email = useAppSelector(selectAdminEmail);
  const roles = useAppSelector(selectAdminRoles);

  const productsQuery = useProducts(token, { pageNumber: 1, pageSize: 12, search: '' });
  const categoriesQuery = useCategories(token, { pageNumber: 1, pageSize: 12, search: '' });
  const subCategoriesQuery = useSubCategories(token, { pageNumber: 1, pageSize: 12, search: '' });
  const materialsQuery = useMaterials(token, { pageNumber: 1, pageSize: 5, search: '' });
  const sizesQuery = useSizes(token, { pageNumber: 1, pageSize: 5, search: '' });
  const blogsQuery = useBlogs(token, { pageNumber: 1, pageSize: 5, search: '' });
  const reviewsQuery = useReviews(token, { pageNumber: 1, pageSize: 5, search: '' });
  const locatorsQuery = useLocators(token, { pageNumber: 1, pageSize: 5, search: '' });
  const faqsQuery = useFaqs(token, { pageNumber: 1, pageSize: 5, search: '' });
  const adminsQuery = useAdminUsers(token);

  const products = productsQuery.data?.products ?? [];
  const categories = categoriesQuery.data?.categories ?? [];
  const subCategories = subCategoriesQuery.data?.subCategories ?? [];
  const materials = materialsQuery.data?.materials ?? [];
  const sizes = sizesQuery.data?.sizes ?? [];
  const blogs = blogsQuery.data?.blogs ?? [];
  const reviews = reviewsQuery.data?.reviews ?? [];
  const locators = locatorsQuery.data?.locators ?? [];
  const faqs = faqsQuery.data?.faqs ?? [];
  const admins = adminsQuery.data ?? [];

  const productCount = getTotalCount(productsQuery.data?.pagination, products.length);
  const categoryCount = getTotalCount(categoriesQuery.data?.pagination, categories.length);
  const subCategoryCount = getTotalCount(subCategoriesQuery.data?.pagination, subCategories.length);
  const materialCount = getTotalCount(materialsQuery.data?.pagination, materials.length);
  const sizeCount = getTotalCount(sizesQuery.data?.pagination, sizes.length);
  const blogCount = getTotalCount(blogsQuery.data?.pagination, blogs.length);
  const reviewCount = getTotalCount(reviewsQuery.data?.pagination, reviews.length);
  const locatorCount = getTotalCount(locatorsQuery.data?.pagination, locators.length);
  const faqCount = getTotalCount(faqsQuery.data?.pagination, faqs.length);
  const adminCount = admins.length;

  const stats: StatCardProps[] = [
    {
      label: 'Products',
      value: productCount,
      href: '/admin/products',
      icon: FiPackage,
      isLoading: productsQuery.isLoading,
      isError: productsQuery.isError,
      helper: 'Catalog items published from the products endpoint.',
    },
    {
      label: 'Categories',
      value: categoryCount,
      href: '/admin/categories',
      icon: FiLayers,
      isLoading: categoriesQuery.isLoading,
      isError: categoriesQuery.isError,
      helper: 'Top-level product browsing groups.',
    },
    {
      label: 'Subcategories',
      value: subCategoryCount,
      href: '/admin/subcategories',
      icon: FiList,
      isLoading: subCategoriesQuery.isLoading,
      isError: subCategoriesQuery.isError,
      helper: 'Nested product filters behind categories.',
    },
    {
      label: 'Reviews',
      value: reviewCount,
      href: '/admin/reviews',
      icon: FiMessageSquare,
      isLoading: reviewsQuery.isLoading,
      isError: reviewsQuery.isError,
      helper: 'Customer feedback ready for review.',
    },
    {
      label: 'Blogs',
      value: blogCount,
      href: '/admin/blogs',
      icon: FiFileText,
      isLoading: blogsQuery.isLoading,
      isError: blogsQuery.isError,
      helper: 'Guides and public content pages.',
    },
    {
      label: 'Locators',
      value: locatorCount,
      href: '/admin/locators',
      icon: FiMapPin,
      isLoading: locatorsQuery.isLoading,
      isError: locatorsQuery.isError,
      helper: 'Store locations shown to customers.',
    },
    {
      label: 'FAQs',
      value: faqCount,
      href: '/admin/faqs',
      icon: FiHelpCircle,
      isLoading: faqsQuery.isLoading,
      isError: faqsQuery.isError,
      helper: 'Questions used on the site and FAQ page.',
    },
    {
      label: 'Admins',
      value: adminCount,
      href: '/admin/admins',
      icon: FiUsers,
      isLoading: adminsQuery.isLoading,
      isError: adminsQuery.isError,
      helper: 'Users with dashboard access.',
    },
  ];

  const hasDashboardError =
    productsQuery.isError ||
    categoriesQuery.isError ||
    reviewsQuery.isError ||
    blogsQuery.isError ||
    locatorsQuery.isError ||
    faqsQuery.isError;

  const quickActions = [
    { href: '/admin/products', label: 'New product', icon: FiPackage },
    { href: '/admin/categories', label: 'New category', icon: FiLayers },
    { href: '/admin/blogs', label: 'Write blog', icon: FiBookOpen },
    { href: '/admin/faqs', label: 'New FAQ', icon: FiHelpCircle },
    { href: '/admin/locators', label: 'New locator', icon: FiMapPin },
    { href: '/admin/reviews', label: 'Review feedback', icon: FiMessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-sm font-bold text-[#5E6675]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FF] px-3 py-1 text-[#0037AD]">
                <FiShield className="h-4 w-4" />
                Dive Pro Admin
              </span>
              <span className="inline-flex items-center gap-2">
                <FiClock className="h-4 w-4" />
                <span suppressHydrationWarning>
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </span>
            </div>
            <h1 className="text-3xl font-bold text-[#00113A] md:text-4xl">Welcome back</h1>
            <p className="mt-3 max-w-2xl break-words text-[#5E6675] [overflow-wrap:anywhere]">
              {email} · {roles.join(', ') || 'Admin'}
            </p>
            <p className="mt-2 max-w-2xl text-[#5E6675]">
              Live catalog, content, reviews, and store data in one clean control center.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
            {quickActions.slice(0, 4).map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-sm font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {hasDashboardError && (
        <ApiErrorMessage error={new Error('Some dashboard data could not be loaded. The available sections are still shown below.')} title="Dashboard partially loaded" />
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border border-[#D9E4F5] bg-white p-5 shadow-[0_12px_34px_rgba(0,17,58,0.05)]">
          <SectionHeader label="Recent" title="Latest products" href="/admin/products" />
          {products.length ? (
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <Link key={product.id} href="/admin/products" className="block rounded-lg border border-[#E5ECF8] px-4 py-3 hover:bg-[#FBFCFF]">
                  <p className="break-words font-bold text-[#00113A] [overflow-wrap:anywhere]">{product.name}</p>
                  <p className="mt-1 text-sm text-[#5E6675]">
                    {product.categoryName} · {product.sizes.length || 0} sizes · {product.colors.length || 0} colors
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyPanel message="No products loaded yet." />
          )}
        </section>

        <section className="rounded-lg border border-[#D9E4F5] bg-white p-5 shadow-[0_12px_34px_rgba(0,17,58,0.05)]">
          <SectionHeader label="Feedback" title="Latest reviews" href="/admin/reviews" />
          {reviews.length ? (
            <div className="space-y-3">
              {reviews.slice(0, 5).map((review: Review) => (
                <Link
                  key={review.id}
                  href="/admin/reviews"
                  className={`block rounded-lg border px-4 py-3 hover:bg-[#FBFCFF] ${
                    review.rate <= 2 ? 'border-amber-200 bg-amber-50/50' : 'border-[#E5ECF8]'
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="break-words font-bold text-[#00113A] [overflow-wrap:anywhere]">{review.name}</p>
                    <RatingStars rate={review.rate} />
                  </div>
                  <p className="line-clamp-2 break-words text-sm leading-5 text-[#5E6675] [overflow-wrap:anywhere]">{review.comment}</p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyPanel message="No customer reviews yet." />
          )}
        </section>

        <section className="rounded-lg border border-[#D9E4F5] bg-white p-5 shadow-[0_12px_34px_rgba(0,17,58,0.05)]">
          <SectionHeader label="Content" title="Latest updates" href="/admin/blogs" />
          <div className="space-y-3">
            {blogs.slice(0, 3).map((blog) => (
              <Link key={`blog-${blog.id}`} href="/admin/blogs" className="block rounded-lg border border-[#E5ECF8] px-4 py-3 hover:bg-[#FBFCFF]">
                <p className="break-words font-bold text-[#00113A] [overflow-wrap:anywhere]">{blog.title}</p>
                <p className="mt-1 text-sm text-[#5E6675]">{blog.categoryName || 'Uncategorized blog'}</p>
              </Link>
            ))}
            {locators.slice(0, 2).map((locator) => (
              <Link key={`locator-${locator.id}`} href="/admin/locators" className="block rounded-lg border border-[#E5ECF8] px-4 py-3 hover:bg-[#FBFCFF]">
                <p className="break-words font-bold text-[#00113A] [overflow-wrap:anywhere]">{locator.name}</p>
                <p className="mt-1 line-clamp-1 text-sm text-[#5E6675]">{locator.address}</p>
              </Link>
            ))}
            {blogs.length === 0 && locators.length === 0 && <EmptyPanel message="No blogs or locators loaded yet." />}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-[#D9E4F5] bg-white p-5 shadow-[0_12px_34px_rgba(0,17,58,0.05)]">
        <SectionHeader label="Workspace" title="Setup snapshot" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-[#F7FAFF] p-4">
            <FiMaximize className="mb-3 h-5 w-5 text-[#0037AD]" />
            <p className="text-2xl font-extrabold text-[#00113A]">{sizeCount}</p>
            <p className="mt-1 text-sm font-semibold text-[#5E6675]">Sizes configured</p>
          </div>
          <div className="rounded-lg bg-[#F7FAFF] p-4">
            <FiPackage className="mb-3 h-5 w-5 text-[#0037AD]" />
            <p className="text-2xl font-extrabold text-[#00113A]">{materialCount}</p>
            <p className="mt-1 text-sm font-semibold text-[#5E6675]">Materials configured</p>
          </div>
          <div className="rounded-lg bg-[#F7FAFF] p-4">
            <FiGrid className="mb-3 h-5 w-5 text-[#0037AD]" />
            <p className="text-2xl font-extrabold text-[#00113A]">{faqs.length}</p>
            <p className="mt-1 text-sm font-semibold text-[#5E6675]">FAQs loaded in sample</p>
          </div>
          <div className="rounded-lg bg-[#F7FAFF] p-4">
            <FiCheckCircle className="mb-3 h-5 w-5 text-[#0037AD]" />
            <p className="text-2xl font-extrabold text-[#00113A]">{adminCount}</p>
            <p className="mt-1 text-sm font-semibold text-[#5E6675]">Admin users</p>
          </div>
        </div>
      </section>
    </div>
  );
}
