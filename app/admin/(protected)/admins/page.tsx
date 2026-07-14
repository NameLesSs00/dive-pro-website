'use client';

import { FormEvent, useState } from 'react';
import { FiCheckCircle, FiTrash2, FiUserPlus, FiX } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useAdminUsers, useCreateAdminUser, useDeleteAdminUser } from '@/features/admins/adminUsersQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { useAppSelector } from '@/store/hooks';

const initialForm = {
  email: '',
  password: '',
  fullName: '',
};

export default function AdminsPage() {
  const token = useAppSelector(selectAccessToken);
  const [form, setForm] = useState(initialForm);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const adminsQuery = useAdminUsers(token);
  const createMutation = useCreateAdminUser(token);
  const deleteMutation = useDeleteAdminUser(token);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate(
      {
        ...form,
        role: 'SuperAdmin',
      },
      {
        onSuccess: () => {
          setForm(initialForm);
          setIsCreateOpen(false);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
      },
    });
  };

  const openCreateModal = () => {
    setForm(initialForm);
    createMutation.reset();
    setIsCreateOpen(true);
  };

  const closeCreateModal = () => {
    if (createMutation.isPending) return;
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Admin users</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Admins</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Create, review, and remove users that can access the admin dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A]"
          >
            <FiUserPlus className="h-4 w-4" />
            Create admin
          </button>
        </div>
      </div>

      <div>
        <section className="rounded-lg border border-[#D9E4F5] bg-white p-4 shadow-[0_12px_34px_rgba(0,17,58,0.05)] md:p-6">
          {createMutation.isSuccess && (
            <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
              <span className="font-semibold">Admin created successfully.</span>
            </div>
          )}

          {adminsQuery.isError && (
            <div className="mb-5">
              <ApiErrorMessage error={adminsQuery.error} title="Could not load admins" />
            </div>
          )}

          {deleteMutation.isError && (
            <div className="mb-5">
              <ApiErrorMessage error={deleteMutation.error} title="Could not delete admin" />
            </div>
          )}

          {deleteMutation.isSuccess && (
            <div className="mb-5 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <FiCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-700" />
              <span className="font-semibold">Admin deleted successfully.</span>
            </div>
          )}

          {adminsQuery.isLoading ? (
            <div className="space-y-3">
              <div className="h-14 rounded-lg bg-[#F2F6FF]" />
              <div className="h-20 rounded-lg bg-[#F7FAFF]" />
              <div className="h-20 rounded-lg bg-[#F7FAFF]" />
            </div>
          ) : adminsQuery.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead className="bg-[#F7FAFF]">
                  <tr className="text-sm text-[#5E6675]">
                    <th className="rounded-l-lg px-4 py-3 font-bold">Full name</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Roles</th>
                    <th className="rounded-r-lg px-4 py-3 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5ECF8]">
                  {adminsQuery.data.map((admin) => (
                    <tr key={admin.id} className="bg-white">
                      <td className="px-4 py-4 font-bold text-[#00113A]">{admin.fullName}</td>
                      <td className="px-4 py-4 text-[#384152]">{admin.email}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-[#EAF1FF] px-3 py-1 text-sm font-bold text-[#0037AD]">
                          {admin.roles.join(', ') || 'Admin'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {confirmDeleteId === admin.id ? (
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
                              onClick={() => handleDelete(admin.id)}
                              disabled={deleteMutation.isPending}
                              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-70"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(admin.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                            aria-label={`Delete ${admin.email}`}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg bg-[#F7FAFF] px-6 py-12 text-center">
              <h2 className="text-xl font-bold text-[#00113A]">No admins yet</h2>
              <p className="mt-2 text-[#5E6675]">Create the first admin from the form.</p>
            </div>
          )}
        </section>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/45 px-4 py-6">
          <div className="w-full max-w-md rounded-lg border border-[#D9E4F5] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.18)]">
            <div className="flex items-center justify-between border-b border-[#E5ECF8] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold text-[#00113A]">Create admin</h2>
                <p className="mt-1 text-sm text-[#5E6675]">Role is sent as SuperAdmin automatically.</p>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#384152] transition-colors hover:bg-[#F6F8FC]"
                aria-label="Close create admin popup"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {createMutation.isError && (
                <div>
                  <ApiErrorMessage error={createMutation.error} title="Could not create admin" />
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Full name</span>
                <input
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Full name"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="admin@example.com"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-[#00113A]">Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                  placeholder="Strong password"
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={createMutation.isPending}
                  className="h-11 rounded-lg border border-[#D9E4F5] px-5 font-bold text-[#384152] transition-colors hover:bg-[#F6F8FC] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="h-11 rounded-lg bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
