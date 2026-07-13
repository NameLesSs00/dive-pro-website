'use client';

import { FormEvent, useState } from 'react';
import { FiRefreshCw, FiTrash2, FiUserPlus } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { useAdminUsers, useCreateAdminUser, useDeleteAdminUser } from '@/features/admins/adminUsersQueries';
import { selectAccessToken } from '@/features/auth/authSelectors';
import { useAppSelector } from '@/store/hooks';

const initialForm = {
  email: '',
  password: '',
  fullName: '',
  role: 'SuperAdmin',
};

export default function AdminsPage() {
  const token = useAppSelector(selectAccessToken);
  const [form, setForm] = useState(initialForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const adminsQuery = useAdminUsers(token);
  const createMutation = useCreateAdminUser(token);
  const deleteMutation = useDeleteAdminUser(token);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createMutation.mutate(form, {
      onSuccess: () => {
        setForm(initialForm);
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setConfirmDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#DCE8FF] bg-white p-6 shadow-[0_16px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase text-[#0037AD]">Admin users</p>
            <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Admins</h1>
            <p className="mt-3 max-w-2xl text-[#5E6675]">
              Manage users that can access the admin dashboard.
            </p>
          </div>

          <button
            type="button"
            onClick={() => adminsQuery.refetch()}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full border border-[#DCE8FF] px-5 font-bold text-[#0037AD] transition-colors hover:bg-[#EEF3FF]"
          >
            <FiRefreshCw className={`h-4 w-4 ${adminsQuery.isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-[#DCE8FF] bg-white p-6 shadow-[0_16px_50px_rgba(0,17,58,0.06)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#0037AD]">
              <FiUserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#00113A]">Create admin</h2>
              <p className="text-sm text-[#5E6675]">Backend validation errors appear below.</p>
            </div>
          </div>

          {createMutation.isError && (
            <div className="mb-5">
              <ApiErrorMessage error={createMutation.error} title="Could not create admin" />
            </div>
          )}

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#00113A]">Full name</span>
              <input
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                required
                className="h-12 w-full rounded-2xl border border-[#DCE8FF] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
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
                className="h-12 w-full rounded-2xl border border-[#DCE8FF] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
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
                className="h-12 w-full rounded-2xl border border-[#DCE8FF] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="Strong password"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#00113A]">Role</span>
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-[#DCE8FF] bg-[#F7FAFF] px-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
              >
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#0037AD] px-5 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {createMutation.isPending ? 'Creating...' : 'Create admin'}
            </button>
          </div>
        </form>

        <section className="rounded-3xl border border-[#DCE8FF] bg-white p-4 shadow-[0_16px_50px_rgba(0,17,58,0.06)] md:p-6">
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

          {adminsQuery.isLoading ? (
            <div className="space-y-3">
              <div className="h-14 rounded-2xl bg-[#F2F6FF]" />
              <div className="h-20 rounded-2xl bg-[#F7FAFF]" />
              <div className="h-20 rounded-2xl bg-[#F7FAFF]" />
            </div>
          ) : adminsQuery.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-sm text-[#5E6675]">
                    <th className="px-4 py-2 font-bold">Full name</th>
                    <th className="px-4 py-2 font-bold">Email</th>
                    <th className="px-4 py-2 font-bold">Roles</th>
                    <th className="px-4 py-2 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminsQuery.data.map((admin) => (
                    <tr key={admin.id} className="rounded-2xl bg-[#F7FAFF]">
                      <td className="rounded-l-2xl px-4 py-4 font-bold text-[#00113A]">{admin.fullName}</td>
                      <td className="px-4 py-4 text-[#384152]">{admin.email}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-[#EEF3FF] px-3 py-1 text-sm font-bold text-[#0037AD]">
                          {admin.roles.join(', ') || 'Admin'}
                        </span>
                      </td>
                      <td className="rounded-r-2xl px-4 py-4 text-right">
                        {confirmDeleteId === admin.id ? (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-full border border-[#DCE8FF] px-4 py-2 text-sm font-bold text-[#384152]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(admin.id)}
                              disabled={deleteMutation.isPending}
                              className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-70"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(admin.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100"
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
            <div className="rounded-2xl bg-[#F7FAFF] px-6 py-12 text-center">
              <h2 className="text-xl font-bold text-[#00113A]">No admins yet</h2>
              <p className="mt-2 text-[#5E6675]">Create the first admin from the form.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
