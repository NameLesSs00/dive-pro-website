"use client";

import { use, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShare2, FiStar } from "react-icons/fi";
import ApiErrorMessage from "@/components/api/ApiErrorMessage";
import ProductGallery from "@/components/ProductGallery";
import ProductReviews from "@/components/ProductReviews";
import ProductTabs from "@/components/ProductTabs";
import SizeGuideModal from "@/components/SizeGuideModal";
import { useProductColors } from "@/features/productColors/productColorQueries";
import { useProductAverageReview, usePublicProduct } from "@/features/products/productQueries";
import { getApiAssetUrl } from "@/lib/config/api";
import { ProductColor } from "@/lib/models/product";
import { getProductIdFromParam, getProductImage } from "@/lib/utils/productDisplay";

function mergeProductColors(primaryColors: ProductColor[] = [], secondaryColors: ProductColor[] = []) {
  const colorMap = new Map<string, ProductColor>();

  [...secondaryColors, ...primaryColors].forEach((color) => {
    const key = color.id ? `id-${color.id}` : `name-${color.colorName.toLowerCase()}`;
    const existingColor = colorMap.get(key);

    if (!existingColor) {
      colorMap.set(key, { ...color, images: color.images ?? [] });
      return;
    }

    colorMap.set(key, {
      ...existingColor,
      ...color,
      images: Array.from(new Set([...(existingColor.images ?? []), ...(color.images ?? [])])),
    });
  });

  return Array.from(colorMap.values());
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = getProductIdFromParam(resolvedParams.id);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const productQuery = usePublicProduct(productId);
  const reviewQuery = useProductAverageReview(productId);
  const colorsQuery = useProductColors(productId, null);
  const product = productQuery.data;
  const productColors = useMemo(() => {
    if (!product) return [];
    return mergeProductColors(colorsQuery.data ?? [], product.colors ?? []);
  }, [colorsQuery.data, product]);

  if (productQuery.isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <div className="h-8 w-56 animate-pulse rounded bg-[#EAF1FF]" />
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="h-[520px] animate-pulse rounded-3xl bg-[#F2F6FF]" />
            <div className="space-y-4">
              <div className="h-12 animate-pulse rounded bg-[#EAF1FF]" />
              <div className="h-28 animate-pulse rounded bg-[#F2F6FF]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (productQuery.isError || !product) {
    return (
      <div className="min-h-screen bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <ApiErrorMessage error={productQuery.error} title="Could not load product" />
          <Link href="/products" className="mt-6 inline-flex rounded-full bg-[#0037AD] px-6 py-3 font-bold text-white">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const selectedColor = productColors.find((color) => color.id === selectedColorId) ?? null;
  const visibleColor = selectedColor ?? productColors.find((color) => color.images.length) ?? productColors[0] ?? null;
  const visibleColorImages = selectedColor?.images?.length ? selectedColor.images : productColors.flatMap((color) => color.images ?? []);
  const galleryImages = visibleColorImages
    .filter(Boolean)
    .map((image) => getApiAssetUrl(image));
  const images = galleryImages.length ? galleryImages : [getProductImage(product)];
  const galleryKey = selectedColor ? `color-${selectedColor.id}` : `all-${productColors.map((color) => color.id).join('-')}`;
  const reviewSummary = reviewQuery.data;

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-8 md:px-8 xl:px-12">
        <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#00113A]">
          <Link href="/" className="hover:underline">Home</Link>
          <span>&gt;</span>
          <Link href="/products" className="hover:underline">Products</Link>
          <span>&gt;</span>
          <span className="break-words text-[#0037AD] [overflow-wrap:anywhere]">{product.name}</span>
        </div>

        <div className="mb-16 flex flex-col items-start gap-10 lg:flex-row lg:gap-14 xl:gap-16">
          <div className="w-full lg:sticky lg:top-24 lg:w-[52%]">
            <ProductGallery key={galleryKey} images={images} />
          </div>

          <div className="w-full lg:w-[48%]">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-[#0037AD]">
                  {product.categoryName} / {product.subCategoryName}
                </p>
                <h1 className="break-words text-3xl font-bold text-[#00113A] [overflow-wrap:anywhere] md:text-4xl">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 text-[#0037AD] transition-colors hover:bg-gray-50"
                title="Share"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-[#EAF1FF] px-4 py-2 text-sm font-bold text-[#0037AD]">{product.type}</span>
              <span className="rounded-full bg-[#F7FAFF] px-4 py-2 text-sm font-bold text-[#384152]">{product.materialName}</span>
              {product.isFeatured && (
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">Featured</span>
              )}
              {reviewSummary && (
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                  <FiStar className="fill-yellow-400 text-yellow-400" />
                  {reviewSummary.averageRate} ({reviewSummary.totalReviews})
                </span>
              )}
            </div>

            {productColors.length > 0 && (
              <div className="mb-8 rounded-2xl border border-[#E5ECF8] bg-white p-4 shadow-[0_12px_32px_rgba(0,17,58,0.04)]">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-[#00113A]">Available Colors</h3>
                    <p className="mt-1 text-sm font-semibold text-[#5E6675]">
                      {visibleColor ? `Viewing ${visibleColor.colorName}` : 'Viewing all color images'}
                    </p>
                  </div>
                  {colorsQuery.isLoading && <span className="text-xs font-bold text-[#0037AD]">Loading colors...</span>}
                </div>

                <div className="grid max-h-[348px] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => setSelectedColorId(null)}
                    className={`min-h-[104px] rounded-xl border p-2.5 text-left transition-all ${
                      selectedColorId === null
                        ? "border-[#0037AD] bg-[#EAF1FF] shadow-[0_12px_28px_rgba(0,55,173,0.10)]"
                        : "border-gray-200 bg-white hover:border-[#0037AD]"
                    }`}
                  >
                    <span className="mb-2 flex h-12 items-center justify-center rounded-lg bg-[#F7FAFF] text-sm font-bold text-[#0037AD]">
                      All
                    </span>
                    <span className="block text-sm font-bold text-[#00113A]">All colors</span>
                    <span className="mt-1 block text-xs font-semibold text-[#5E6675]">
                      {productColors.reduce((total, color) => total + (color.images?.length ?? 0), 0)} images
                    </span>
                  </button>

                  {productColors.map((color) => {
                    const isActive = selectedColorId === color.id;
                    const previewImage = getApiAssetUrl(color.images?.[0]);

                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => setSelectedColorId(color.id)}
                        className={`min-h-[104px] rounded-xl border p-2.5 text-left transition-all ${
                          isActive
                            ? "border-[#0037AD] bg-[#EAF1FF] shadow-[0_12px_28px_rgba(0,55,173,0.10)]"
                            : "border-gray-200 bg-white hover:border-[#0037AD]"
                        }`}
                      >
                        <span className="relative mb-2 block h-12 overflow-hidden rounded-lg bg-[#F7FAFF]">
                          {previewImage ? (
                            <Image
                              src={previewImage}
                              alt={color.colorName}
                              fill
                              sizes="120px"
                              className="object-contain p-1.5"
                            />
                          ) : (
                            <span className="flex h-full items-center justify-center text-xs font-bold text-[#5E6675]">
                              No image
                            </span>
                          )}
                        </span>
                        <span className="line-clamp-2 block break-words text-sm font-bold leading-snug text-[#00113A] [overflow-wrap:anywhere]">
                          {color.colorName}
                        </span>
                        <span className="mt-1 block text-xs font-semibold text-[#5E6675]">
                          {color.images?.length ?? 0} image{(color.images?.length ?? 0) === 1 ? "" : "s"}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {colorsQuery.isError && productColors.length === 0 && (
                  <div className="mt-3">
                    <ApiErrorMessage error={colorsQuery.error} title="Could not load product colors" />
                  </div>
                )}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg text-[#0037AD]">Available Sizes:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="border-b border-[#0037AD] text-lg text-[#0037AD] transition-colors hover:text-blue-800"
              >
                Size Guide
              </button>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
              {product.sizes.length ? (
                product.sizes.map((size) => (
                  <div
                    key={size.sizeId}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 text-sm font-medium text-gray-600 md:h-14 md:w-14"
                  >
                    {size.name}
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-[#5E6675]">No sizes published yet.</p>
              )}
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-xl font-bold text-[#00113A]">Product Overview</h3>
              <p className="break-words leading-relaxed text-gray-600 [overflow-wrap:anywhere]">{product.description}</p>
            </div>

            {product.highlights.length > 0 && (
              <div className="rounded-2xl border border-[#E5ECF8] bg-[#FBFCFF] p-4">
                <h3 className="mb-3 text-xl font-bold text-[#00113A]">Key Features</h3>
                <ul className="max-h-[260px] list-disc space-y-2 overflow-y-auto pl-5 pr-2 text-gray-600">
                  {product.highlights.map((highlight, index) => (
                    <li key={`${highlight}-${index}`} className="break-words [overflow-wrap:anywhere]">{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <ProductTabs sections={product.sections} />
        <ProductReviews productId={product.id} summary={reviewSummary} />
      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
