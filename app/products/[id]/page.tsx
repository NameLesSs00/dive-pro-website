"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { FiShare2, FiHeart } from "react-icons/fi";
import ProductGallery from "@/components/ProductGallery";
import SizeGuideModal from "@/components/SizeGuideModal";
import ProductTabs from "@/components/ProductTabs";
import ProductReviews from "@/components/ProductReviews";

const PRODUCT_IMAGES = [
  "/products/Dumm/1image.png",
  "/products/Dumm/2image.png",
  "/products/Dumm/3image.png"
];

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 pt-8">
        
        {/* Breadcrumbs */}
        <div className="text-sm text-[#00113A] font-semibold mb-8 flex items-center gap-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>&gt;</span>
          <Link href="/products" className="hover:underline">Wetsuits</Link>
          <span>&gt;</span>
          <span className="text-[#0037AD]">Coral Shorty Suit</span>
        </div>

        {/* Top Product Section */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-16">
          
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2">
            <ProductGallery images={PRODUCT_IMAGES} />
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-[#00113A]">
                Coral Shorty Suit 3mm Men
              </h1>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-[#0037AD] hover:bg-gray-50 transition-colors cursor-pointer"
                  title="Share"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-[#0037AD] text-lg">Available Sizes:</span>
              <button 
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[#0037AD] text-lg border-b border-[#0037AD] hover:text-blue-800 transition-colors cursor-pointer"
              >
                Size Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {AVAILABLE_SIZES.map((size) => (
                <div
                  key={size}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 text-sm font-medium"
                >
                  {size}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#00113A] mb-3">Product Overview</h3>
              <p className="text-gray-600 leading-relaxed">
                The Dive Pro Coral Shorty Suit is designed for divers and water sports enthusiasts seeking comfort, flexibility, and thermal protection in warm-water environments. Crafted from premium neoprene, it offers an anatomical fit, enhanced mobility, and long-lasting durability for an enjoyable underwater experience.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#00113A] mb-3">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Premium 3mm neoprene construction</li>
                <li>Lightweight and flexible design</li>
                <li>Anatomical pre-shaped fit</li>
                <li>Glued and double-stitched flat seams</li>
                <li>Titanium-coated cuffs, legs, and collar</li>
                <li>Adjustable sleeve fit with Velcro straps</li>
                <li>YKK back zipper for durability and comfort</li>
                <li>Reinforced zipper base to prevent tearing</li>
                <li>Designed for warm-water diving and water sports</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs />

        {/* Reviews Section */}
        <ProductReviews />

      </div>

      {/* Modals */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />

    </div>
  );
}
