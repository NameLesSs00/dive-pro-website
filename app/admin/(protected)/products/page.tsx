'use client';

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useMemo, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useCategories } from '@/features/categories/categoryQueries';
import { useMaterials } from '@/features/materials/materialQueries';
import {
  useCreateProductColor,
  useDeleteProductColor,
  useProductColors,
  useUpdateProductColor,
} from '@/features/productColors/productColorQueries';
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct } from '@/features/products/productQueries';
import { useSizes } from '@/features/sizes/sizeQueries';
import { useSubCategories } from '@/features/subCategories/subCategoryQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { CreateProductRequest, Product, ProductColor, ProductType } from '@/lib/models/product';
import { getApiAssetUrl } from '@/lib/config/api';
import { getProductImage } from '@/lib/utils/productDisplay';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

type ProductForm = {
  name: string;
  description: string;
  categoryId: string;
  subCategoryId: string;
  materialId: string;
  type: ProductType;
  isFeatured: boolean;
  sizes: string[];
  highlights: string[];
  sections: Array<{
    name: string;
    items: Array<{ key: string; value: string }>;
  }>;
  colors: ProductColorForm[];
};

type ProductColorForm = {
  localId: string;
  id?: number;
  productId?: number;
  colorName: string;
  existingImages: string[];
  newImages: ColorImagePreview[];
  isDeleted?: boolean;
};

type ColorImagePreview = {
  localId: string;
  file: File;
  previewUrl: string;
};

const initialForm: ProductForm = {
  name: '',
  description: '',
  categoryId: '',
  subCategoryId: '',
  materialId: '',
  type: 'Shorty',
  isFeatured: false,
  sizes: [],
  highlights: [''],
  sections: [{ name: '', items: [{ key: '', value: '' }] }],
  colors: [],
};

function createLocalId(prefix = 'color') {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}`;
}

function createEmptyColorForm(): ProductColorForm {
  return {
    localId: createLocalId(),
    colorName: '',
    existingImages: [],
    newImages: [],
  };
}

function createImagePreviews(files: File[]): ColorImagePreview[] {
  return files.map((file) => ({
    localId: createLocalId('image'),
    file,
    previewUrl: URL.createObjectURL(file),
  }));
}

function revokeImagePreviews(colors: ProductColorForm[]) {
  colors.forEach((color) => {
    color.newImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
  });
}

function toColorForms(colors: ProductColor[] = []): ProductColorForm[] {
  return colors.map((color) => ({
    localId: `color-${color.id}`,
    id: color.id,
    productId: color.productId,
    colorName: color.colorName,
    existingImages: color.images ?? [],
    newImages: [],
  }));
}

function uniqueTrimmedValues(values: string[]) {
  const seen = new Set<string>();

  return values
    .map((value) => value.trim())
    .filter((value) => {
      if (!value) return false;
      const key = value.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeSections(formSections: ProductForm['sections']) {
  const sections = new Map<string, { name: string; items: Array<{ key: string; value: string }> }>();

  formSections.forEach((section) => {
    const name = section.name.trim();
    const items = section.items
      .map((item) => ({ key: item.key.trim(), value: item.value.trim() }))
      .filter((item) => item.key || item.value);

    if (!name && !items.length) return;

    const sectionKey = name.toLowerCase();
    const currentSection = sections.get(sectionKey) ?? { name, items: [] };
    const existingItems = new Set(currentSection.items.map((item) => `${item.key.toLowerCase()}::${item.value.toLowerCase()}`));

    items.forEach((item) => {
      const itemKey = `${item.key.toLowerCase()}::${item.value.toLowerCase()}`;
      if (existingItems.has(itemKey)) return;
      existingItems.add(itemKey);
      currentSection.items.push(item);
    });

    sections.set(sectionKey, currentSection);
  });

  return Array.from(sections.values());
}

function areStringArraysEqual(first: string[], second: string[]) {
  if (first.length !== second.length) return false;
  return first.every((value, index) => value === second[index]);
}

function isExistingColorChanged(color: ProductColorForm, originalColor?: ProductColor) {
  if (!originalColor) return true;

  return (
    color.colorName.trim() !== originalColor.colorName ||
    !areStringArraysEqual(color.existingImages, originalColor.images ?? [])
  );
}

function toForm(product: Product): ProductForm {
  return {
    name: product.name,
    description: product.description,
    categoryId: String(product.categoryId),
    subCategoryId: String(product.subCategoryId),
    materialId: String(product.materialId),
    type: product.type,
    isFeatured: product.isFeatured,
    sizes: product.sizes.map((size) => String(size.sizeId)),
    highlights: uniqueTrimmedValues(product.highlights).length ? uniqueTrimmedValues(product.highlights) : [''],
    sections: product.sections.length
      ? normalizeSections(
          product.sections.map((section) => ({
          name: section.name,
          items: section.items.length
            ? section.items.map((item) => ({ key: item.key, value: item.value }))
            : [{ key: '', value: '' }],
        })),
        )
      : [{ name: '', items: [{ key: '', value: '' }] }],
    colors: toColorForms(product.colors),
  };
}

function buildPayload(form: ProductForm): CreateProductRequest {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    categoryId: Number(form.categoryId),
    subCategoryId: Number(form.subCategoryId),
    materialId: Number(form.materialId),
    type: form.type,
    isFeatured: form.isFeatured,
    sizes: form.sizes.map(Number).filter(Boolean),
    highlights: uniqueTrimmedValues(form.highlights),
    sections: normalizeSections(form.sections),
  };
}

export default function AdminProductsPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [colorError, setColorError] = useState<unknown>(null);
  const [areColorsTouched, setAreColorsTouched] = useState(false);
  const selectedProductId = selectedProduct?.id ?? null;

  const productsQuery = useProducts(token, { pageNumber, pageSize, search });
  const categoriesQuery = useCategories(token, { pageNumber: 1, pageSize: 100, search: '' });
  const subCategoriesQuery = useSubCategories(token, { pageNumber: 1, pageSize: 200, search: '' });
  const materialsQuery = useMaterials(token, { pageNumber: 1, pageSize: 100, search: '' });
  const sizesQuery = useSizes(token, { pageNumber: 1, pageSize: 100, search: '' });
  const createMutation = useCreateProduct(token);
  const updateMutation = useUpdateProduct(token);
  const deleteMutation = useDeleteProduct(token);
  const createColorMutation = useCreateProductColor(token);
  const updateColorMutation = useUpdateProductColor(token);
  const deleteColorMutation = useDeleteProductColor(token);
  const productColorsQuery = useProductColors(isModalOpen ? selectedProductId : null, token);

  const products = useMemo(() => productsQuery.data?.products ?? [], [productsQuery.data?.products]);
  const categories = useMemo(() => categoriesQuery.data?.categories ?? [], [categoriesQuery.data?.categories]);
  const subCategories = useMemo(
    () => subCategoriesQuery.data?.subCategories ?? [],
    [subCategoriesQuery.data?.subCategories],
  );
  const materials = useMemo(() => materialsQuery.data?.materials ?? [], [materialsQuery.data?.materials]);
  const sizes = useMemo(() => sizesQuery.data?.sizes ?? [], [sizesQuery.data?.sizes]);
  const pagination = productsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? products.length);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const isLoadingProductColors = Boolean(selectedProduct && productColorsQuery.isLoading);
  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending ||
    createColorMutation.isPending ||
    updateColorMutation.isPending ||
    deleteColorMutation.isPending;
  const modalError = selectedProduct ? updateMutation.error : createMutation.error;
  const showModalError = selectedProduct ? updateMutation.isError : createMutation.isError;

  const filteredSubCategories = useMemo(() => {
    const categoryId = Number(form.categoryId);
    return subCategories.filter((subCategory) => subCategory.categoryId === categoryId);
  }, [form.categoryId, subCategories]);
  const displayedColors = useMemo(() => {
    if (selectedProduct && !areColorsTouched && productColorsQuery.data) {
      return toColorForms(productColorsQuery.data);
    }

    return form.colors;
  }, [areColorsTouched, form.colors, productColorsQuery.data, selectedProduct]);

  const openCreateModal = () => {
    const firstCategoryId = categories[0]?.id ? String(categories[0].id) : '';
    const firstSubCategory = subCategories.find((subCategory) => subCategory.categoryId === Number(firstCategoryId));
    setSelectedProduct(null);
    setForm({
      ...initialForm,
      categoryId: firstCategoryId,
      subCategoryId: firstSubCategory?.id ? String(firstSubCategory.id) : '',
      materialId: materials[0]?.id ? String(materials[0].id) : '',
      colors: [createEmptyColorForm()],
    });
    createMutation.reset();
    updateMutation.reset();
    createColorMutation.reset();
    updateColorMutation.reset();
    deleteColorMutation.reset();
    setColorError(null);
    setAreColorsTouched(false);
    setStatusMessage('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setForm(toForm(product));
    createMutation.reset();
    updateMutation.reset();
    createColorMutation.reset();
    updateColorMutation.reset();
    deleteColorMutation.reset();
    setColorError(null);
    setAreColorsTouched(false);
    setStatusMessage('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    revokeImagePreviews(form.colors);
    setIsModalOpen(false);
    setSelectedProduct(null);
    setForm(initialForm);
    setColorError(null);
    setAreColorsTouched(false);
  };

  const updateForm = <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateHighlights = (updater: (highlights: string[]) => string[]) => {
    setForm((current) => ({ ...current, highlights: updater(current.highlights) }));
  };

  const updateSections = (updater: (sections: ProductForm['sections']) => ProductForm['sections']) => {
    setForm((current) => ({ ...current, sections: updater(current.sections) }));
  };

  const addSection = () => {
    updateSections((sections) => [...sections, { name: '', items: [{ key: '', value: '' }] }]);
  };

  const removeSection = (sectionIndex: number) => {
    updateSections((sections) => sections.filter((_, index) => index !== sectionIndex));
  };

  const updateSectionName = (sectionIndex: number, name: string) => {
    updateSections((sections) =>
      sections.map((section, index) => (index === sectionIndex ? { ...section, name } : section)),
    );
  };

  const addSectionItem = (sectionIndex: number) => {
    updateSections((sections) =>
      sections.map((section, index) =>
        index === sectionIndex ? { ...section, items: [...section.items, { key: '', value: '' }] } : section,
      ),
    );
  };

  const removeSectionItem = (sectionIndex: number, itemIndex: number) => {
    updateSections((sections) =>
      sections.map((section, index) =>
        index === sectionIndex
          ? { ...section, items: section.items.filter((_, rowIndex) => rowIndex !== itemIndex) }
          : section,
      ),
    );
  };

  const updateSectionItem = (
    sectionIndex: number,
    itemIndex: number,
    field: 'key' | 'value',
    value: string,
  ) => {
    updateSections((sections) =>
      sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              items: section.items.map((item, rowIndex) =>
                rowIndex === itemIndex ? { ...item, [field]: value } : item,
              ),
            }
          : section,
      ),
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    const nextSubCategory = subCategories.find((subCategory) => subCategory.categoryId === Number(categoryId));
    setForm((current) => ({
      ...current,
      categoryId,
      subCategoryId: nextSubCategory?.id ? String(nextSubCategory.id) : '',
    }));
  };

  const updateColorForm = (localId: string, updater: (color: ProductColorForm) => ProductColorForm) => {
    setAreColorsTouched(true);
    setForm((current) => {
      const baseColors = areColorsTouched ? current.colors : displayedColors;
      return {
        ...current,
        colors: baseColors.map((color) => (color.localId === localId ? updater(color) : color)),
      };
    });
  };

  const addColorForm = () => {
    setAreColorsTouched(true);
    setForm((current) => ({
      ...current,
      colors: [...(areColorsTouched ? current.colors : displayedColors), createEmptyColorForm()],
    }));
  };

  const removeColorForm = (localId: string) => {
    setAreColorsTouched(true);
    setForm((current) => {
      const baseColors = areColorsTouched ? current.colors : displayedColors;
      return {
        ...current,
        colors: baseColors
          .map((color) => {
          if (color.localId !== localId) return color;
          if (!color.id) revokeImagePreviews([color]);
          return { ...color, isDeleted: Boolean(color.id) };
        })
          .filter((color) => color.id || color.localId !== localId),
      };
    });
  };

  const addImagesToColor = (localId: string, files: File[]) => {
    if (!files.length) return;
    const previews = createImagePreviews(files);
    updateColorForm(localId, (current) => ({
      ...current,
      newImages: [...current.newImages, ...previews],
    }));
  };

  const removeNewImageFromColor = (localId: string, imageLocalId: string) => {
    updateColorForm(localId, (current) => {
      const removedImage = current.newImages.find((image) => image.localId === imageLocalId);
      if (removedImage) URL.revokeObjectURL(removedImage.previewUrl);

      return {
        ...current,
        newImages: current.newImages.filter((image) => image.localId !== imageLocalId),
      };
    });
  };

  const syncProductColors = async (productId: number, colors: ProductColorForm[], originalColors: ProductColor[] = []) => {
    const originalColorMap = new Map(originalColors.map((color) => [color.id, color]));
    const deletedColors = colors.filter((color) => color.id && color.isDeleted);
    const activeColors = colors.filter((color) => !color.isDeleted && color.colorName.trim());
    const existingColors = activeColors.filter((color) => color.id);
    const changedExistingColors = existingColors.filter((color) =>
      isExistingColorChanged(color, originalColorMap.get(Number(color.id))),
    );
    const newColors = activeColors.filter((color) => !color.id);
    const newImagesForExistingColors = existingColors.filter((color) => color.newImages.length > 0);

    await Promise.all(
      deletedColors.map((color) =>
        deleteColorMutation.mutateAsync({ id: Number(color.id), productId: color.productId ?? productId }),
      ),
    );

    await Promise.all(
      changedExistingColors.map((color) =>
        updateColorMutation.mutateAsync({
          id: Number(color.id),
          payload: {
            colorName: color.colorName,
            imageUrls: color.existingImages,
          },
        }),
      ),
    );

    await Promise.all(
      newColors.map((color) =>
        createColorMutation.mutateAsync({
          productId,
          colorName: color.colorName,
          images: color.newImages.map((image) => image.file),
        }),
      ),
    );

    await Promise.all(
      newImagesForExistingColors.map((color) =>
        createColorMutation.mutateAsync({
          productId,
          colorName: color.colorName,
          images: color.newImages.map((image) => image.file),
        }),
      ),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setColorError(null);
    const payload = buildPayload(form);
    const colorsForSubmit = areColorsTouched ? form.colors : displayedColors;
    if (!payload.categoryId || !payload.subCategoryId || !payload.materialId) return;

    try {
      if (selectedProduct) {
        const updatedProduct = await updateMutation.mutateAsync({ id: selectedProduct.id, payload });
        if (areColorsTouched) {
          await syncProductColors(updatedProduct.id, colorsForSubmit, productColorsQuery.data ?? selectedProduct.colors ?? []);
        }
        setStatusMessage('Product updated successfully.');
        closeModal();
        return;
      }

      const createdProduct = await createMutation.mutateAsync(payload);
      await syncProductColors(createdProduct.id, colorsForSubmit);
      setStatusMessage('Product created successfully.');
      closeModal();
    } catch (error) {
      setColorError(error);
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Catalog setup</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Products</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage product details, filters, sizes, highlights, and specification sections.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create product
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-[#D9E4F5] bg-white p-4 shadow-[0_12px_34px_rgba(0,17,58,0.05)] md:p-6">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form className="flex w-full max-w-md gap-2" onSubmit={handleSearchSubmit}>
            <label className="relative block flex-1">
              <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0037AD]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] pl-11 pr-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="Search products"
              />
            </label>
            <button type="submit" className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] hover:bg-[#EAF1FF]">
              Search
            </button>
          </form>
          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} products</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {productsQuery.isError && <ApiErrorMessage error={productsQuery.error} title="Could not load products" />}
        {deleteMutation.isError && <ApiErrorMessage error={deleteMutation.error} title="Could not delete product" />}

        {productsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-32 rounded-lg bg-[#F7FAFF]" />
            <div className="h-32 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : products.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1180px] table-fixed border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="w-[170px] rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Preview</th>
                    <th className="w-[240px] bg-[#F7FAFF] px-4 py-3 font-bold">Product</th>
                    <th className="w-[180px] bg-[#F7FAFF] px-4 py-3 font-bold">Category</th>
                    <th className="w-[150px] bg-[#F7FAFF] px-4 py-3 font-bold">Material</th>
                    <th className="w-[110px] bg-[#F7FAFF] px-4 py-3 font-bold">Type</th>
                    <th className="w-[160px] bg-[#F7FAFF] px-4 py-3 font-bold">Sizes</th>
                    <th className="w-[120px] bg-[#F7FAFF] px-4 py-3 text-center font-bold">Featured</th>
                    <th className="w-[150px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="group">
                      <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <div className="h-24 w-32 overflow-hidden rounded-lg border border-[#D9E4F5] bg-[#F7FAFF]">
                          <img src={getProductImage(product)} alt={product.name} className="h-full w-full object-contain p-2" />
                        </div>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <p className="break-words text-lg font-bold text-[#00113A] [overflow-wrap:anywhere]">{product.name}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-[#5E6675]">{product.description}</p>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0037AD]">
                          {product.colors.length} colors
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 group-hover:bg-[#FBFCFF]">
                        <p className="font-bold text-[#00113A]">{product.categoryName}</p>
                        <p className="text-sm text-[#5E6675]">{product.subCategoryName}</p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 font-bold text-[#00113A] group-hover:bg-[#FBFCFF]">{product.materialName}</td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 font-bold text-[#0037AD] group-hover:bg-[#FBFCFF]">{product.type}</td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 text-sm text-[#5E6675] group-hover:bg-[#FBFCFF]">
                        {product.sizes.map((size) => size.name).join(', ') || 'No sizes'}
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 text-center group-hover:bg-[#FBFCFF]">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${product.isFeatured ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F6F8FC] text-[#5E6675]'}`}>
                          {product.isFeatured ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-3 text-right group-hover:bg-[#FBFCFF]">
                        {confirmDeleteId === product.id ? (
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setConfirmDeleteId(null)} className="rounded-lg border border-[#D9E4F5] px-4 py-2 text-sm font-bold text-[#384152]">Cancel</button>
                            <button
                              type="button"
                              onClick={() => deleteMutation.mutate(product.id, { onSuccess: () => setConfirmDeleteId(null) })}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => openEditModal(product)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD]">
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button type="button" onClick={() => setConfirmDeleteId(product.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#E5ECF8] pt-4">
              <p className="text-sm font-semibold text-[#5E6675]">Page {pageNumber} of {totalPages}</p>
              <div className="flex gap-2">
                <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber((current) => Math.max(1, current - 1))} className="h-10 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] disabled:opacity-50">Previous</button>
                <button type="button" disabled={pageNumber >= totalPages} onClick={() => setPageNumber((current) => Math.min(totalPages, current + 1))} className="h-10 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] disabled:opacity-50">Next</button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-[#F7FAFF] px-6 py-12 text-center">
            <h2 className="text-xl font-bold text-[#00113A]">No products yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first product from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">{selectedProduct ? 'Edit product' : 'Create product'}</h2>
                <p className="mt-1 text-sm text-[#5E6675]">Manage product details, colors, and images.</p>
              </div>
              <button type="button" onClick={closeModal} className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] hover:bg-[#F6F8FC]">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(92vh-82px)] space-y-5 overflow-y-auto p-5">
              {showModalError && <ApiErrorMessage error={modalError} title={selectedProduct ? 'Could not update product' : 'Could not create product'} />}
              {colorError !== null && <ApiErrorMessage error={colorError} title="Could not save product colors" />}
              {productColorsQuery.isError && selectedProduct && (
                <ApiErrorMessage error={productColorsQuery.error} title="Could not load product colors" />
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Name</span>
                  <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} required className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD]" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Material</span>
                  <select value={form.materialId} onChange={(event) => updateForm('materialId', event.target.value)} required className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD]">
                    <option value="">Select material</option>
                    {materials.map((material) => <option key={material.id} value={material.id}>{material.name}</option>)}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Description</span>
                <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} required rows={4} className="w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-[#00113A] outline-none focus:border-[#0037AD]" />
              </label>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Category</span>
                  <select value={form.categoryId} onChange={(event) => handleCategoryChange(event.target.value)} required className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD]">
                    <option value="">Select category</option>
                    {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Subcategory</span>
                  <select value={form.subCategoryId} onChange={(event) => updateForm('subCategoryId', event.target.value)} required className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD]">
                    <option value="">Select subcategory</option>
                    {filteredSubCategories.map((subCategory) => <option key={subCategory.id} value={subCategory.id}>{subCategory.name}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Type</span>
                  <select value={form.type} onChange={(event) => updateForm('type', event.target.value as Product['type'])} className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD]">
                    <option value="Shorty">Shorty</option>
                    <option value="Full">Full</option>
                  </select>
                </label>
              </div>

              <div className="rounded-lg border border-[#E5ECF8] bg-[#F7FAFF] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-[#00113A]">Sizes</h3>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#0037AD]">
                    <input type="checkbox" checked={form.isFeatured} onChange={(event) => updateForm('isFeatured', event.target.checked)} />
                    Featured
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const value = String(size.id);
                    const checked = form.sizes.includes(value);
                    return (
                      <label key={size.id} className={`rounded-full border px-4 py-2 text-sm font-bold ${checked ? 'border-[#0037AD] bg-[#EAF1FF] text-[#0037AD]' : 'border-[#D9E4F5] bg-white text-[#5E6675]'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(event) => {
                            updateForm('sizes', event.target.checked ? [...form.sizes, value] : form.sizes.filter((sizeId) => sizeId !== value));
                          }}
                          className="sr-only"
                        />
                        {size.name}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-[#E5ECF8] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-bold text-[#00113A]">Colors</h3>
                  <button
                    type="button"
                    onClick={addColorForm}
                    disabled={isLoadingProductColors}
                    className="text-sm font-bold text-[#0037AD] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add color
                  </button>
                </div>

                {productColorsQuery.isLoading && selectedProduct ? (
                  <div className="space-y-3">
                    <div className="h-24 animate-pulse rounded-lg bg-[#F7FAFF]" />
                    <div className="h-24 animate-pulse rounded-lg bg-[#F7FAFF]" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedColors.filter((color) => !color.isDeleted).length === 0 && (
                      <div className="rounded-lg bg-[#F7FAFF] px-4 py-8 text-center">
                        <p className="font-bold text-[#00113A]">No colors added</p>
                      </div>
                    )}

                    {displayedColors
                      .filter((color) => !color.isDeleted)
                      .map((color) => (
                        <div key={color.localId} className="rounded-lg bg-[#F7FAFF] p-4">
                          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
                            <label className="block">
                              <span className="mb-2 block text-sm font-bold text-[#00113A]">Color name</span>
                              <input
                                value={color.colorName}
                                onChange={(event) =>
                                  updateColorForm(color.localId, (current) => ({ ...current, colorName: event.target.value }))
                                }
                                className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-white px-4 outline-none focus:border-[#0037AD]"
                                placeholder="Black"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeColorForm(color.localId)}
                              className="h-11 rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-600 hover:bg-red-50"
                            >
                              Remove color
                            </button>
                          </div>

                          {color.existingImages.length > 0 && (
                            <div className="mb-4">
                              <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5E6675]">Saved images</p>
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                {color.existingImages.map((imageUrl) => (
                                  <div key={imageUrl} className="relative h-24 overflow-hidden rounded-lg border border-[#D9E4F5] bg-white">
                                    <img
                                      src={getApiAssetUrl(imageUrl)}
                                      alt={color.colorName || 'Product color'}
                                      className="h-full w-full object-contain p-2"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateColorForm(color.localId, (current) => ({
                                          ...current,
                                          existingImages: current.existingImages.filter((image) => image !== imageUrl),
                                        }))
                                      }
                                      className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-white text-red-600 shadow"
                                      aria-label="Remove image"
                                    >
                                      <FiX className="h-4 w-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div>
                            <label className="block">
                              <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#5E6675]">
                                Add images
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(event) => {
                                  const files = Array.from(event.target.files ?? []);
                                  addImagesToColor(color.localId, files);
                                  event.target.value = '';
                                }}
                                className="block w-full rounded-lg border border-dashed border-[#BFD0EC] bg-white px-4 py-3 text-sm font-semibold text-[#5E6675] file:mr-4 file:rounded-lg file:border-0 file:bg-[#0037AD] file:px-4 file:py-2 file:font-bold file:text-white"
                              />
                            </label>

                            {color.newImages.length > 0 && (
                              <div className="mt-3">
                                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#5E6675]">
                                  New image previews
                                </p>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                                  {color.newImages.map((image) => (
                                    <div
                                      key={image.localId}
                                      className="relative h-24 overflow-hidden rounded-lg border border-[#D9E4F5] bg-white"
                                    >
                                      <img
                                        src={image.previewUrl}
                                        alt={image.file.name}
                                        className="h-full w-full object-contain p-1"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeNewImageFromColor(color.localId, image.localId)}
                                        className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-md bg-white text-red-600 shadow"
                                        aria-label="Remove image"
                                      >
                                        <FiX className="h-4 w-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-[#E5ECF8] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-[#00113A]">Highlights</h3>
                  <button type="button" onClick={() => updateHighlights((highlights) => [...highlights, ''])} className="text-sm font-bold text-[#0037AD]">Add highlight</button>
                </div>
                <div className="space-y-2">
                  {form.highlights.map((highlight, index) => (
                    <div key={index} className="grid gap-2 md:grid-cols-[1fr_auto]">
                      <input
                        value={highlight}
                        onChange={(event) =>
                          updateHighlights((highlights) => highlights.map((item, itemIndex) => itemIndex === index ? event.target.value : item))
                        }
                        className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 outline-none focus:border-[#0037AD]"
                        placeholder="Highlight"
                      />
                      <button
                        type="button"
                        onClick={() => updateHighlights((highlights) => highlights.filter((_, itemIndex) => itemIndex !== index))}
                        className="h-11 rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {form.highlights.length === 0 && (
                    <div className="rounded-lg bg-[#F7FAFF] px-4 py-5 text-center text-sm font-semibold text-[#5E6675]">
                      No highlights added.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-[#E5ECF8] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-[#00113A]">Sections</h3>
                  <button type="button" onClick={addSection} className="text-sm font-bold text-[#0037AD]">Add section</button>
                </div>
                <div className="space-y-4">
                  {form.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="rounded-lg bg-[#F7FAFF] p-4">
                      <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
                        <input value={section.name} onChange={(event) => updateSectionName(sectionIndex, event.target.value)} className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-white px-4 outline-none focus:border-[#0037AD]" placeholder="Section name" />
                        <button
                          type="button"
                          onClick={() => removeSection(sectionIndex)}
                          className="h-11 rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-600 hover:bg-red-50"
                        >
                          Remove section
                        </button>
                      </div>
                      <div className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input value={item.key} onChange={(event) => updateSectionItem(sectionIndex, itemIndex, 'key', event.target.value)} className="h-11 rounded-lg border border-[#D9E4F5] bg-white px-4 outline-none focus:border-[#0037AD]" placeholder="Key" />
                            <input value={item.value} onChange={(event) => updateSectionItem(sectionIndex, itemIndex, 'value', event.target.value)} className="h-11 rounded-lg border border-[#D9E4F5] bg-white px-4 outline-none focus:border-[#0037AD]" placeholder="Value" />
                            <button
                              type="button"
                              onClick={() => removeSectionItem(sectionIndex, itemIndex)}
                              className="h-11 rounded-lg border border-red-200 bg-white px-4 text-sm font-bold text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {section.items.length === 0 && (
                          <div className="rounded-lg bg-white px-4 py-4 text-center text-sm font-semibold text-[#5E6675]">
                            No section items added.
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={() => addSectionItem(sectionIndex)} className="mt-3 text-sm font-bold text-[#0037AD]">Add item</button>
                    </div>
                  ))}
                  {form.sections.length === 0 && (
                    <div className="rounded-lg bg-[#F7FAFF] px-4 py-8 text-center text-sm font-semibold text-[#5E6675]">
                      No sections added.
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#E5ECF8] pt-4">
                <button type="button" onClick={closeModal} disabled={isSaving} className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#384152]">Cancel</button>
                <button type="submit" disabled={isSaving} className="h-11 rounded-lg bg-[#0037AD] px-5 font-bold text-white disabled:opacity-70">
                  {isSaving ? 'Saving...' : selectedProduct ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
