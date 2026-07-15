"use client";

import { useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = images[activeIndex] ? activeIndex : 0;

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      {/* Thumbnails */}
      <div className="hide-scrollbar flex flex-shrink-0 gap-3 overflow-x-auto md:max-h-[min(620px,calc(100vh-150px))] md:w-24 md:flex-col md:overflow-y-auto">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all md:h-28 md:w-24 ${
              safeActiveIndex === idx ? "border-[#0037AD] shadow-md" : "border-gray-200 hover:border-gray-300"
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
      <div className="relative flex min-h-[320px] flex-1 items-center justify-center rounded-2xl bg-[#EEF3FF]/50 md:min-h-0 md:aspect-[4/5] md:max-h-[min(620px,calc(100vh-150px))]">
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
          <div className="relative h-full w-full">
            <Image
              src={images[safeActiveIndex]}
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
          className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#0037AD] shadow-md md:hidden"
        >
          <FiChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#0037AD] shadow-md md:hidden"
        >
          <FiChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
