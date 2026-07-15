"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from "react-icons/fi";
import ApiErrorMessage from "@/components/api/ApiErrorMessage";
import ProductCard from "@/components/ProductCard";
import { usePublicCategories } from "@/features/categories/categoryQueries";
import { usePublicMaterials } from "@/features/materials/materialQueries";
import { usePublicProducts } from "@/features/products/productQueries";
import { usePublicSizes } from "@/features/sizes/sizeQueries";
import { usePublicSubCategories } from "@/features/subCategories/subCategoryQueries";
import { getApiAssetUrl } from "@/lib/config/api";
import { Category } from "@/lib/models/category";
import { ProductType } from "@/lib/models/product";
import { SubCategory } from "@/lib/models/subCategory";

const fallbackCategoryImage = "/products/Dumm/iamge1.png";
const productPageSize = 9;

function toNumberParam(value: string | null) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

function getSubCategoriesForCategory(subCategories: SubCategory[], categoryId: number | null) {
  if (!categoryId) return [];
  return subCategories.filter((subCategory) => subCategory.categoryId === categoryId);
}

function toOptionalText(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function CategoryButton({
  category,
  isActive,
  onClick,
}: {
  category: Category;
  isActive: boolean;
  onClick: () => void;
}) {
  const imageSrc = getApiAssetUrl(category.imageUrl) || fallbackCategoryImage;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[76px] w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-all ${
        isActive
          ? "bg-[#EEF4FF] shadow-[0_12px_30px_rgba(0,55,173,0.10)]"
          : "bg-white hover:bg-[#F7FAFF]"
      }`}
    >
      <span className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-[#F3F7FF]">
        <Image
          src={imageSrc}
          alt={category.name}
          fill
          sizes="64px"
          className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
        />
      </span>
      <span className="min-w-0 flex-1 break-words text-lg font-semibold text-[#454444] [overflow-wrap:anywhere]">
        {category.name}
      </span>
      <FiArrowRight className={`h-6 w-6 flex-shrink-0 ${isActive ? "text-[#0037AD]" : "text-[#0046C8]"}`} />
    </button>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="h-16 animate-pulse rounded-xl bg-[#F2F6FF]" />
      ))}
    </div>
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
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(queryCategoryId);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(queryCategoryId);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(querySubCategoryId);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<ProductType | "">("");
  const [selectedSizeId, setSelectedSizeId] = useState<number | null>(null);
  const [colorFilter, setColorFilter] = useState("");
  const [sectionNameFilter, setSectionNameFilter] = useState("");
  const [sectionKeyFilter, setSectionKeyFilter] = useState("");
  const [sectionValueFilter, setSectionValueFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categoriesQuery = usePublicCategories({ pageNumber: 1, pageSize: 100, search: "" });
  const subCategoriesQuery = usePublicSubCategories({ pageNumber: 1, pageSize: 200, search: "" });
  const materialsQuery = usePublicMaterials({ pageNumber: 1, pageSize: 100, search: "" });
  const sizesQuery = usePublicSizes({ pageNumber: 1, pageSize: 100, search: "" });
  const productsQuery = usePublicProducts({
    pageNumber,
    pageSize: productPageSize,
    categoryId: selectedCategoryId,
    subCategoryId: selectedSubCategoryId,
    materialId: selectedMaterialId,
    type: selectedType || undefined,
    sizeId: selectedSizeId,
    color: toOptionalText(colorFilter),
    sectionName: toOptionalText(sectionNameFilter),
    key: toOptionalText(sectionKeyFilter),
    value: toOptionalText(sectionValueFilter),
    search,
  });

  const categories = useMemo(() => categoriesQuery.data?.categories ?? [], [categoriesQuery.data?.categories]);
  const subCategories = useMemo(
    () => subCategoriesQuery.data?.subCategories ?? [],
    [subCategoriesQuery.data?.subCategories]
  );
  const materials = useMemo(() => materialsQuery.data?.materials ?? [], [materialsQuery.data?.materials]);
  const sizes = useMemo(() => sizesQuery.data?.sizes ?? [], [sizesQuery.data?.sizes]);

  const activeCategory =
    categories.find((category) => category.id === (activeCategoryId ?? selectedCategoryId)) ?? categories[0] ?? null;
  const browserCategoryId = activeCategory?.id ?? null;
  const activeSubCategories = getSubCategoriesForCategory(subCategories, browserCategoryId);
  const selectedCategory = categories.find((category) => category.id === selectedCategoryId) ?? null;
  const selectedSubCategory = subCategories.find((subCategory) => subCategory.id === selectedSubCategoryId) ?? null;
  const selectedMaterial = materials.find((material) => material.id === selectedMaterialId) ?? null;
  const selectedSize = sizes.find((size) => size.id === selectedSizeId) ?? null;
  const currentFilterLabel = selectedSubCategory?.name || selectedCategory?.name || "All products";
  const products = productsQuery.data?.products ?? [];
  const pagination = productsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? products.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / productPageSize));
  const activeAdvancedFilterCount = [
    selectedMaterialId,
    selectedType,
    selectedSizeId,
    colorFilter.trim(),
    sectionNameFilter.trim(),
    sectionKeyFilter.trim(),
    sectionValueFilter.trim(),
  ].filter(Boolean).length;

  const handleCategoryClick = (category: Category) => {
    if (activeCategoryId === category.id) {
      setSelectedCategoryId(category.id);
      setSelectedSubCategoryId(null);
      setPageNumber(1);
      return;
    }

    setActiveCategoryId(category.id);
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setPageNumber(1);
  };

  const handleSubCategoryClick = (subCategory: SubCategory) => {
    setSelectedCategoryId(subCategory.categoryId);
    setSelectedSubCategoryId(subCategory.id);
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
    setSelectedMaterialId(null);
    setSelectedType("");
    setSelectedSizeId(null);
    setColorFilter("");
    setSectionNameFilter("");
    setSectionKeyFilter("");
    setSectionValueFilter("");
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
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0037AD]">Browse by category</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[#00113A] md:text-4xl">Choose your diving gear path</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5E6675] md:text-base">
            Click a category once to view subcategories. Click the same category again to select the whole category.
          </p>
        </motion.div>

        {(categoriesQuery.isError || subCategoriesQuery.isError) && (
          <div className="mb-6">
            {categoriesQuery.isError && <ApiErrorMessage error={categoriesQuery.error} title="Could not load categories" />}
            {subCategoriesQuery.isError && (
              <div className="mt-3">
                <ApiErrorMessage error={subCategoriesQuery.error} title="Could not load subcategories" />
              </div>
            )}
          </div>
        )}

        <motion.div
          className="overflow-hidden rounded-[22px] border border-[#D9E4F5] bg-white shadow-[0_20px_60px_rgba(0,17,58,0.08)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid lg:grid-cols-[1.1fr_1fr_1fr]">
            <div className="border-b border-[#D9E4F5] p-3 md:p-4 lg:border-b-0 lg:border-r">
              <div className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] text-[#7A8494]">
                Categories
              </div>
              {categoriesQuery.isLoading ? (
                <ListSkeleton />
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {categories.map((category) => (
                    <CategoryButton
                      key={category.id}
                      category={category}
                      isActive={browserCategoryId === category.id}
                      onClick={() => handleCategoryClick(category)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-b border-[#D9E4F5] p-3 md:p-4 lg:border-b-0 lg:border-r">
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7A8494]">Subcategories</p>
                {activeCategory && <span className="text-xs font-bold text-[#0037AD]">{activeCategory.name}</span>}
              </div>

              {subCategoriesQuery.isLoading ? (
                <ListSkeleton />
              ) : activeCategory ? (
                <div className="space-y-2">
                  {activeSubCategories.length > 0 ? (
                    activeSubCategories.map((subCategory) => {
                      const isActive = selectedSubCategoryId === subCategory.id;

                      return (
                        <button
                          key={subCategory.id}
                          type="button"
                          onClick={() => handleSubCategoryClick(subCategory)}
                          className={`flex min-h-14 w-full items-center justify-between gap-4 rounded-xl px-4 text-left text-lg font-semibold transition-colors ${
                            isActive
                              ? "bg-[#EEF4FF] text-[#0037AD]"
                              : "text-[#454444] hover:bg-[#F7FAFF] hover:text-[#0037AD]"
                          }`}
                        >
                          <span className="min-w-0 break-words [overflow-wrap:anywhere]">{subCategory.name}</span>
                          <FiChevronRight className="h-5 w-5 flex-shrink-0 text-[#0046C8]" />
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-xl bg-[#F7FAFF] px-5 py-8 text-center text-sm font-semibold text-[#5E6675]">
                      No subcategories are available for this category yet.
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl bg-[#F7FAFF] px-5 py-8 text-center text-sm font-semibold text-[#5E6675]">
                  Select a category to view its subcategories.
                </div>
              )}
            </div>

            <div className="p-3 md:p-4">
              <div className="mb-3 px-1 text-xs font-bold uppercase tracking-[0.18em] text-[#7A8494]">
                Current selection
              </div>
              <div className="rounded-2xl bg-[#F7FAFF] p-5">
                <p className="text-sm font-bold text-[#0037AD]">Selected filter</p>
                <h3 className="mt-2 break-words text-2xl font-extrabold text-[#00113A] [overflow-wrap:anywhere]">
                  {currentFilterLabel}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#5E6675]">
                  {selectedSubCategory
                    ? "Products are filtered by this subcategory."
                    : selectedCategory
                      ? "Products are filtered by this whole category."
                      : "Choose a category or subcategory to refine the product results."}
                </p>

                <div className="mt-5 space-y-2">
                  {selectedCategory && (
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#00113A]">
                      <span>Category</span>
                      <span className="min-w-0 break-words text-right text-[#0037AD] [overflow-wrap:anywhere]">
                        {selectedCategory.name}
                      </span>
                    </div>
                  )}
                  {selectedSubCategory && (
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#00113A]">
                      <span>Subcategory</span>
                      <span className="min-w-0 break-words text-right text-[#0037AD] [overflow-wrap:anywhere]">
                        {selectedSubCategory.name}
                      </span>
                    </div>
                  )}
                  {selectedMaterial && (
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#00113A]">
                      <span>Material</span>
                      <span className="min-w-0 break-words text-right text-[#0037AD] [overflow-wrap:anywhere]">
                        {selectedMaterial.name}
                      </span>
                    </div>
                  )}
                  {selectedSize && (
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#00113A]">
                      <span>Size</span>
                      <span className="min-w-0 break-words text-right text-[#0037AD] [overflow-wrap:anywhere]">
                        {selectedSize.name}
                      </span>
                    </div>
                  )}
                  {selectedType && (
                    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#00113A]">
                      <span>Type</span>
                      <span className="text-[#0037AD]">{selectedType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-12 w-full max-w-[1440px] px-4 md:px-8 xl:px-12">
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0037AD]">Products</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[#00113A] md:text-3xl">{currentFilterLabel}</h2>
            <p className="mt-2 text-sm font-semibold text-[#5E6675]">{totalCount} products found</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex w-full max-w-md gap-2">
            <label className="relative block flex-1">
              <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0037AD]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-12 w-full rounded-full border border-[#D9E4F5] bg-[#F7FAFF] pl-11 pr-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="Search products"
              />
            </label>
            <button
              type="submit"
              className="h-12 rounded-full bg-[#0037AD] px-6 text-sm font-bold text-white transition-colors hover:bg-[#00267A]"
            >
              Search
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen((current) => !current)}
          aria-expanded={isMobileFiltersOpen}
          className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-[#0037AD] bg-white px-5 text-sm font-bold text-[#0037AD] shadow-sm transition-colors hover:bg-[#EEF4FF] md:hidden"
        >
          <FiFilter className="h-4 w-4" />
          {isMobileFiltersOpen ? "Hide filters" : "Filters"}
          {activeAdvancedFilterCount > 0 && (
            <span className="rounded-full bg-[#0037AD] px-2 py-0.5 text-xs font-bold text-white">
              {activeAdvancedFilterCount}
            </span>
          )}
        </button>

        <motion.div
          className={`${isMobileFiltersOpen ? "block" : "hidden"} mb-8 rounded-[24px] border border-[#D9E4F5] bg-[#F7FAFF] p-4 md:block md:p-5`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0037AD]">Endpoint filters</p>
              <h3 className="mt-1 text-xl font-extrabold text-[#00113A]">Refine the product list</h3>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="h-10 w-fit rounded-full border border-[#0037AD] px-5 text-sm font-bold text-[#0037AD] transition-colors hover:bg-white"
            >
              Reset filters
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">Material</span>
              <select
                value={selectedMaterialId ?? ""}
                onChange={(event) => {
                  setSelectedMaterialId(toNumberParam(event.target.value));
                  setPageNumber(1);
                }}
                className="h-12 w-full rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
              >
                <option value="">All materials</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>
                    {material.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">Type</span>
              <select
                value={selectedType}
                onChange={(event) => {
                  setSelectedType(event.target.value as ProductType | "");
                  setPageNumber(1);
                }}
                className="h-12 w-full rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
              >
                <option value="">All types</option>
                <option value="Shorty">Shorty</option>
                <option value="Full">Full</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">Size</span>
              <select
                value={selectedSizeId ?? ""}
                onChange={(event) => {
                  setSelectedSizeId(toNumberParam(event.target.value));
                  setPageNumber(1);
                }}
                className="h-12 w-full rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
              >
                <option value="">All sizes</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#6B7280]">Color</span>
              <input
                value={colorFilter}
                onChange={(event) => {
                  setColorFilter(event.target.value);
                  setPageNumber(1);
                }}
                className="h-12 w-full rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
                placeholder="Color name"
              />
            </label>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <input
              value={sectionNameFilter}
              onChange={(event) => {
                setSectionNameFilter(event.target.value);
                setPageNumber(1);
              }}
              className="h-12 rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
              placeholder="Section name"
            />
            <input
              value={sectionKeyFilter}
              onChange={(event) => {
                setSectionKeyFilter(event.target.value);
                setPageNumber(1);
              }}
              className="h-12 rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
              placeholder="Section key"
            />
            <input
              value={sectionValueFilter}
              onChange={(event) => {
                setSectionValueFilter(event.target.value);
                setPageNumber(1);
              }}
              className="h-12 rounded-xl border border-[#D9E4F5] bg-white px-4 text-sm font-semibold text-[#00113A] outline-none focus:border-[#0037AD]"
              placeholder="Section value"
            />
          </div>

          {(materialsQuery.isError || sizesQuery.isError) && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {materialsQuery.isError && <ApiErrorMessage error={materialsQuery.error} title="Could not load materials" />}
              {sizesQuery.isError && <ApiErrorMessage error={sizesQuery.error} title="Could not load sizes" />}
            </div>
          )}
        </motion.div>

        {productsQuery.isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-[430px] animate-pulse rounded-[24px] bg-[#F2F6FF]" />
            ))}
          </div>
        )}

        {productsQuery.isError && <ApiErrorMessage error={productsQuery.error} title="Could not load products" />}

        {!productsQuery.isLoading && !productsQuery.isError && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="mt-2 text-[#5E6675]">Try another category, subcategory, or search term.</p>
          </div>
        )}
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
