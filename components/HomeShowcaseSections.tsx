'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { FiAward, FiHeadphones, FiHeart, FiShield, FiTool } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import HomeBlogGuides from '@/components/blogs/HomeBlogGuides';
import { usePublicCategories } from '@/features/categories/categoryQueries';
import { usePublicProducts } from '@/features/products/productQueries';
import { useWishlistIds } from '@/features/wishlist/wishlistStorage';
import { getApiAssetUrl } from '@/lib/config/api';
import { getProductImage, getProductPath, getProductSubtitle } from '@/lib/utils/productDisplay';

const features = [
  { icon: <FiShield />, title: 'Safety First', desc: 'Engineered to the highest safety standards for peace of mind underwater.' },
  { icon: <FiAward />, title: 'Premium Quality', desc: 'Durable materials and precision craftsmanship for long-lasting performance.' },
  { icon: <FiTool />, title: 'Innovative Design', desc: 'Thoughtful features that enhance comfort, ease of use, and efficiency.' },
  { icon: <FiHeadphones />, title: 'Expert Support', desc: 'Our team is here to help you every step of the way.' },
];

const fallbackCategoryImage = '/products/Dumm/iamge1.png';

const sectionIntro = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      className="mb-8 text-center md:mb-14"
      variants={sectionIntro}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <p className={`mb-2 text-xs font-bold uppercase tracking-[0.22em] ${dark ? 'text-white/65' : 'text-[#0037AD]'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-2xl font-extrabold leading-tight md:text-4xl ${dark ? 'text-white' : 'text-[#00113A]'}`}>
        {title}
      </h2>
      <div className={`mx-auto mt-4 h-1 w-16 rounded-full ${dark ? 'bg-white/80' : 'bg-[#0037AD]'}`} />
    </motion.div>
  );
}

export default function HomeShowcaseSections() {
  const categoriesQuery = usePublicCategories({ pageNumber: 1, pageSize: 100, search: '' });
  const productsQuery = usePublicProducts({ pageNumber: 1, pageSize: 12, search: '' });
  const wishlist = useWishlistIds();
  const categories = categoriesQuery.data?.categories ?? [];
  const featuredCategories = categories.slice(0, 3);
  const liveProducts = productsQuery.data?.products ?? [];
  const products = (liveProducts.filter((product) => product.isFeatured).length
    ? liveProducts.filter((product) => product.isFeatured)
    : liveProducts
  ).slice(0, 3);

  return (
    <>
      <section className="relative z-20 -mt-px bg-[rgba(248,250,255,1)] py-12 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Shop by need" title="Equipment Categories" />

          {categoriesQuery.isLoading && (
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, index) => (
                <div key={index} className="min-w-[88%] overflow-hidden rounded-[28px] border border-white/70 bg-white md:min-w-0">
                  <div className="h-72 animate-pulse bg-[#EAF1FF] md:h-64" />
                  <div className="space-y-3 p-6">
                    <div className="h-7 animate-pulse rounded bg-[#EAF1FF]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[#F2F6FF]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {categoriesQuery.isError && (
            <div className="mx-auto max-w-2xl">
              <ApiErrorMessage error={categoriesQuery.error} title="Could not load categories" />
            </div>
          )}

          {!categoriesQuery.isLoading && !categoriesQuery.isError && featuredCategories.length > 0 && (
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 lg:grid-cols-3">
              {featuredCategories.map((category, index) => {
                const imageSrc = getApiAssetUrl(category.imageUrl) || fallbackCategoryImage;

                return (
                  <motion.div
                    key={category.id}
                    className="min-w-[88%] snap-center md:min-w-0"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={`/products?categoryId=${category.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(0,17,58,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,17,58,0.16)]"
                    >
                      <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#F8FAFF] md:h-64">
                        <Image
                          src={imageSrc}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 88vw, 33vw"
                          className="object-contain transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex items-end justify-between gap-4 p-5 md:p-6">
                        <div className="min-w-0">
                          <h3 className="break-words text-2xl font-extrabold leading-tight text-[#0037AD] [overflow-wrap:anywhere] md:text-xl lg:text-2xl">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-[#6B7280]">
                            {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                          </p>
                        </div>
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#0037AD] transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-[#0037AD] group-hover:text-white">
                          <FaArrowRight />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!categoriesQuery.isLoading && !categoriesQuery.isError && categories.length === 0 && (
            <div className="rounded-[28px] border border-white/70 bg-white px-6 py-12 text-center shadow-[0_18px_45px_rgba(0,17,58,0.08)]">
              <h3 className="text-xl font-extrabold text-[#00113A]">No categories yet</h3>
              <p className="mt-2 text-[#5E6675]">Equipment categories will appear here once they are published.</p>
            </div>
          )}

          <motion.div
            className="mt-5 text-center md:mt-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/categories" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0037AD] bg-white px-8 font-bold text-[#0037AD] transition-colors hover:bg-[#0037AD] hover:text-white">
              View All Categories <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden bg-[rgba(0,36,122,1)] py-12 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Popular picks" title="Best Selling Products" dark />

          {productsQuery.isLoading && (
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
              {[0, 1, 2].map((item) => (
                <div key={item} className="min-w-[86%] rounded-[30px] bg-white p-4 md:min-w-0">
                  <div className="h-72 animate-pulse rounded-[24px] bg-[#EAF1FF]" />
                  <div className="mt-5 h-8 animate-pulse rounded bg-[#F2F6FF]" />
                </div>
              ))}
            </div>
          )}

          {productsQuery.isError && (
            <div className="mx-auto max-w-2xl">
              <ApiErrorMessage error={productsQuery.error} title="Could not load products" />
            </div>
          )}

          {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 && (
            <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
              {products.map((product, index) => (
              <motion.article
                key={product.id}
                className="group min-w-[86%] snap-center overflow-hidden rounded-[30px] border border-white/12 bg-white shadow-[0_22px_65px_rgba(0,0,0,0.28)] md:min-w-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative flex h-72 items-center justify-center overflow-hidden bg-[#F8FAFF]">
                  <button
                    type="button"
                    onClick={() => wishlist.toggle(product.id)}
                    className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0037AD] shadow-md transition-transform group-hover:scale-110"
                    aria-label={wishlist.has(product.id) ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
                    aria-pressed={wishlist.has(product.id)}
                  >
                    <FiHeart className={`h-5 w-5 ${wishlist.has(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 86vw, 33vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 p-6 pt-5">
                  <div>
                    <p className="text-sm font-bold text-[#6B7280]">{getProductSubtitle(product)}</p>
                    <h3 className="mt-1 break-words text-2xl font-extrabold text-[#0037AD] [overflow-wrap:anywhere]">{product.name}</h3>
                  </div>
                  <Link href={getProductPath(product)} className="inline-flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-[#0037AD] px-4 text-xs font-bold text-white transition-colors hover:bg-[#00267A]">
                    Details <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </motion.article>
              ))}
            </div>
          )}

          {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && (
            <div className="rounded-[28px] border border-white/10 bg-white/8 px-6 py-12 text-center text-white">
              <h3 className="text-xl font-extrabold">No products yet</h3>
              <p className="mt-2 text-white/70">Featured products will appear here once they are published.</p>
            </div>
          )}

          {products.length > 0 && <div className="mt-3 flex justify-center gap-2 md:mt-10">
            {products.map((product, index) => (
              <span key={product.id} className={`h-2.5 rounded-full ${index === 0 ? 'w-8 bg-white' : 'w-2.5 bg-white/35'}`} />
            ))}
          </div>}
        </div>
      </section>

      <section className="bg-white py-12 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading title="Why Choose Our Diving Equipment" />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="rounded-3xl border border-[#E8EEF8] bg-white p-5 text-center shadow-[0_12px_35px_rgba(0,17,58,0.05)] md:p-7"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-3xl text-[#0037AD] md:h-20 md:w-20">
                  {feature.icon}
                </div>
                <h3 className="text-base font-extrabold text-[#00113A] md:text-lg">{feature.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#5E6675] md:text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <HomeBlogGuides />
    </>
  );
}
