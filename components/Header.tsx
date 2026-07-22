'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiChevronDown, FiChevronRight, FiHeart, FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { useWishlistIds } from '@/features/wishlist/wishlistStorage';
import { getCategories } from '@/lib/apis/categoriesApi';
import { getSubCategories } from '@/lib/apis/subCategoriesApi';
import { getApiAssetUrl } from '@/lib/config/api';
import { Category } from '@/lib/models/category';
import { SubCategory } from '@/lib/models/subCategory';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/about-us', label: 'About us' },
  { href: '/contact-us', label: 'contact us' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/faq', label: 'FAQ' },
  { href: '/store-locator', label: 'Store Locater' },
];

function isActiveNavLink(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getCategoryImage(category: Category) {
  return getApiAssetUrl(category.imageUrl) || '/products/Dumm/iamge1.png';
}

function getSortableOrder(order: number | string | null | undefined) {
  const numericOrder = Number(order);
  return Number.isFinite(numericOrder) ? numericOrder : Number.MAX_SAFE_INTEGER;
}

function sortByOrder<T extends { order?: number | string | null }>(items: T[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((first, second) => {
      const orderDifference = getSortableOrder(first.item.order) - getSortableOrder(second.item.order);
      return orderDifference || first.index - second.index;
    })
    .map(({ item }) => item);
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<number | null>(null);
  const [menuError, setMenuError] = useState('');
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const wishlist = useWishlistIds();
  const orderedCategories = useMemo(() => sortByOrder(categories), [categories]);
  const orderedSubCategories = useMemo(() => sortByOrder(subCategories), [subCategories]);

  const activeCategory = useMemo(() => {
    return orderedCategories.find((category) => category.id === activeCategoryId) ?? orderedCategories[0] ?? null;
  }, [activeCategoryId, orderedCategories]);

  const visibleSubCategories = useMemo(() => {
    if (!activeCategory) return [];
    return orderedSubCategories.filter((subCategory) => subCategory.categoryId === activeCategory.id);
  }, [activeCategory, orderedSubCategories]);

  const activeSubCategory = useMemo(() => {
    return visibleSubCategories.find((subCategory) => subCategory.id === activeSubCategoryId) ?? visibleSubCategories[0] ?? null;
  }, [activeSubCategoryId, visibleSubCategories]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const ensureProductMenuData = async () => {
    if (categories.length || isMenuLoading) return;

    setIsMenuLoading(true);
    setMenuError('');

    try {
      const [categoriesResponse, subCategoriesResponse] = await Promise.all([
        getCategories(null, { pageNumber: 1, pageSize: 100, search: '' }),
        getSubCategories(null, { pageNumber: 1, pageSize: 200, search: '' }),
      ]);

      const nextCategories = sortByOrder(categoriesResponse.data);

      setCategories(categoriesResponse.data);
      setSubCategories(subCategoriesResponse.data);
      setActiveCategoryId(nextCategories[0]?.id ?? null);
    } catch {
      setMenuError('Could not load product categories.');
    } finally {
      setIsMenuLoading(false);
    }
  };

  const openProductsMenu = () => {
    setIsProductsMenuOpen(true);
    void ensureProductMenuData();
  };

  const closeProductsMenu = () => {
    setIsProductsMenuOpen(false);
  };

  const toggleMobileProductsMenu = () => {
    const nextIsOpen = !isMobileProductsOpen;
    setIsMobileProductsOpen(nextIsOpen);
    if (nextIsOpen) {
      void ensureProductMenuData();
    }
  };

  const navigateToCategory = (category: Category) => {
    setIsProductsMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/products?categoryId=${category.id}`);
  };

  const navigateToSubCategory = (subCategory: SubCategory) => {
    setIsProductsMenuOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/products?categoryId=${subCategory.categoryId}&subCategoryId=${subCategory.id}`);
  };

  const handleCategoryClick = (category: Category) => {
    if (activeCategory?.id === category.id) {
      navigateToCategory(category);
      return;
    }

    setActiveCategoryId(category.id);
    setActiveSubCategoryId(null);
  };

  return (
    <header className="relative z-50 border-b border-gray-200 bg-white">
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

            if (link.href === '/products') {
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={openProductsMenu}
                  onMouseLeave={closeProductsMenu}
                >
                  <button
                    type="button"
                    onFocus={openProductsMenu}
                    onClick={openProductsMenu}
                    aria-expanded={isProductsMenuOpen}
                    className={`relative inline-flex items-center gap-1.5 whitespace-nowrap px-1 py-2 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:rounded-full after:bg-[#0037AD] after:transition-all ${
                      isActive || isProductsMenuOpen
                        ? 'font-bold text-[#0037AD] after:w-full'
                        : 'text-gray-700 after:w-0 hover:text-[#04328E] hover:after:w-full'
                    }`}
                  >
                    <span>{link.label}</span>
                    <FiChevronDown className={`h-3.5 w-3.5 transition-transform ${isProductsMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProductsMenuOpen && (
                    <div className="absolute left-0 top-full z-50 hidden pt-5 lg:block">
                      <div className="relative w-[min(675px,calc(100vw-2rem))] overflow-visible rounded-b-md border border-[#E3E7EF] bg-white shadow-[0_24px_70px_rgba(0,17,58,0.16)]">
                        <div className="absolute -top-2 left-7 h-4 w-4 rotate-45 border-l border-t border-[#E3E7EF] bg-white" aria-hidden="true" />
                        {isMenuLoading ? (
                          <div className="grid h-[360px] grid-cols-3 gap-px overflow-hidden rounded-b-md bg-[#E3E7EF]">
                            {[0, 1, 2].map((column) => (
                              <div key={column} className="bg-white p-4">
                                {[0, 1, 2, 3, 4].map((item) => (
                                  <div key={item} className="mb-4 h-10 animate-pulse rounded bg-[#F2F6FF]" />
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : menuError ? (
                          <div className="overflow-hidden rounded-b-md p-8 text-center text-sm font-bold text-red-600">
                            {menuError}
                          </div>
                        ) : (
                          <div className="grid min-h-[360px] grid-cols-[1.05fr_0.95fr_1fr] overflow-hidden rounded-b-md">
                            <div className="p-1">
                              {orderedCategories.map((category) => {
                                const isActiveCategory = activeCategory?.id === category.id;

                                return (
                                  <button
                                    key={category.id}
                                    type="button"
                                    onMouseEnter={() => {
                                      setActiveCategoryId(category.id);
                                      setActiveSubCategoryId(null);
                                    }}
                                    onFocus={() => {
                                      setActiveCategoryId(category.id);
                                      setActiveSubCategoryId(null);
                                    }}
                                    onClick={() => navigateToCategory(category)}
                                    className={`flex h-[61px] w-full items-center gap-3 rounded-md px-2 text-left transition-colors ${
                                      isActiveCategory ? 'bg-[#EEF3FF]' : 'hover:bg-[#F7FAFF]'
                                    }`}
                                  >
                                    <span className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-[#F3F7FF]">
                                      <Image
                                        src={getCategoryImage(category)}
                                        alt={category.name}
                                        fill
                                        sizes="56px"
                                        className="object-contain p-1"
                                      />
                                    </span>
                                    <span className="min-w-0 flex-1 break-words text-lg font-medium text-[#4A4A4A] [overflow-wrap:anywhere]">
                                      {category.name}
                                    </span>
                                    <FiChevronRight className="h-5 w-5 flex-shrink-0 text-[#0037AD]" />
                                  </button>
                                );
                              })}
                            </div>

                            <div className="border-l border-[#E3E7EF]">
                              {visibleSubCategories.length ? (
                                visibleSubCategories.map((subCategory) => {
                                  const isActiveSubCategory = activeSubCategory?.id === subCategory.id;

                                  return (
                                    <button
                                      key={subCategory.id}
                                      type="button"
                                      onMouseEnter={() => setActiveSubCategoryId(subCategory.id)}
                                      onFocus={() => setActiveSubCategoryId(subCategory.id)}
                                      onClick={() => navigateToSubCategory(subCategory)}
                                      className={`flex h-[52px] w-full items-center justify-between gap-3 px-5 text-left text-lg font-medium transition-colors ${
                                        isActiveSubCategory
                                          ? 'text-[#0037AD]'
                                          : 'text-[#4A4A4A] hover:bg-[#F7FAFF] hover:text-[#0037AD]'
                                      }`}
                                    >
                                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{subCategory.name}</span>
                                      <FiChevronRight className="h-5 w-5 flex-shrink-0 text-[#0037AD]" />
                                    </button>
                                  );
                                })
                              ) : (
                                <div className="px-5 py-8 text-sm font-semibold text-[#6B7280]">No subcategories yet.</div>
                              )}
                            </div>

                            <div className="border-l border-[#E3E7EF]">
                              {activeSubCategory ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => navigateToSubCategory(activeSubCategory)}
                                    className="flex h-[52px] w-full items-center px-5 text-left text-lg font-medium text-[#4A4A4A] transition-colors hover:bg-[#F7FAFF] hover:text-[#0037AD]"
                                  >
                                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">{activeSubCategory.name}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => activeCategory && navigateToCategory(activeCategory)}
                                    className="flex h-[52px] w-full items-center border-t border-[#E3E7EF] px-5 text-left text-lg font-medium text-[#4A4A4A] transition-colors hover:bg-[#F7FAFF] hover:text-[#0037AD]"
                                  >
                                    All {activeCategory?.name}
                                  </button>
                                </>
                              ) : (
                                <div className="px-5 py-8 text-sm font-semibold text-[#6B7280]">
                                  Select a subcategory to continue.
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

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
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-[#0037AD] transition-colors hover:bg-[#EEF3FF]"
              aria-label="Wishlist"
            >
              <FiHeart className="w-5 h-5" />
              {wishlist.ids.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0037AD] px-1 text-[11px] font-bold text-white">
                  {wishlist.ids.length}
                </span>
              )}
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

            if (link.href === '/products') {
              return (
                <div key={link.href} className="rounded bg-[#F8FAFE]">
                  <button
                    type="button"
                    onClick={toggleMobileProductsMenu}
                    className={`flex w-full items-center justify-between rounded px-3 py-2 font-semibold transition-colors ${
                      isActive ? 'bg-[#EEF3FF] text-[#0037AD]' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Products
                    <FiChevronDown className={`h-4 w-4 transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMobileProductsOpen && (
                    <div className="space-y-2 border-t border-[#E3E7EF] p-3">
                      {isMenuLoading && <div className="h-12 animate-pulse rounded bg-[#EAF1FF]" />}
                      {menuError && <p className="text-sm font-bold text-red-600">{menuError}</p>}
                      {!isMenuLoading &&
                        !menuError &&
                        orderedCategories.map((category) => (
                          <div key={category.id} className="rounded-lg bg-white">
                            <button
                              type="button"
                              onClick={() => handleCategoryClick(category)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"
                            >
                              <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-[#F3F7FF]">
                                <Image
                                  src={getCategoryImage(category)}
                                  alt={category.name}
                                  fill
                                  sizes="48px"
                                  className="object-contain p-1"
                                />
                              </span>
                              <span className="min-w-0 flex-1 break-words font-semibold text-[#454444] [overflow-wrap:anywhere]">
                                {category.name}
                              </span>
                              <FiChevronRight className="h-5 w-5 flex-shrink-0 text-[#0037AD]" />
                            </button>
                            {activeCategory?.id === category.id && (
                              <div className="space-y-1 border-t border-[#E3E7EF] px-3 py-2">
                                {visibleSubCategories.map((subCategory) => (
                                  <button
                                    key={subCategory.id}
                                    type="button"
                                    onClick={() => navigateToSubCategory(subCategory)}
                                    className="block w-full rounded px-3 py-2 text-left text-sm font-semibold text-[#5A5A5A] hover:bg-[#EEF3FF] hover:text-[#0037AD]"
                                  >
                                    {subCategory.name}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              );
            }

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
            {wishlist.ids.length > 0 && (
              <span className="ml-auto rounded-full bg-[#0037AD] px-2 py-0.5 text-xs font-bold text-white">
                {wishlist.ids.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
