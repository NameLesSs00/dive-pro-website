'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiShare2, FiTrash2 } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useWishlistIds, buildWishlistShareUrl, parseWishlistIdsFromShare } from '@/features/wishlist/wishlistStorage';
import { getProductById } from '@/lib/apis/productsApi';
import { Product } from '@/lib/models/product';
import { getProductImage, getProductPath, getProductSubtitle } from '@/lib/utils/productDisplay';

type WishlistProductsResult = {
  products: Product[];
  missingIds: number[];
};

async function fetchWishlistProducts(ids: number[]): Promise<WishlistProductsResult> {
  const results = await Promise.allSettled(ids.map((id) => getProductById(id, null)));
  const products: Product[] = [];
  const missingIds: number[] = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      products.push(result.value.data);
      return;
    }

    missingIds.push(ids[index]);
  });

  return { products, missingIds };
}

export default function WishlistClient() {
  const { ids, remove, replace } = useWishlistIds();
  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    const sharedIds = parseWishlistIdsFromShare(window.location.search);
    if (sharedIds.length) replace(sharedIds);
  }, [replace]);

  const wishlistQuery = useQuery({
    queryKey: ['wishlist-products', ids],
    queryFn: () => fetchWishlistProducts(ids),
    enabled: ids.length > 0,
  });

  const products = wishlistQuery.data?.products ?? [];
  const missingIds = wishlistQuery.data?.missingIds ?? [];

  const handleShare = async () => {
    const shareUrl = buildWishlistShareUrl(ids);
    setShareMessage('');

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Dive Pro Wishlist',
          text: 'Here is my Dive Pro wishlist.',
          url: shareUrl,
        });
        setShareMessage('Wishlist share link is ready.');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareMessage('Wishlist link copied.');
    } catch {
      setShareMessage(shareUrl);
    }
  };

  return (
    <div className="bg-white text-[#20232A]">
      <section className="relative min-h-[300px] overflow-hidden bg-[#003D8E] md:min-h-[380px]">
        <Image
          src="/Home/diver.jpg"
          alt="Diver underwater"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#003D8E]/35" />

        <div className="container relative z-10 mx-auto flex min-h-[300px] items-center justify-between gap-8 px-4 py-12 md:min-h-[380px] md:py-16">
          <div className="max-w-xl text-white">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">My Wish-list</h1>
            <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-lg">
              Your saved gear for future adventures. It stays in this browser and can be shared with others.
            </p>
          </div>

          <div className="hidden h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-[0_20px_60px_rgba(0,17,58,0.25)] backdrop-blur-sm md:flex lg:h-48 lg:w-48">
            <FiHeart className="h-16 w-16" />
          </div>
        </div>

        <div
          className="absolute -bottom-24 left-1/2 h-44 w-[125vw] -translate-x-1/2 rounded-[50%_50%_0_0] bg-white md:-bottom-28 md:h-56"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 left-1/2 h-44 w-[112vw] -translate-x-1/2 rounded-[50%_50%_0_0] border-t border-white/80"
          aria-hidden="true"
        />
      </section>

      <section className="container mx-auto px-4 pb-24 pt-10 md:pt-12 lg:pb-32">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-[#20232A]">
              <span className="text-[#0037AD]">{ids.length}</span> Item{ids.length === 1 ? '' : 's'}
            </p>
            {missingIds.length > 0 && (
              <p className="mt-1 text-sm font-semibold text-amber-700">
                {missingIds.length} saved item{missingIds.length === 1 ? '' : 's'} could not be loaded.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            disabled={ids.length === 0}
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full border border-[#B8C1D0] px-5 text-sm font-bold text-[#0037AD] transition-colors hover:border-[#0037AD] hover:bg-[#EEF3FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiShare2 className="h-4 w-4" />
            Share Wishlist
          </button>
        </div>

        {shareMessage && (
          <div className="mb-8 break-words rounded-xl border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-sm font-bold text-[#0037AD] [overflow-wrap:anywhere]">
            {shareMessage}
          </div>
        )}

        {wishlistQuery.isLoading && (
          <div className="space-y-6">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-56 animate-pulse rounded-2xl bg-[#F2F6FF]" />
            ))}
          </div>
        )}

        {wishlistQuery.isError && <ApiErrorMessage error={wishlistQuery.error} title="Could not load wishlist products" />}

        {!wishlistQuery.isLoading && !wishlistQuery.isError && products.length > 0 && (
          <div className="space-y-8">
            {products.map((product) => (
              <article
                key={product.id}
                className="grid gap-6 rounded-2xl border border-[#B8C1D0] bg-white p-5 shadow-[0_10px_30px_rgba(0,17,58,0.04)] md:grid-cols-[190px_1fr_auto] md:items-center md:p-6 lg:grid-cols-[220px_1fr_180px]"
              >
                <Link
                  href={getProductPath(product)}
                  className="relative mx-auto h-40 w-full max-w-[210px] md:mx-0 md:h-48"
                >
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 80vw, 220px"
                    className="object-contain"
                  />
                </Link>

                <div className="text-center md:text-left">
                  <p className="mb-2 break-words text-base font-bold text-[#0037AD] [overflow-wrap:anywhere]">
                    {getProductSubtitle(product)}
                  </p>
                  <h2 className="break-words text-xl font-bold text-[#20232A] [overflow-wrap:anywhere] md:text-2xl">
                    {product.name}
                  </h2>
                  <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-[#5E6675] [overflow-wrap:anywhere]">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 md:justify-end lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3FF] text-[#0037AD]"
                      aria-label={`${product.name} is in wishlist`}
                      aria-pressed
                    >
                      <FiHeart className="h-5 w-5 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(product.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F6] text-[#20232A] transition-colors hover:bg-[#E6E9EF]"
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <Link
                    href={getProductPath(product)}
                    className="inline-flex h-12 min-w-40 items-center justify-center rounded-xl bg-[#0037AD] px-6 text-base font-bold text-white transition-colors hover:bg-[#00267A]"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {!wishlistQuery.isLoading && !wishlistQuery.isError && products.length === 0 && (
          <div className="rounded-2xl border border-[#D9E4F5] bg-[#F7FAFF] px-6 py-16 text-center">
            <FiHeart className="mx-auto h-14 w-14 text-[#0037AD]" />
            <h2 className="mt-5 text-2xl font-extrabold text-[#00113A]">Your wishlist is empty</h2>
            <p className="mx-auto mt-3 max-w-xl text-[#5E6675]">
              Save products from the catalog and they will stay here whenever you open this browser.
            </p>
            <Link
              href="/products"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0037AD] px-8 font-bold text-white transition-colors hover:bg-[#00267A]"
            >
              Browse products
            </Link>
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full border border-[#0037AD] px-8 text-base font-bold text-[#0037AD] transition-colors hover:bg-[#EEF3FF]"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
