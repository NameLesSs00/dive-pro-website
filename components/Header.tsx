'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiSearch, FiMenu, FiX, FiHeart } from 'react-icons/fi';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about-us', label: 'About us' },
  { href: '/contact-us', label: 'contact us' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/store-locator', label: 'Store Locater' },
];

function isActiveNavLink(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 relative z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-5">
        {/* Logo Area */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logos/logoHeaderBlue.png"
            alt="Dive Pro"
            width={90}
            height={38}
            className="object-contain"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-gray-700">
          {navLinks.map((link) => {
            const isActive = isActiveNavLink(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative whitespace-nowrap px-1 py-2 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-[#0037AD] after:transition-all ${
                  isActive
                    ? 'font-bold text-[#0037AD] after:w-full'
                    : 'text-gray-700 after:w-0 hover:text-[#04328E] hover:after:w-full'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Bar, Wishlist & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Desktop Search Bar */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-[#00113A]" />
            </div>
            <input
              type="text"
              placeholder="Search Product..."
              className="pl-10 pr-4 py-2 w-52 xl:w-64 bg-gray-50 border border-transparent rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black"
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/wishlist"
              className="w-10 h-10 rounded-full bg-gray-50 text-[#0037AD] flex items-center justify-center hover:bg-[#EEF3FF] transition-colors"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="lg:hidden p-2 text-gray-600 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg py-4 px-4 flex flex-col space-y-4">
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

          {navLinks.map((link) => {
            const isActive = isActiveNavLink(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`rounded px-3 py-2 font-semibold transition-colors ${
                  isActive ? 'bg-[#EEF3FF] text-[#0037AD]' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={toggleMenu}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/wishlist"
            className="text-[#0037AD] hover:bg-[#EEF3FF] px-2 py-2 rounded font-semibold flex items-center gap-2"
            onClick={toggleMenu}
          >
            <FiHeart className="w-5 h-5" />
            Wishlist
          </Link>
        </div>
      )}
    </header>
  );
}
