'use client';

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent, useRef, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import {
  useBlogCategories,
  useCreateBlogCategory,
  useDeleteBlogCategory,
  useUpdateBlogCategory,
} from '@/features/blogCategories/blogCategoryQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { getApiAssetUrl } from '@/lib/config/api';
import { BlogCategory } from '@/lib/models/blogCategory';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

const initialForm = {
  name: '',
  image: null as File | null,
};

type ModalMode = 'create' | 'edit';

export default function AdminBlogCategoriesPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [localImagePreview, setLocalImagePreview] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<BlogCategory | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingBlogCategoryId, setDeletingBlogCategoryId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const deletingIdsRef = useRef(new Set<number>());

  const blogCategoriesQuery = useBlogCategories(token, { pageNumber, pageSize, search });
  const createMutation = useCreateBlogCategory(token);
  const updateMutation = useUpdateBlogCategory(token);
  const deleteMutation = useDeleteBlogCategory(token);

  const blogCategories = blogCategoriesQuery.data?.blogCategories ?? [];
  const pagination = blogCategoriesQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? blogCategories.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? Math.ceil(totalCount / pageSize)));
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const modalError = modalMode === 'create' ? createMutation.error : updateMutation.error;
  const showModalError = modalMode === 'create' ? createMutation.isError : updateMutation.isError;
  const currentImagePreview = localImagePreview || getApiAssetUrl(selectedBlogCategory?.imageUrl);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedBlogCategory(null);
    setForm(initialForm);
    setStatusMessage('');
    setLocalImagePreview('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (blogCategory: BlogCategory) => {
    setModalMode('edit');
    setSelectedBlogCategory(blogCategory);
    setForm({ name: blogCategory.name, image: null });
    setStatusMessage('');
    setLocalImagePreview('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedBlogCategory(null);
    setModalMode('edit');
    setForm(initialForm);
    setLocalImagePreview('');
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0] ?? null;

    if (localImagePreview) {
      URL.revokeObjectURL(localImagePreview);
    }

    setForm((current) => ({ ...current, image }));
    setLocalImagePreview(image ? URL.createObjectURL(image) : '');
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (modalMode === 'create') {
      if (!form.image) return;

      createMutation.mutate(
        {
          name: form.name,
          image: form.image,
        },
        {
          onSuccess: () => {
            setStatusMessage('Blog category created successfully.');
            setIsModalOpen(false);
            setSelectedBlogCategory(null);
            setModalMode('edit');
            setForm(initialForm);
            setLocalImagePreview('');
          },
        }
      );
      return;
    }

    if (!selectedBlogCategory) return;

    updateMutation.mutate(
      {
        id: selectedBlogCategory.id,
        payload: {
          name: form.name,
          image: form.image,
        },
      },
      {
        onSuccess: () => {
          setStatusMessage('Blog category updated successfully.');
          setIsModalOpen(false);
          setSelectedBlogCategory(null);
          setModalMode('edit');
          setForm(initialForm);
          setLocalImagePreview('');
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (deletingIdsRef.current.has(id)) return;

    deletingIdsRef.current.add(id);
    setDeletingBlogCategoryId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setStatusMessage('Blog category deleted successfully.');
      },
      onSettled: () => {
        deletingIdsRef.current.delete(id);
        setDeletingBlogCategoryId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Blog setup</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Blog Categories</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage blog category names and cover images for the content section.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create blog category
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
                placeholder="Search blog categories"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              Search
            </button>
          </form>

          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} blog categories</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {blogCategoriesQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={blogCategoriesQuery.error} title="Could not load blog categories" />
          </div>
        )}

        {deleteMutation.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={deleteMutation.error} title="Could not delete blog category" />
          </div>
        )}

        {blogCategoriesQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-32 rounded-lg bg-[#F7FAFF]" />
            <div className="h-32 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : blogCategories.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="w-[260px] rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Preview</th>
                    <th className="bg-[#F7FAFF] px-4 py-3 font-bold">Name</th>
                    <th className="w-[160px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogCategories.map((blogCategory) => (
                    <tr key={blogCategory.id} className="group">
                      <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-3 transition-colors group-hover:bg-[#FBFCFF]">
                        <div className="h-32 w-56 overflow-hidden rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] shadow-sm">
                          {blogCategory.imageUrl ? (
                            <img
                              src={getApiAssetUrl(blogCategory.imageUrl)}
                              alt={blogCategory.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#5E6675]">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="text-lg font-bold text-[#00113A]">{blogCategory.name}</p>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-3 text-right transition-colors group-hover:bg-[#FBFCFF]">
                        {confirmDeleteId === blogCategory.id ? (
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
                              onClick={() => handleDelete(blogCategory.id)}
                              disabled={deletingBlogCategoryId === blogCategory.id}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                            >
                              {deletingBlogCategoryId === blogCategory.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(blogCategory)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD] transition-colors hover:bg-[#DCE8FF]"
                              aria-label={`Edit ${blogCategory.name}`}
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(blogCategory.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              aria-label={`Delete ${blogCategory.name}`}
                            >
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
            <h2 className="text-xl font-bold text-[#00113A]">No blog categories yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first blog category from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">
                  {modalMode === 'create' ? 'Create blog category' : 'Edit blog category'}
                </h2>
                <p className="mt-1 text-sm text-[#5E6675]">
                  {modalMode === 'create' ? 'Add a name and cover image.' : 'Update the name or replace the image.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close blog category popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {showModalError && (
                <ApiErrorMessage
                  error={modalError}
                  title={modalMode === 'create' ? 'Could not create blog category' : 'Could not update blog category'}
                />
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Blog category name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">
                  Image {modalMode === 'edit' && <span className="font-normal text-[#5E6675]">(optional)</span>}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  required={modalMode === 'create'}
                  onChange={handleImageChange}
                  className="block w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-sm text-[#00113A] outline-none file:mr-4 file:rounded-lg file:border-0 file:bg-[#EAF1FF] file:px-4 file:py-2 file:font-bold file:text-[#0037AD] focus:border-[#0037AD] focus:bg-white"
                />
              </label>

              {currentImagePreview && (
                <div className="rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] p-3">
                  <p className="mb-2 text-sm font-bold text-[#00113A]">Preview</p>
                  <img
                    src={currentImagePreview}
                    alt="Blog category preview"
                    className="h-56 w-full rounded-lg object-cover"
                  />
                </div>
              )}

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
                  disabled={isSaving}
                  className="h-11 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create blog category' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
