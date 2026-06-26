"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import ProductsFilter from "@/components/ProductsFilter";

const DUMMY_PRODUCTS = [
  { id: '1', title: 'Dive Pro Full Suit 5mm Men', subtitle: 'Deep Sea Edition', imageSrc: '/products/Dumm/iamge1.png' },
  { id: '2', title: 'Warm Flex Full Suit 7mm Men', subtitle: 'Cold Water Specialist', imageSrc: '/products/Dumm/iamge2.png' },
  { id: '3', title: 'Coral Shorty Suit 3mm Men', subtitle: 'Warm Water Protection', imageSrc: '/products/Dumm/iamge3.png' },
  { id: '4', title: 'Professional Wetsuit Vest 2mm', subtitle: 'Performance Layering', imageSrc: '/products/Dumm/iamge4.png' },
  { id: '5', title: 'Spearfishing Suit 3mm Camo', subtitle: 'Stealth Collection', imageSrc: '/products/Dumm/iamge1.png' },
  { id: '6', title: 'Dive Pro Full Suit 5mm Women', subtitle: 'Deep Sea Edition', imageSrc: '/products/Dumm/iamge2.png' },
];

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-white min-h-screen pb-24 relative overflow-hidden">
      
      {/* ── HERO SECTION ── */}
      <section 
        className="w-full relative overflow-hidden flex items-start justify-between pb-4 pt-4"
        style={{ backgroundColor: 'rgba(181, 204, 254, 0.5)', height: '578px' }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 relative z-10 flex w-full h-full">
          {/* Hero Text */}
          <div className="max-w-xl md:max-w-md lg:max-w-xl py-4">
            <div className="text-sm text-[#00113A] font-semibold mb-6 flex items-center gap-2">
              <Link href="/" className="hover:underline">Home</Link>
              <span>&gt;</span>
              <span className="hover:underline cursor-pointer">Category</span>
              <span>&gt;</span>
              <span className="text-[#0037AD]">Wetsuits</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#00113A] mb-6">
              Wetsuits
            </h1>
            <p className="text-[#00113A] text-base md:text-lg lg:text-xl leading-relaxed opacity-90">
              Professional wetsuits designed for warmth, flexibility, and comfort in every diving environment. From tropical reefs to icy depths, explore our premium range.
            </p>
          </div>
        </div>

        {/* Hero Images Overlay */}
        <div className="absolute inset-0 w-full max-w-[1440px] mx-auto hidden md:block z-10 pointer-events-none">
          {/* Big Suit (Left/Back) */}
          <div 
            className="absolute opacity-95 transition-all duration-300 transform md:scale-75 lg:scale-90 xl:scale-100 origin-top-right" 
            style={{ width: '662px', height: '637px', top: '72px', right: '119px' }}
          >
            <Image
              src="/products/heroProductsFront.png"
              alt="Wetsuit Big"
              fill
              className="object-contain"
              priority
            />
          </div>
          {/* Small Suit (Right/Front) */}
          <div 
            className="absolute z-10 drop-shadow-2xl transition-all duration-300 transform md:scale-75 lg:scale-90 xl:scale-100 origin-top-right" 
            style={{ width: '385px', height: '481px', top: '144px', right: '78px' }}
          >
            <Image
              src="/products/heroProductsBack.png"
              alt="Wetsuit Small"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT (Filter & Grid) ── */}
      <section className="w-full max-w-[1440px] mx-auto px-4 md:px-8 xl:px-12 mt-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0">
            <ProductsFilter />
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 overflow-hidden">
            
            {/* Top Bar (Mobile Filter Button & Sort) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2 bg-gray-100 text-[#0037AD] font-bold rounded-xl cursor-pointer"
              >
                <FiFilter /> Filter
              </button>
              
              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 ml-auto w-full sm:w-auto">
                <span className="text-gray-600 text-sm font-medium">Sort by:</span>
                <select className="border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-[#04328E] bg-white cursor-pointer min-w-[120px] text-black">
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <button className="px-5 py-2 rounded-full bg-[#0037AD] text-white text-sm font-medium whitespace-nowrap flex-shrink-0 cursor-pointer">All</button>
              <button className="px-5 py-2 rounded-full border border-[#0037AD] text-[#0037AD] text-sm font-medium whitespace-nowrap hover:bg-[#EEF3FF] transition-colors flex-shrink-0 cursor-pointer">Men</button>
              <button className="px-5 py-2 rounded-full border border-[#0037AD] text-[#0037AD] text-sm font-medium whitespace-nowrap hover:bg-[#EEF3FF] transition-colors flex-shrink-0 cursor-pointer">Women</button>
              <button className="px-5 py-2 rounded-full border border-[#0037AD] text-[#0037AD] text-sm font-medium whitespace-nowrap hover:bg-[#EEF3FF] transition-colors flex-shrink-0 cursor-pointer">children</button>
              <button className="px-5 py-2 rounded-full border border-[#0037AD] text-[#0037AD] text-sm font-medium whitespace-nowrap hover:bg-[#EEF3FF] transition-colors flex-shrink-0 cursor-pointer">Shortly</button>
              <button className="px-5 py-2 rounded-full border border-[#0037AD] text-[#0037AD] text-sm font-medium whitespace-nowrap hover:bg-[#EEF3FF] transition-colors flex-shrink-0 cursor-pointer">Vests</button>
              <button className="px-5 py-2 rounded-full border border-[#0037AD] text-[#0037AD] text-sm font-medium whitespace-nowrap hover:bg-[#EEF3FF] transition-colors flex-shrink-0 cursor-pointer">Accessories</button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DUMMY_PRODUCTS.map((product) => (
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  subtitle={product.subtitle}
                  imageSrc={product.imageSrc}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 mt-12">
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">
                <FiChevronLeft />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0037AD] text-white font-medium shadow-md shadow-blue-900/20 cursor-pointer">
                1
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">
                2
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">
                3
              </button>
              <span className="text-gray-400 mx-1">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium cursor-pointer">
                8
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">
                <FiChevronRight />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ── MOBILE FILTER DRAWER (Slide-in) ── */}
      {/* Overlay */}
      {isFilterOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isFilterOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-[#00113A]">Filters</h2>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <ProductsFilter />
        </div>
      </div>

    </div>
  );
}
