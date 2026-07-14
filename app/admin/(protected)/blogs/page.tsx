'use client';

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useBlogCategories } from '@/features/blogCategories/blogCategoryQueries';
import { useBlogs, useCreateBlog, useDeleteBlog, useUpdateBlog } from '@/features/blogs/blogQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { getApiAssetUrl } from '@/lib/config/api';
import { Blog } from '@/lib/models/blog';
import { BlogCategory } from '@/lib/models/blogCategory';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

type ModalMode = 'create' | 'edit';

type SectionForm = {
  title: string;
  description: string;
};

type BlogForm = {
  categoryId: string;
  title: string;
  description: string;
  image: File | null;
  sections: SectionForm[];
};

const initialForm: BlogForm = {
  categoryId: '',
  title: '',
  description: '',
  image: null,
  sections: [],
};

const emptyBlogCategories: BlogCategory[] = [];

function getCategoryLabel(blog: Blog, categoryNameById: Map<number, string>) {
  return blog.categoryName || categoryNameById.get(blog.categoryId) || 'Uncategorized';
}

export default function AdminBlogsPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<BlogForm>(initialForm);
  const [localImagePreview, setLocalImagePreview] = useState('');
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const deletingIdsRef = useRef(new Set<number>());

  const blogsQuery = useBlogs(token, { pageNumber, pageSize, search });
  const blogCategoriesQuery = useBlogCategories(token, { pageNumber: 1, pageSize: 100, search: '' });
  const createMutation = useCreateBlog(token);
  const updateMutation = useUpdateBlog(token);
  const deleteMutation = useDeleteBlog(token);

  const blogs = blogsQuery.data?.blogs ?? [];
  const blogCategories = blogCategoriesQuery.data?.blogCategories ?? emptyBlogCategories;
  const pagination = blogsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? blogs.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? Math.ceil(totalCount / pageSize)));
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const modalError = modalMode === 'create' ? createMutation.error : updateMutation.error;
  const showModalError = modalMode === 'create' ? createMutation.isError : updateMutation.isError;
  const currentImagePreview = localImagePreview || getApiAssetUrl(selectedBlog?.imageUrl);
  const hasBlogCategories = blogCategories.length > 0;

  const categoryNameById = useMemo(() => {
    return new Map(blogCategories.map((category) => [category.id, category.name]));
  }, [blogCategories]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedBlog(null);
    setForm({
      ...initialForm,
      categoryId: blogCategories[0]?.id ? String(blogCategories[0].id) : '',
    });
    setStatusMessage('');
    setLocalImagePreview('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    const sections = [...(blog.sections ?? [])]
      .sort((first, second) => first.sectionNo - second.sectionNo)
      .map((section) => ({
        title: section.title,
        description: section.description,
      }));

    setModalMode('edit');
    setSelectedBlog(blog);
    setForm({
      categoryId: String(blog.categoryId),
      title: blog.title,
      description: blog.description,
      image: null,
      sections,
    });
    setStatusMessage('');
    setLocalImagePreview('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedBlog(null);
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

  const updateSection = (index: number, field: keyof SectionForm, value: string) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addSection = () => {
    setForm((current) => ({
      ...current,
      sections: [...current.sections, { title: '', description: '' }],
    }));
  };

  const removeSection = (index: number) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index),
    }));
  };

  const buildSectionsPayload = () => {
    return form.sections
      .map((section) => ({
        title: section.title.trim(),
        description: section.description.trim(),
      }))
      .filter((section) => section.title || section.description)
      .map((section, index) => ({
        sectionNo: index + 1,
        title: section.title,
        description: section.description,
      }));
  };

  const resetFormAfterSuccess = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
    setModalMode('edit');
    setForm(initialForm);
    setLocalImagePreview('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const categoryId = Number(form.categoryId);
    if (!categoryId) return;

    const sections = buildSectionsPayload();

    if (modalMode === 'create') {
      if (!form.image) return;

      createMutation.mutate(
        {
          blog: {
            categoryId,
            title: form.title,
            description: form.description,
            image: form.image,
          },
          sections,
        },
        {
          onSuccess: () => {
            setStatusMessage('Blog created successfully.');
            resetFormAfterSuccess();
          },
        }
      );
      return;
    }

    if (!selectedBlog) return;

    updateMutation.mutate(
      {
        id: selectedBlog.id,
        blog: {
          categoryId,
          title: form.title,
          description: form.description,
          image: form.image,
        },
        sections,
      },
      {
        onSuccess: () => {
          setStatusMessage('Blog updated successfully.');
          resetFormAfterSuccess();
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (deletingIdsRef.current.has(id)) return;

    deletingIdsRef.current.add(id);
    setDeletingBlogId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setStatusMessage('Blog deleted successfully.');
      },
      onSettled: () => {
        deletingIdsRef.current.delete(id);
        setDeletingBlogId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Content setup</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Blogs</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage blog posts, cover images, categories, and article sections.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create blog
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
                placeholder="Search blogs"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              Search
            </button>
          </form>

          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} blogs</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {blogsQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={blogsQuery.error} title="Could not load blogs" />
          </div>
        )}

        {blogCategoriesQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={blogCategoriesQuery.error} title="Could not load blog categories" />
          </div>
        )}

        {deleteMutation.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={deleteMutation.error} title="Could not delete blog" />
          </div>
        )}

        {blogsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-32 rounded-lg bg-[#F7FAFF]" />
            <div className="h-32 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : blogs.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] table-fixed border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="w-[250px] rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Preview</th>
                    <th className="w-[210px] bg-[#F7FAFF] px-4 py-3 font-bold">Blog</th>
                    <th className="w-[160px] bg-[#F7FAFF] px-4 py-3 font-bold">Category</th>
                    <th className="w-[260px] bg-[#F7FAFF] px-4 py-3 font-bold">Description</th>
                    <th className="w-[95px] bg-[#F7FAFF] px-4 py-3 text-center font-bold">Sections</th>
                    <th className="w-[150px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="group">
                      <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-3 transition-colors group-hover:bg-[#FBFCFF]">
                        <div className="h-32 w-56 overflow-hidden rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] shadow-sm">
                          {blog.imageUrl ? (
                            <img
                              src={getApiAssetUrl(blog.imageUrl)}
                              alt={blog.title}
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
                        <p className="break-words text-lg font-bold text-[#00113A] [overflow-wrap:anywhere]">
                          {blog.title}
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="break-words font-bold text-[#00113A] [overflow-wrap:anywhere]">
                          {getCategoryLabel(blog, categoryNameById)}
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 align-top transition-colors group-hover:bg-[#FBFCFF]">
                        <p
                          className="max-h-[4.5rem] overflow-hidden break-words rounded-lg bg-[#F7FAFF] px-3 py-2 text-sm leading-5 text-[#5E6675] [overflow-wrap:anywhere]"
                          title={blog.description}
                        >
                          {blog.description}
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-3 text-center transition-colors group-hover:bg-[#FBFCFF]">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#EAF1FF] px-3 text-sm font-bold text-[#0037AD]">
                          {blog.sections?.length ?? 0}
                        </span>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-3 text-right transition-colors group-hover:bg-[#FBFCFF]">
                        {confirmDeleteId === blog.id ? (
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
                              onClick={() => handleDelete(blog.id)}
                              disabled={deletingBlogId === blog.id}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                            >
                              {deletingBlogId === blog.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(blog)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD] transition-colors hover:bg-[#DCE8FF]"
                              aria-label={`Edit ${blog.title}`}
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(blog.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              aria-label={`Delete ${blog.title}`}
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
            <h2 className="text-xl font-bold text-[#00113A]">No blogs yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first blog from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">
                  {modalMode === 'create' ? 'Create blog' : 'Edit blog'}
                </h2>
                <p className="mt-1 text-sm text-[#5E6675]">
                  {modalMode === 'create' ? 'Add the blog details and sections.' : 'Update the blog details or sections.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close blog popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(92vh-82px)] overflow-y-auto p-5">
              <div className="space-y-4">
                {showModalError && (
                  <ApiErrorMessage
                    error={modalError}
                    title={modalMode === 'create' ? 'Could not create blog' : 'Could not update blog'}
                  />
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Blog category</span>
                  <select
                    value={form.categoryId}
                    onChange={(event) => setForm((current) => ({ ...current, categoryId: event.target.value }))}
                    required
                    disabled={!hasBlogCategories}
                    className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {!hasBlogCategories && <option value="">Create a blog category first</option>}
                    {blogCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Title</span>
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    required
                    className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="Blog title"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    required
                    rows={4}
                    className="w-full resize-y rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="Blog description"
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
                    <img src={currentImagePreview} alt="Blog preview" className="h-64 w-full rounded-lg object-cover" />
                  </div>
                )}

                <div className="rounded-lg border border-[#D9E4F5] bg-[#FBFCFF] p-4">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#00113A]">Sections</h3>
                      <p className="mt-1 text-sm text-[#5E6675]">{form.sections.length} sections</p>
                    </div>
                    <button
                      type="button"
                      onClick={addSection}
                      className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg border border-[#D9E4F5] px-4 text-sm font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
                    >
                      <FiPlus className="h-4 w-4" />
                      Add section
                    </button>
                  </div>

                  {form.sections.length ? (
                    <div className="space-y-3">
                      {form.sections.map((section, index) => (
                        <div key={index} className="rounded-lg border border-[#E5ECF8] bg-white p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-[#0037AD]">Section {index + 1}</p>
                            <button
                              type="button"
                              onClick={() => removeSection(index)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              aria-label={`Remove section ${index + 1}`}
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <label className="block">
                            <span className="mb-2 block text-sm font-bold text-[#00113A]">Section title</span>
                            <input
                              value={section.title}
                              onChange={(event) => updateSection(index, 'title', event.target.value)}
                              className="h-11 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                              placeholder="Section title"
                            />
                          </label>

                          <label className="mt-3 block">
                            <span className="mb-2 block text-sm font-bold text-[#00113A]">Section description</span>
                            <textarea
                              value={section.description}
                              onChange={(event) => updateSection(index, 'description', event.target.value)}
                              rows={3}
                              className="w-full resize-y rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                              placeholder="Section description"
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-white px-4 py-6 text-center text-sm font-semibold text-[#5E6675]">
                      No sections added.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3 border-t border-[#E5ECF8] pt-4">
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
                  disabled={isSaving || !hasBlogCategories}
                  className="h-11 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create blog' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
