import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { FiHeart } from 'react-icons/fi';

interface ProductCardProps {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
}

export default function ProductCard({ id, title, subtitle, imageSrc }: ProductCardProps) {
  return (
    <div className="bg-white rounded-[24px] p-6 flex flex-col h-full hover:shadow-2xl transition-all duration-300 group relative">
      
      {/* Heart Icon */}
      <button className="absolute top-6 right-6 z-10 text-[#0037AD] hover:scale-110 transition-transform">
        <FiHeart size={24} />
      </button>

      {/* Product Image */}
      <Link href={`/products/${id}`} className="relative w-full h-60 sm:h-72 md:h-80 mb-4 sm:mb-6 cursor-pointer block">
        <Image
          src={imageSrc}
          alt={title}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-row items-end justify-between mt-auto w-full">
        <div>
          <h3 className="text-[#0037AD] font-bold text-lg sm:text-xl mb-1 leading-tight">
            {title}
          </h3>
          <p className="text-gray-400 text-sm">
            {subtitle}
          </p>
        </div>

        {/* Action Button */}
          <Link 
          href={`/products/${id}`}
          className="py-2 px-3 sm:py-2.5 sm:px-5 rounded-full bg-[#0037AD] text-white font-bold hover:bg-[#00267A] transition-colors text-xs sm:text-sm flex items-center shadow-md whitespace-nowrap"
        >
          View Details <FaArrowRight className="ml-2 text-xs" />
        </Link>
      </div>

    </div>
  );
}
