'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';
import { useWishlistIds } from '@/features/wishlist/wishlistStorage';
import { Product } from '@/lib/models/product';
import { getProductImage, getProductSubtitle } from '@/lib/utils/productDisplay';

interface ProductCardProps {
  id?: string | number;
  title?: string;
  subtitle?: string;
  imageSrc?: string;
  product?: Product;
}

export default function ProductCard({ id, title, subtitle, imageSrc, product }: ProductCardProps) {
  const productId = product?.id ?? id;
  const productTitle = product?.name ?? title ?? 'Dive Pro Product';
  const productSubtitle = product ? getProductSubtitle(product) : subtitle ?? 'Dive Pro gear';
  const productImageSrc = product ? getProductImage(product) : imageSrc ?? '/products/Dumm/iamge1.png';
  const wishlist = useWishlistIds();
  const numericProductId = Number(productId);
  const canToggleWishlist = Number.isFinite(numericProductId) && numericProductId > 0;
  const isSaved = canToggleWishlist && wishlist.has(numericProductId);

  return (
    <div className="bg-white rounded-[24px] p-6 flex flex-col h-full hover:shadow-2xl transition-all duration-300 group relative">
      
      {/* Heart Icon */}
      <button
        type="button"
        disabled={!canToggleWishlist}
        onClick={() => wishlist.toggle(numericProductId)}
        className={`absolute top-6 right-6 z-10 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50 ${
          isSaved ? 'text-[#0037AD]' : 'text-[#0037AD]/75'
        }`}
        aria-label={isSaved ? `Remove ${productTitle} from wishlist` : `Save ${productTitle} to wishlist`}
        aria-pressed={isSaved}
      >
        <FiHeart size={24} className={isSaved ? 'fill-current' : ''} />
      </button>

      {/* Product Image */}
      <Link href={`/products/${productId}`} className="relative w-full h-60 sm:h-72 md:h-80 mb-4 sm:mb-6 cursor-pointer block">
        <Image
          src={productImageSrc}
          alt={productTitle}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-row items-end justify-between mt-auto w-full">
        <div className="min-w-0">
          <h3 className="break-words text-[#0037AD] font-bold text-lg sm:text-xl mb-1 leading-tight [overflow-wrap:anywhere]">
            {productTitle}
          </h3>
          <p className="break-words text-gray-400 text-sm [overflow-wrap:anywhere]">
            {productSubtitle}
          </p>
        </div>

        {/* Action Button */}
          <Link 
          href={`/products/${productId}`}
          className="py-2 px-3 sm:py-2.5 sm:px-5 rounded-full bg-[#0037AD] text-white font-bold hover:bg-[#00267A] transition-colors text-xs sm:text-sm flex items-center shadow-md whitespace-nowrap"
        >
          View Details <FaArrowRight className="ml-2 text-xs" />
        </Link>
      </div>

    </div>
  );
}
