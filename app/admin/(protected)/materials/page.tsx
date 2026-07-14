'use client';

import { FormEvent, useRef, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import {
  useCreateMaterial,
  useDeleteMaterial,
  useMaterials,
  useUpdateMaterial,
} from '@/features/materials/materialQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { Material } from '@/lib/models/material';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

const initialForm = {
  name: '',
};

type ModalMode = 'create' | 'edit';

export default function AdminMaterialsPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingMaterialId, setDeletingMaterialId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const deletingIdsRef = useRef(new Set<number>());

  const materialsQuery = useMaterials(token, { pageNumber, pageSize, search });
  const createMutation = useCreateMaterial(token);
  const updateMutation = useUpdateMaterial(token);
  const deleteMutation = useDeleteMaterial(token);

  const materials = materialsQuery.data?.materials ?? [];
  const pagination = materialsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? materials.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? Math.ceil(totalCount / pageSize)));
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const modalError = modalMode === 'create' ? createMutation.error : updateMutation.error;
  const showModalError = modalMode === 'create' ? createMutation.isError : updateMutation.isError;

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedMaterial(null);
    setForm(initialForm);
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (material: Material) => {
    setModalMode('edit');
    setSelectedMaterial(material);
    setForm({ name: material.name });
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedMaterial(null);
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

    if (modalMode === 'create') {
      createMutation.mutate(form, {
        onSuccess: () => {
          setStatusMessage('Material created successfully.');
          setIsModalOpen(false);
          setSelectedMaterial(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      });
      return;
    }

    if (!selectedMaterial) return;

    updateMutation.mutate(
      {
        id: selectedMaterial.id,
        payload: form,
      },
      {
        onSuccess: () => {
          setStatusMessage('Material updated successfully.');
          setIsModalOpen(false);
          setSelectedMaterial(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (deletingIdsRef.current.has(id)) return;

    deletingIdsRef.current.add(id);
    setDeletingMaterialId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setStatusMessage('Material deleted successfully.');
      },
      onSettled: () => {
        deletingIdsRef.current.delete(id);
        setDeletingMaterialId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Store setup</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Materials</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage product material labels that can be reused across inventory and product setup.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create material
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
                placeholder="Search materials"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              Search
            </button>
          </form>

          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} materials</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {materialsQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={materialsQuery.error} title="Could not load materials" />
          </div>
        )}

        {deleteMutation.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={deleteMutation.error} title="Could not delete material" />
          </div>
        )}

        {materialsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-20 rounded-lg bg-[#F7FAFF]" />
            <div className="h-20 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : materials.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Material</th>
                    <th className="w-[160px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material) => (
                    <tr key={material.id} className="group">
                      <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="break-words text-lg font-bold text-[#00113A] [overflow-wrap:anywhere]">
                          {material.name}
                        </p>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-4 text-right transition-colors group-hover:bg-[#FBFCFF]">
                        {confirmDeleteId === material.id ? (
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
                              onClick={() => handleDelete(material.id)}
                              disabled={deletingMaterialId === material.id}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                            >
                              {deletingMaterialId === material.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(material)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD] transition-colors hover:bg-[#DCE8FF]"
                              aria-label={`Edit ${material.name}`}
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(material.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              aria-label={`Delete ${material.name}`}
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
            <h2 className="text-xl font-bold text-[#00113A]">No materials yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first material from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">
                  {modalMode === 'create' ? 'Create material' : 'Edit material'}
                </h2>
                <p className="mt-1 text-sm text-[#5E6675]">
                  {modalMode === 'create' ? 'Add a reusable material label.' : 'Update the material label.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close material popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {showModalError && (
                <ApiErrorMessage
                  error={modalError}
                  title={modalMode === 'create' ? 'Could not create material' : 'Could not update material'}
                />
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm({ name: event.target.value })}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Neoprene, Nylon, Rubber"
                />
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
                  disabled={isSaving}
                  className="h-11 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create material' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
