'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 relative z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo Area */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logoHeaderBlue.png"
            alt="Dive Pro"
            width={90}
            height={38}
            style={{ width: '90px', height: 'auto' }}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-700">
          <Link href="/" className="text-[#04328E] hover:text-[#032261] font-semibold">Home</Link>
          <Link href="/products" className="hover:text-[#04328E]">Products</Link>
          <Link href="/categories" className="hover:text-[#04328E]">Categories</Link>
          <Link href="/about-us" className="hover:text-[#04328E]">About us</Link>
          <Link href="/contact-us" className="hover:text-[#04328E]">contact us</Link>
          <Link href="/blogs" className="hover:text-[#04328E]">Blogs</Link>
          <Link href="/store-locator" className="hover:text-[#04328E]">Store Locater</Link>
        </nav>

        {/* Search Bar & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Desktop Search Bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Product..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black"
            />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden p-2 text-gray-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col space-y-4">
          {/* Mobile Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search Product..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black"
            />
          </div>
          
          <Link href="/" className="text-[#04328E] hover:bg-gray-50 px-2 py-2 rounded font-semibold" onClick={toggleMenu}>Home</Link>
          <Link href="/products" className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded" onClick={toggleMenu}>Products</Link>
          <Link href="/categories" className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded" onClick={toggleMenu}>Categories</Link>
          <Link href="/about-us" className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded" onClick={toggleMenu}>About us</Link>
          <Link href="/contact-us" className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded" onClick={toggleMenu}>contact us</Link>
          <Link href="/blogs" className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded" onClick={toggleMenu}>Blogs</Link>
          <Link href="/store-locator" className="text-gray-700 hover:bg-gray-50 px-2 py-2 rounded" onClick={toggleMenu}>Store Locater</Link>
        </div>
      )}
    </header>
  );
}
