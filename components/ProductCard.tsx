import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  title: string;
  subtitle: string;
  imageSrc: string;
}

export default function ProductCard({ id, title, subtitle, imageSrc }: ProductCardProps) {
  return (
    <div className="bg-white rounded-[24px] border border-gray-200 p-4 sm:p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 group">
      
      {/* Product Image */}
      <Link href={`/products/${id}`} className="relative w-full h-56 sm:h-64 mb-6 cursor-pointer block">
        <Image
          src={imageSrc}
          alt={title}
          fill
          draggable={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-[#00113A] font-bold text-base sm:text-lg mb-1 leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm mb-6 flex-1">
          {subtitle}
        </p>

        {/* Action Button */}
        <Link 
          href={`/products/${id}`}
          className="w-full py-2.5 rounded-full border border-[#0037AD] text-[#0037AD] font-bold text-center hover:bg-[#0037AD] hover:text-white transition-colors text-sm sm:text-base"
        >
          View details
        </Link>
      </div>

    </div>
  );
}
