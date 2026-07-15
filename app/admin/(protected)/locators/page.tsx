'use client';

import { FormEvent, useRef, useState } from 'react';
import { FiCheckCircle, FiEdit2, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import {
  useCreateLocator,
  useDeleteLocator,
  useLocators,
  useUpdateLocator,
} from '@/features/locators/locatorQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { Locator } from '@/lib/models/locator';
import { formatTime24, formatTimeRange24 } from '@/lib/utils/timeFormat';
import { useAppSelector } from '@/store/hooks';

const pageSize = 10;

const initialForm = {
  name: '',
  address: '',
  phone: '',
  from: '',
  to: '',
  longitude: '',
  latitude: '',
};

type LocatorForm = typeof initialForm;
type ModalMode = 'create' | 'edit';

const hourOptions = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

function toTimeInputValue(value: string) {
  return formatTime24(value);
}

function splitTimeValue(value: string) {
  const normalized = formatTime24(value);
  const [hour = '', minute = ''] = normalized.split(':');

  return { hour, minute };
}

function formatHours(from: string, to: string) {
  return formatTimeRange24(from, to);
}

function toLocatorForm(locator: Locator): LocatorForm {
  return {
    name: locator.name,
    address: locator.address,
    phone: locator.phone,
    from: toTimeInputValue(locator.from),
    to: toTimeInputValue(locator.to),
    longitude: String(locator.longitude),
    latitude: String(locator.latitude),
  };
}

function toLocatorPayload(form: LocatorForm) {
  return {
    name: form.name,
    address: form.address,
    phone: form.phone,
    from: formatTime24(form.from),
    to: formatTime24(form.to),
    longitude: Number(form.longitude),
    latitude: Number(form.latitude),
  };
}

function Time24Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { hour, minute } = splitTimeValue(value);

  const handleHourChange = (nextHour: string) => {
    onChange(nextHour ? `${nextHour}:${minute || '00'}` : '');
  };

  const handleMinuteChange = (nextMinute: string) => {
    onChange(nextMinute ? `${hour || '00'}:${nextMinute}` : '');
  };

  const selectClassName =
    'h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-3 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white';

  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-bold text-[#00113A]">{label}</legend>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <select
          value={hour}
          onChange={(event) => handleHourChange(event.target.value)}
          required
          className={selectClassName}
          aria-label={`${label} hour`}
        >
          <option value="">HH</option>
          {hourOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="font-bold text-[#00113A]">:</span>
        <select
          value={minute}
          onChange={(event) => handleMinuteChange(event.target.value)}
          required
          className={selectClassName}
          aria-label={`${label} minute`}
        >
          <option value="">MM</option>
          {minuteOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}

export default function AdminLocatorsPage() {
  const token = useAppSelector(selectAccessToken);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState<LocatorForm>(initialForm);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocator, setSelectedLocator] = useState<Locator | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingLocatorId, setDeletingLocatorId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const deletingIdsRef = useRef(new Set<number>());

  const locatorsQuery = useLocators(token, { pageNumber, pageSize, search });
  const createMutation = useCreateLocator(token);
  const updateMutation = useUpdateLocator(token);
  const deleteMutation = useDeleteLocator(token);

  const locators = locatorsQuery.data?.locators ?? [];
  const pagination = locatorsQuery.data?.pagination;
  const totalCount = Number(pagination?.totalCount ?? locators.length);
  const totalPages = Math.max(1, Number(pagination?.totalPages ?? Math.ceil(totalCount / pageSize)));
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const modalError = modalMode === 'create' ? createMutation.error : updateMutation.error;
  const showModalError = modalMode === 'create' ? createMutation.isError : updateMutation.isError;

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedLocator(null);
    setForm(initialForm);
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const openEditModal = (locator: Locator) => {
    setModalMode('edit');
    setSelectedLocator(locator);
    setForm(toLocatorForm(locator));
    setStatusMessage('');
    createMutation.reset();
    updateMutation.reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setSelectedLocator(null);
    setModalMode('edit');
    setForm(initialForm);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageNumber(1);
    setSearch(searchInput.trim());
  };

  const updateForm = (field: keyof LocatorForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = toLocatorPayload(form);
    if (!Number.isFinite(payload.longitude) || !Number.isFinite(payload.latitude)) return;

    if (modalMode === 'create') {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setStatusMessage('Locator created successfully.');
          setIsModalOpen(false);
          setSelectedLocator(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      });
      return;
    }

    if (!selectedLocator) return;

    updateMutation.mutate(
      {
        id: selectedLocator.id,
        payload,
      },
      {
        onSuccess: () => {
          setStatusMessage('Locator updated successfully.');
          setIsModalOpen(false);
          setSelectedLocator(null);
          setModalMode('edit');
          setForm(initialForm);
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (deletingIdsRef.current.has(id)) return;

    deletingIdsRef.current.add(id);
    setDeletingLocatorId(id);
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
        setStatusMessage('Locator deleted successfully.');
      },
      onSettled: () => {
        deletingIdsRef.current.delete(id);
        setDeletingLocatorId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Store setup</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Locators</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage store locations, opening hours, contact numbers, and map coordinates.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiPlus className="h-4 w-4" />
            Create locator
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
                placeholder="Search locators"
              />
            </label>
            <button
              type="submit"
              className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              Search
            </button>
          </form>

          <p className="text-sm font-semibold text-[#5E6675]">{totalCount} locators</p>
        </div>

        {statusMessage && (
          <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
            <span className="font-semibold">{statusMessage}</span>
          </div>
        )}

        {locatorsQuery.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={locatorsQuery.error} title="Could not load locators" />
          </div>
        )}

        {deleteMutation.isError && (
          <div className="mb-5">
            <ApiErrorMessage error={deleteMutation.error} title="Could not delete locator" />
          </div>
        )}

        {locatorsQuery.isLoading ? (
          <div className="space-y-3">
            <div className="h-14 rounded-lg bg-[#F2F6FF]" />
            <div className="h-28 rounded-lg bg-[#F7FAFF]" />
            <div className="h-28 rounded-lg bg-[#F7FAFF]" />
          </div>
        ) : locators.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] table-fixed border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="w-[190px] rounded-l-lg bg-[#F7FAFF] px-4 py-3 font-bold">Store</th>
                    <th className="w-[260px] bg-[#F7FAFF] px-4 py-3 font-bold">Address</th>
                    <th className="w-[160px] bg-[#F7FAFF] px-4 py-3 font-bold">Phone</th>
                    <th className="w-[150px] bg-[#F7FAFF] px-4 py-3 font-bold">Hours</th>
                    <th className="w-[190px] bg-[#F7FAFF] px-4 py-3 font-bold">Coordinates</th>
                    <th className="w-[170px] rounded-r-lg bg-[#F7FAFF] px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locators.map((locator) => (
                    <tr key={locator.id} className="group">
                      <td className="rounded-l-lg border-y border-l border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="break-words text-lg font-bold text-[#00113A] [overflow-wrap:anywhere]">
                          {locator.name}
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="max-h-16 overflow-hidden break-words text-sm leading-5 text-[#5E6675] [overflow-wrap:anywhere]">
                          {locator.address}
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="break-words text-sm font-bold text-[#00113A] [overflow-wrap:anywhere]">
                          {locator.phone}
                        </p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="text-sm font-bold text-[#00113A]">{formatHours(locator.from, locator.to)}</p>
                      </td>
                      <td className="border-y border-[#E5ECF8] bg-white px-4 py-4 transition-colors group-hover:bg-[#FBFCFF]">
                        <p className="break-words text-sm text-[#5E6675] [overflow-wrap:anywhere]">
                          {locator.latitude}, {locator.longitude}
                        </p>
                      </td>
                      <td className="rounded-r-lg border-y border-r border-[#E5ECF8] bg-white px-4 py-4 text-right transition-colors group-hover:bg-[#FBFCFF]">
                        {confirmDeleteId === locator.id ? (
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
                              onClick={() => handleDelete(locator.id)}
                              disabled={deletingLocatorId === locator.id}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                            >
                              {deletingLocatorId === locator.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(locator)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF1FF] text-[#0037AD] transition-colors hover:bg-[#DCE8FF]"
                              aria-label={`Edit ${locator.name}`}
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(locator.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                              aria-label={`Delete ${locator.name}`}
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
            <h2 className="text-xl font-bold text-[#00113A]">No locators yet</h2>
            <p className="mt-2 text-[#5E6675]">Create the first store locator from the popup.</p>
          </div>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">
                  {modalMode === 'create' ? 'Create locator' : 'Edit locator'}
                </h2>
                <p className="mt-1 text-sm text-[#5E6675]">
                  {modalMode === 'create' ? 'Add a store location.' : 'Update the store location.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close locator popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[calc(92vh-82px)] space-y-4 overflow-y-auto p-5">
              {showModalError && (
                <ApiErrorMessage
                  error={modalError}
                  title={modalMode === 'create' ? 'Could not create locator' : 'Could not update locator'}
                />
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Name</span>
                  <input
                    value={form.name}
                    onChange={(event) => updateForm('name', event.target.value)}
                    required
                    className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="Store name"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(event) => updateForm('phone', event.target.value)}
                    required
                    className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="+20 123 456 7890"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Address</span>
                <textarea
                  value={form.address}
                  onChange={(event) => updateForm('address', event.target.value)}
                  required
                  rows={3}
                  className="w-full resize-y rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 py-3 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Store address"
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <Time24Field label="From" value={form.from} onChange={(value) => updateForm('from', value)} />
                <Time24Field label="To" value={form.to} onChange={(value) => updateForm('to', value)} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Latitude</span>
                  <input
                    type="number"
                    step="any"
                    value={form.latitude}
                    onChange={(event) => updateForm('latitude', event.target.value)}
                    required
                    className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="27.2579"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#00113A]">Longitude</span>
                  <input
                    type="number"
                    step="any"
                    value={form.longitude}
                    onChange={(event) => updateForm('longitude', event.target.value)}
                    required
                    className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                    placeholder="33.8116"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#E5ECF8] pt-4">
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
                  {isSaving ? 'Saving...' : modalMode === 'create' ? 'Create locator' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
