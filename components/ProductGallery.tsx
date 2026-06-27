"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto hide-scrollbar md:w-24 flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative w-20 h-24 md:w-24 md:h-32 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
              activeIndex === idx ? "border-[#0037AD] shadow-md" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 bg-[#EEF3FF]/50 rounded-2xl flex items-center justify-center min-h-[400px] md:min-h-[500px]">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <Image
              src={images[activeIndex]}
              alt="Main Product Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Mobile Controls (optional) */}
        <button 
          onClick={prevImage}
          className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-[#0037AD] shadow-md z-10"
        >
          <FiChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextImage}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-[#0037AD] shadow-md z-10"
        >
          <FiChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
