'use client';

import { FormEvent, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useCreateFaq, useDeleteFaq, useFaqs, useUpdateFaq } from '@/features/faqs/faqQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { Faq } from '@/lib/models/faq';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

const initialForm = {
  question: '',
  answer: '',
};

type ModalMode = 'create' | 'edit';

export default function AdminFaqsPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(initialForm);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');

  const faqsQuery = useFaqs(token, { pageNumber, pageSize, search });
  const createMutation = useCreateFaq(token);
  const updateMutation = useUpdateFaq(token);
  const deleteMutation = useDeleteFaq(token);

  const faqs = faqsQuery.data?.faqs ?? [];
  const pagination = faqsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? faqs.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? Math.ceil(totalCount / pageSize)));
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const modalError = modalMode === 'create' ? createMutation.error : updateMutation.error;
  const showModalError = modalMode === 'create' ? createMutation.isError : updateMutation.isError;

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedFaq(null);
    setForm(initialForm);
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (faq: Faq) => {
    setModalMode('edit');
    setSelectedFaq(faq);
    setForm({ question: faq.question, answer: faq.answer });
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedFaq(null);
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
          setStatusMessage('FAQ created successfully.');
          setIsModalOpen(false);
          setSelectedFaq(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      });
      return;
    }

    if (!selectedFaq) return;

    updateMutation.mutate(
      {
        id: selectedFaq.id,
        payload: form,
      },
      {
        onSuccess: () => {
          setStatusMessage('FAQ updated successfully.');
          setIsModalOpen(false);
          setSelectedFaq(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setStatusMessage('FAQ deleted successfully.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Support content</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">FAQs</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage the questions and answers that help customers understand Dive Pro products and policies.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create FAQ
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
                placeholder="Search FAQs"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              Search
            </button>
          </form>

          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} FAQs</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {faqsQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={faqsQuery.error} title="Could not load FAQs" />
          </div>
        )}

        {deleteMutation.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={deleteMutation.error} title="Could not delete FAQ" />
          </div>
        )}

        {faqsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-28 rounded-lg bg-[#F7FAFF]" />
            <div className="h-28 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : faqs.length ? (
          <>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <article
                  key={faq.id}
                  className="rounded-lg border border-[#E5ECF8] bg-white p-4 transition-colors hover:bg-[#FBFCFF] md:p-5"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase text-[#0037AD]">FAQ ID: {faq.id}</p>
                      <h2 className="mt-2 text-lg font-bold text-[#00113A]">{faq.question}</h2>
                      <p className="mt-3 whitespace-pre-line leading-relaxed text-[#5E6675]">{faq.answer}</p>
                    </div>

                    <div className="flex justify-end gap-2 lg:w-48">
                      {confirmDeleteId === faq.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg border border-[#D9E4F5] px-4 py-2 text-sm font-bold text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(faq.id)}
                            disabled={deleteMutation.isPending}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => openEditModal(faq)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD] transition-colors hover:bg-[#DCE8FF]"
                            aria-label={`Edit FAQ ${faq.id}`}
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(faq.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                            aria-label={`Delete FAQ ${faq.id}`}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
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
            <h2 className="text-xl font-bold text-[#00113A]">No FAQs yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first question and answer from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="w-full max-w-2xl rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">
                  {modalMode === 'create' ? 'Create FAQ' : 'Edit FAQ'}
                </h2>
                <p className="mt-1 text-sm text-[#5E6675]">
                  {modalMode === 'create' ? 'Add a customer question and answer.' : 'Update the question or answer.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close FAQ popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {showModalError && (
                <ApiErrorMessage
                  error={modalError}
                  title={modalMode === 'create' ? 'Could not create FAQ' : 'Could not update FAQ'}
                />
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Question</span>
                <input
                  value={form.question}
                  onChange={(event) => setForm((current) => ({ ...current, question: event.target.value }))}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Question"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Answer</span>
                <textarea
                  value={form.answer}
                  onChange={(event) => setForm((current) => ({ ...current, answer: event.target.value }))}
                  required
                  rows={6}
                  className="w-full resize-none rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Answer"
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
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create FAQ' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
