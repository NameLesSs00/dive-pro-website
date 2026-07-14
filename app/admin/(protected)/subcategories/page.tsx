'use client';

import { FormEvent, useMemo, useRef, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useCategories } from '@/features/categories/categoryQueries';
import {
  useCreateSubCategory,
  useDeleteSubCategory,
  useSubCategories,
  useUpdateSubCategory,
} from '@/features/subCategories/subCategoryQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { SubCategory } from '@/lib/models/subCategory';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

const initialForm = {
  name: '',
  categoryId: '',
};

const emptyCategories: { id: number; name: string }[] = [];

type ModalMode = 'create' | 'edit';

export default function AdminSubCategoriesPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingSubCategoryId, setDeletingSubCategoryId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const deletingIdsRef = useRef(new Set<number>());

  const subCategoriesQuery = useSubCategories(token, { pageNumber, pageSize, search });
  const categoriesQuery = useCategories(token, { pageNumber: 1, pageSize: 100, search: '' });
  const createMutation = useCreateSubCategory(token);
  const updateMutation = useUpdateSubCategory(token);
  const deleteMutation = useDeleteSubCategory(token);

  const subCategories = subCategoriesQuery.data?.subCategories ?? [];
  const categories = categoriesQuery.data?.categories ?? emptyCategories;
  const pagination = subCategoriesQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? subCategories.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? Math.ceil(totalCount / pageSize)));
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const modalError = modalMode === 'create' ? createMutation.error : updateMutation.error;
  const showModalError = modalMode === 'create' ? createMutation.isError : updateMutation.isError;
  const hasCategories = categories.length > 0;

  const categoryNameById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedSubCategory(null);
    setForm({
      name: '',
      categoryId: categories[0]?.id ? String(categories[0].id) : '',
    });
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (subCategory: SubCategory) => {
    setModalMode('edit');
    setSelectedSubCategory(subCategory);
    setForm({ name: subCategory.name, categoryId: String(subCategory.categoryId) });
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedSubCategory(null);
    setModalMode('edit');
    setForm(initialForm);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const categoryId = Number(form.categoryId);
    if (!categoryId) return;

    if (modalMode === 'create') {
      createMutation.mutate(
        {
          name: form.name,
          categoryId,
        },
        {
          onSuccess: () => {
            setStatusMessage('Subcategory created successfully.');
            setIsModalOpen(false);
            setSelectedSubCategory(null);
            setModalMode('edit');
            setForm(initialForm);
          },
        }
      );
      return;
    }

    if (!selectedSubCategory) return;

    updateMutation.mutate(
      {
        id: selectedSubCategory.id,
        payload: {
          name: form.name,
          categoryId,
        },
      },
      {
        onSuccess: () => {
          setStatusMessage('Subcategory updated successfully.');
          setIsModalOpen(false);
          setSelectedSubCategory(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (deletingIdsRef.current.has(id)) return;

    deletingIdsRef.current.add(id);
    setDeletingSubCategoryId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setStatusMessage('Subcategory deleted successfully.');
      },
      onSettled: () => {
        deletingIdsRef.current.delete(id);
        setDeletingSubCategoryId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Store setup</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Subcategories</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Organize category children and connect each subcategory to a parent category.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create subcategory
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
                placeholder="Search subcategories"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              Search
            </button>
          </form>

          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} subcategories</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {subCategoriesQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={subCategoriesQuery.error} title="Could not load subcategories" />
          </div>
        )}

        {categoriesQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={categoriesQuery.error} title="Could not load categories" />
          </div>
        )}

        {deleteMutation.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={deleteMutation.error} title="Could not delete subcategory" />
          </div>
        )}

        {subCategoriesQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-24 rounded-lg bg-[#F7FAFF]" />
            <div className="h-24 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : subCategories.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Subcategory</th>
                    <th className="bg-[#F7FAFF] px-4 py-3 font-bold">Parent category</th>
                    <th className="w-[160px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.map((subCategory) => {
                    const categoryName = categoryNameById.get(subCategory.categoryId);

                    return (
                      <tr key={subCategory.id} className="group">
                        <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                          <p className="text-lg font-bold text-[#00113A]">{subCategory.name}</p>
                        </td>
                        <td className="border-y border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                          <span className="inline-flex rounded-lg bg-[#EAF1FF] px-3 py-2 text-sm font-bold text-[#0037AD]">
                            {categoryName || `Category #${subCategory.categoryId}`}
                          </span>
                        </td>
                        <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-4 text-right transition-colors group-hover:bg-[#FBFCFF]">
                          {confirmDeleteId === subCategory.id ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded-lg border border-[#D9E4F5] px-4 py-2 text-sm font-bold text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(subCategory.id)}
                                disabled={deletingSubCategoryId === subCategory.id}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                              >
                                {deletingSubCategoryId === subCategory.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openEditModal(subCategory)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD] transition-colors hover:bg-[#DCE8FF]"
                                aria-label={`Edit ${subCategory.name}`}
                              >
                                <FiEdit2 className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(subCategory.id)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                aria-label={`Delete ${subCategory.name}`}
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex flex-col gap-3 border-t border-[#E5ECF8] pt-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-[#5E6675]">
                Page {pageNumber} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
                  disabled={pageNumber <= 1}
                  className="h-10 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPageNumber((current) => Math.min(totalPages, current + 1))}
                  disabled={pageNumber >= totalPages}
                  className="h-10 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg bg-[#F7FAFF] px-6 py-12 text-center">
            <h2 className="text-xl font-bold text-[#00113A]">No subcategories yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first subcategory from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">
                  {modalMode === 'create' ? 'Create subcategory' : 'Edit subcategory'}
                </h2>
                <p className="mt-1 text-sm text-[#5E6675]">
                  Choose a category name; the category ID is sent to the backend.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close subcategory popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {showModalError && (
                <ApiErrorMessage
                  error={modalError}
                  title={modalMode === 'create' ? 'Could not create subcategory' : 'Could not update subcategory'}
                />
              )}

              {!hasCategories && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                  Create a category first.
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Subcategory name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Category</span>
                <select
                  value={form.categoryId}
                  onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                  required
                  disabled={!hasCategories}
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#384152] transition-colors hover:bg-[#F6F8FC] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !hasCategories}
                  className="h-11 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create subcategory' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
