"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from "react-icons/fi";
import ApiErrorMessage from "@/components/api/ApiErrorMessage";
import ProductCard from "@/components/ProductCard";
import { usePublicCategories } from "@/features/categories/categoryQueries";
import { usePublicProducts } from "@/features/products/productQueries";
import { usePublicSubCategories } from "@/features/subCategories/subCategoryQueries";
import { Category } from "@/lib/models/category";
import type { ProductType } from "@/lib/models/product";
import { SubCategory } from "@/lib/models/subCategory";

const productPageSize = 9;
const wetSuitTypeOptions: ProductType[] = ["Shorty", "Full"];

function toNumberParam(value: string | null) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

function getSubCategoriesForCategory(subCategories: SubCategory[], categoryId: number | null) {
  if (!categoryId) return [];
  return subCategories.filter((subCategory) => subCategory.categoryId === categoryId);
}

function isWetSuitsCategoryName(name: string) {
  const normalizedName = name.replace(/[\s-]+/g, "").toLowerCase();
  return normalizedName === "wetsuit" || normalizedName === "wetsuits";
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item} className="h-5 animate-pulse rounded bg-[#F2F6FF]" />
      ))}
    </div>
  );
}

type WetSuitTypeFilterProps = {
  selectedType: ProductType | null;
  onTypeChange: (type: ProductType | null) => void;
  titleClassName: string;
  labelClassName: string;
};

function WetSuitTypeFilter({ selectedType, onTypeChange, titleClassName, labelClassName }: WetSuitTypeFilterProps) {
  return (
    <>
      <h3 className={titleClassName}>Wet Suit Type</h3>
      <div className="space-y-3">
        {wetSuitTypeOptions.map((type) => {
          const isActive = selectedType === type;

          return (
            <label key={type} className={labelClassName}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onTypeChange(isActive ? null : type)}
                className="h-4 w-4 rounded border-[#C8D3E4] accent-[#0037AD]"
              />
              <span>{type}</span>
            </label>
          );
        })}
      </div>
    </>
  );
}

function ProductsPageFallback() {
  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <div className="h-64 animate-pulse rounded-[28px] bg-[#EAF1FF]" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-80 animate-pulse rounded-[24px] bg-[#F2F6FF]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const queryCategoryId = toNumberParam(searchParams.get("categoryId"));
  const querySubCategoryId = toNumberParam(searchParams.get("subCategoryId"));
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(queryCategoryId);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(querySubCategoryId);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categoriesQuery = usePublicCategories({ pageNumber: 1, pageSize: 100, search: "" });
  const subCategoriesQuery = usePublicSubCategories({ pageNumber: 1, pageSize: 200, search: "" });
  const categories = useMemo(() => categoriesQuery.data?.categories ?? [], [categoriesQuery.data?.categories]);
  const subCategories = useMemo(
    () => subCategoriesQuery.data?.subCategories ?? [],
    [subCategoriesQuery.data?.subCategories]
  );

  const selectedSubCategory = subCategories.find((subCategory) => subCategory.id === selectedSubCategoryId) ?? null;
  const effectiveCategoryId = selectedCategoryId ?? selectedSubCategory?.categoryId ?? null;
  const selectedCategory = categories.find((category) => category.id === effectiveCategoryId) ?? null;
  const isWetSuitsCategorySelected = Boolean(
    (selectedCategory && isWetSuitsCategoryName(selectedCategory.name)) ||
      (selectedSubCategory && isWetSuitsCategoryName(selectedSubCategory.name))
  );
  const canUseWetSuitTypeFilter = isWetSuitsCategorySelected;
  const effectiveProductType = canUseWetSuitTypeFilter ? selectedProductType : null;
  const activeSubCategories = getSubCategoriesForCategory(subCategories, effectiveCategoryId);
  const currentBaseFilterLabel = selectedSubCategory?.name || selectedCategory?.name || "All products";
  const currentFilterLabel = effectiveProductType ? `${currentBaseFilterLabel} / ${effectiveProductType}` : currentBaseFilterLabel;
  const productsQuery = usePublicProducts({
    pageNumber,
    pageSize: productPageSize,
    categoryId: selectedCategoryId,
    subCategoryId: selectedSubCategoryId,
    type: effectiveProductType,
    search,
  });
  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? products.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / productPageSize));
  const allCategoryCount = categories.reduce((sum, category) => sum + Number(category.productCount || 0), 0);
  const activeFilterCount = [effectiveCategoryId, selectedSubCategoryId, effectiveProductType, search].filter(Boolean).length;

  const handleCategoryClick = (category: Category) => {
    setSelectedCategoryId(category.id);
    setSelectedSubCategoryId(null);
    if (!isWetSuitsCategoryName(category.name)) {
      setSelectedProductType(null);
    }
    setPageNumber(1);
  };

  const handleAllCategoriesClick = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedProductType(null);
    setPageNumber(1);
  };

  const handleSubCategoryClick = (subCategory: SubCategory) => {
    setSelectedCategoryId(subCategory.categoryId);
    setSelectedSubCategoryId((current) => (current === subCategory.id ? null : subCategory.id));
    const parentCategory = categories.find((category) => category.id === subCategory.categoryId);
    if (!isWetSuitsCategoryName(subCategory.name) && parentCategory && !isWetSuitsCategoryName(parentCategory.name)) {
      setSelectedProductType(null);
    }
    setPageNumber(1);
  };

  const handleProductTypeChange = (type: ProductType | null) => {
    setSelectedProductType(type);
    setPageNumber(1);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPageNumber(1);
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setSelectedProductType(null);
    setSearchInput("");
    setSearch("");
    setPageNumber(1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white pb-24">
      <section className="relative flex min-h-[390px] w-full items-center overflow-hidden bg-[#E6F0FF] md:min-h-[380px] lg:min-h-[420px]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_82%_42%,rgba(0,55,173,0.18),transparent_34%),linear-gradient(90deg,#E6F0FF_0%,#E6F0FF_48%,rgba(230,240,255,0.68)_68%,rgba(230,240,255,0.24)_100%)]" />
        <div className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] px-4 py-12 md:px-8 md:py-16 xl:px-12">
          <motion.div
            className="max-w-[18rem] rounded-2xl bg-[#E6F0FF]/70 py-2 backdrop-blur-[1px] md:max-w-md md:bg-transparent md:backdrop-blur-0 lg:max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#00113A]">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span>&gt;</span>
              <span className="text-[#0037AD]">Products</span>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-[#00113A] md:text-6xl">
              Explore Products
            </h1>
            <p className="text-sm leading-7 text-[#00113A]/85 md:text-lg">
              Start with a category, open its subcategories, then choose the exact product family you want to explore.
            </p>
          </motion.div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 mx-auto w-full max-w-[1440px]">
          <div className="absolute right-[-84px] top-[118px] h-[255px] w-[265px] origin-top-right opacity-80 transition-all duration-300 md:right-[140px] md:top-[24px] md:h-[500px] md:w-[520px] md:scale-75 md:opacity-95 lg:scale-90 xl:scale-100">
            <Image src="/products/heroProductsFront.png" alt="Wetsuit Big" fill className="object-contain" priority />
          </div>
          <div className="absolute right-[6px] top-[160px] z-10 h-[210px] w-[160px] origin-top-right opacity-95 drop-shadow-2xl transition-all duration-300 md:right-[82px] md:top-[80px] md:h-[380px] md:w-[310px] md:scale-75 md:opacity-100 lg:scale-90 xl:scale-100">
            <Image src="/products/heroProductsBack.png" alt="Wetsuit Small" fill className="object-contain" priority />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-[1440px] px-4 md:mt-14 md:px-8 xl:px-12">
        {(categoriesQuery.isError || subCategoriesQuery.isError) && (
          <div className="mb-6 grid gap-3 md:grid-cols-2">
            {categoriesQuery.isError && <ApiErrorMessage error={categoriesQuery.error} title="Could not load categories" />}
            {subCategoriesQuery.isError && <ApiErrorMessage error={subCategoriesQuery.error} title="Could not load subcategories" />}
          </div>
        )}

        <div className="grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[290px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-white pr-6">
              <div className="mb-7">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-[#0037AD]">Categories</h2>
                  {activeFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs font-bold text-[#0037AD] underline-offset-4 hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {categoriesQuery.isLoading ? (
                  <ListSkeleton />
                ) : (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleAllCategoriesClick}
                      className={`flex w-full items-center justify-between gap-3 text-left text-sm font-bold transition-colors ${
                        !effectiveCategoryId ? "text-[#0037AD]" : "text-[#5E6675] hover:text-[#0037AD]"
                      }`}
                    >
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">All Products</span>
                      <span className={`${!effectiveCategoryId ? "bg-[#0037AD] text-white" : "bg-[#F1F4F9] text-[#7A8494]"} rounded px-2 py-0.5 text-[11px]`}>
                        {allCategoryCount || totalCount}
                      </span>
                    </button>

                    {categories.map((category) => {
                      const isActive = effectiveCategoryId === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryClick(category)}
                          className={`flex w-full items-center justify-between gap-3 text-left text-sm font-semibold transition-colors ${
                            isActive ? "text-[#0037AD]" : "text-[#5E6675] hover:text-[#0037AD]"
                          }`}
                        >
                          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{category.name}</span>
                          <span className={`${isActive ? "bg-[#0037AD] text-white" : "bg-[#F1F4F9] text-[#7A8494]"} rounded px-2 py-0.5 text-[11px]`}>
                            {category.productCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {(subCategoriesQuery.isLoading || activeSubCategories.length > 0) && (
                <div className="border-t border-[#D9E4F5] pt-7">
                  <h3 className="mb-4 text-xl font-extrabold text-[#0037AD]">Sub Categories</h3>

                  {subCategoriesQuery.isLoading ? (
                    <ListSkeleton />
                  ) : (
                    <div className="space-y-3">
                      {activeSubCategories.map((subCategory) => {
                        const isActive = selectedSubCategoryId === subCategory.id;

                        return (
                          <label key={subCategory.id} className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#5E6675] transition-colors hover:text-[#0037AD]">
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => handleSubCategoryClick(subCategory)}
                              className="h-4 w-4 rounded border-[#C8D3E4] accent-[#0037AD]"
                            />
                            <span className="min-w-0 break-words [overflow-wrap:anywhere]">{subCategory.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {canUseWetSuitTypeFilter && (
                <div className="border-t border-[#D9E4F5] pt-7">
                  <WetSuitTypeFilter
                    selectedType={selectedProductType}
                    onTypeChange={handleProductTypeChange}
                    titleClassName="mb-4 text-xl font-extrabold text-[#0037AD]"
                    labelClassName="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#5E6675] transition-colors hover:text-[#0037AD]"
                  />
                </div>
              )}
            </div>
          </aside>

          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen((current) => !current)}
              aria-expanded={isMobileFiltersOpen}
              className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#0037AD] bg-white px-5 text-sm font-bold text-[#0037AD] shadow-sm transition-colors hover:bg-[#EEF4FF] lg:hidden"
            >
              <FiFilter className="h-4 w-4" />
              {isMobileFiltersOpen ? "Hide categories" : "View categories"}
              {activeFilterCount > 0 && (
                <span className="rounded bg-[#0037AD] px-2 py-0.5 text-xs font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {isMobileFiltersOpen && (
              <motion.div
                className="mb-6 rounded-[18px] border border-[#D9E4F5] bg-white p-4 shadow-[0_16px_45px_rgba(0,17,58,0.08)] lg:hidden"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-extrabold text-[#0037AD]">Categories</h2>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-bold text-[#0037AD] underline-offset-4 hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {categoriesQuery.isLoading ? (
                    <ListSkeleton />
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={handleAllCategoriesClick}
                        className={`flex w-full items-center justify-between gap-3 text-left text-sm font-bold transition-colors ${
                          !effectiveCategoryId ? "text-[#0037AD]" : "text-[#5E6675]"
                        }`}
                      >
                        <span>All Products</span>
                        <span className={`${!effectiveCategoryId ? "bg-[#0037AD] text-white" : "bg-[#F1F4F9] text-[#7A8494]"} rounded px-2 py-0.5 text-[11px]`}>
                          {allCategoryCount || totalCount}
                        </span>
                      </button>

                      {categories.map((category) => {
                        const isActive = effectiveCategoryId === category.id;

                        return (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategoryClick(category)}
                            className={`flex w-full items-center justify-between gap-3 text-left text-sm font-semibold transition-colors ${
                              isActive ? "text-[#0037AD]" : "text-[#5E6675]"
                            }`}
                          >
                            <span className="min-w-0 break-words [overflow-wrap:anywhere]">{category.name}</span>
                            <span className={`${isActive ? "bg-[#0037AD] text-white" : "bg-[#F1F4F9] text-[#7A8494]"} rounded px-2 py-0.5 text-[11px]`}>
                              {category.productCount}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {(subCategoriesQuery.isLoading || activeSubCategories.length > 0) && (
                  <div className="border-t border-[#D9E4F5] pt-6">
                    <h3 className="mb-4 text-lg font-extrabold text-[#0037AD]">Sub Categories</h3>
                    {subCategoriesQuery.isLoading ? (
                      <ListSkeleton />
                    ) : (
                      <div className="space-y-3">
                        {activeSubCategories.map((subCategory) => {
                          const isActive = selectedSubCategoryId === subCategory.id;

                          return (
                            <label key={subCategory.id} className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#5E6675]">
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => handleSubCategoryClick(subCategory)}
                                className="h-4 w-4 rounded border-[#C8D3E4] accent-[#0037AD]"
                              />
                              <span className="min-w-0 break-words [overflow-wrap:anywhere]">{subCategory.name}</span>
                            </label>
                          );
                        })}
                      </div>
                  )}
                </div>
              )}

                {canUseWetSuitTypeFilter && (
                  <div className="border-t border-[#D9E4F5] pt-6">
                    <WetSuitTypeFilter
                      selectedType={selectedProductType}
                      onTypeChange={handleProductTypeChange}
                      titleClassName="mb-4 text-lg font-extrabold text-[#0037AD]"
                      labelClassName="flex cursor-pointer items-center gap-3 text-sm font-semibold text-[#5E6675]"
                    />
                  </div>
                )}
              </motion.div>
            )}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-[560px]">
                <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0037AD]" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="h-12 w-full rounded-full border border-transparent bg-[#F6F7FA] pl-11 pr-4 text-sm text-[#00113A] outline-none transition-colors placeholder:text-[#A3AAB7] focus:border-[#0037AD] focus:bg-white"
                  placeholder="Search Product..."
                />
              </form>

              <label className="flex items-center gap-3 text-sm font-semibold text-[#384152]">
                <span className="whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-12 min-w-40 rounded-lg border border-[#B9C4D6] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
                >
                  <option value="newest">Newest</option>
                </select>
              </label>
            </div>

            <div className="-mx-4 mb-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
              <button
                type="button"
                onClick={handleAllCategoriesClick}
                className={`h-10 min-w-24 rounded-full border px-6 text-sm font-bold transition-colors ${
                  !effectiveCategoryId
                    ? "border-[#0037AD] bg-[#0037AD] text-white"
                    : "border-[#0037AD] bg-white text-[#0037AD] hover:bg-[#EEF4FF]"
                }`}
              >
                All
              </button>
              {categories.map((category) => {
                const isActive = effectiveCategoryId === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryClick(category)}
                    className={`h-10 min-w-24 rounded-full border px-6 text-sm font-bold transition-colors ${
                      isActive
                        ? "border-[#0037AD] bg-[#0037AD] text-white"
                        : "border-[#0037AD] bg-white text-[#0037AD] hover:bg-[#EEF4FF]"
                    }`}
                  >
                    <span className="block truncate">{category.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="break-words text-xl font-extrabold text-[#00113A] [overflow-wrap:anywhere] md:text-2xl">{currentFilterLabel}</h2>
                <p className="mt-1 text-sm font-semibold text-[#5E6675]">{totalCount} products found</p>
              </div>
            </div>

            {productsQuery.isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="h-[430px] animate-pulse rounded-[24px] bg-[#F2F6FF]" />
                ))}
              </div>
            )}

            {productsQuery.isError && <ApiErrorMessage error={productsQuery.error} title="Could not load products" />}

            {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="mt-10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
                    disabled={pageNumber <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiChevronLeft />
                  </button>
                  <span className="rounded-lg bg-[#0037AD] px-4 py-2 text-sm font-bold text-white">
                    {pageNumber} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPageNumber((current) => Math.min(totalPages, current + 1))}
                    disabled={pageNumber >= totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              </>
            )}

            {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && (
              <div className="rounded-[24px] border border-[#E5ECF8] bg-[#F7FAFF] px-6 py-16 text-center">
                <h3 className="text-2xl font-extrabold text-[#00113A]">No products found</h3>
                <p className="mt-2 text-[#5E6675]">Try another category, sub category, or search term.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}
