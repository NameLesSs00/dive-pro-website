'use client';

import Link from 'next/link';
import { FiArrowRight, FiShield, FiUsers } from 'react-icons/fi';
import { selectAdminEmail, selectAdminRoles } from '@/features/auth/authSelectors';
import { useAppSelector } from '@/store/hooks';

export default function AdminDashboardPage() {
  const email = useAppSelector(selectAdminEmail);
  const roles = useAppSelector(selectAdminRoles);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#DCE8FF] bg-white p-6 shadow-[0_16px_50px_rgba(0,17,58,0.08)] md:p-8">
        <p className="text-sm font-bold uppercase text-[#0037AD]">Admin dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-[#5E6675]">
          A simple starting point for the admin area. Product and store management can plug into this shell next.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-[#DCE8FF] bg-white p-6 shadow-[0_16px_50px_rgba(0,17,58,0.06)]">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF3FF] text-[#0037AD]">
            <FiShield className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold uppercase text-[#0037AD]">Session</p>
          <h2 className="mt-2 break-all text-xl font-bold text-[#00113A]">{email}</h2>
          <p className="mt-2 text-[#5E6675]">{roles.join(', ') || 'Admin'}</p>
        </div>

        <Link
          href="/admin/admins"
          className="group rounded-3xl border border-[#DCE8FF] bg-white p-6 shadow-[0_16px_50px_rgba(0,17,58,0.06)] transition-transform hover:-translate-y-1"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0037AD] text-white">
            <FiUsers className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold uppercase text-[#0037AD]">First admin page</p>
          <h2 className="mt-2 text-xl font-bold text-[#00113A]">Manage admins</h2>
          <p className="mt-2 text-[#5E6675]">Create, list, and delete admin users from the auth endpoints.</p>
          <span className="mt-5 inline-flex items-center gap-2 font-bold text-[#0037AD]">
            Open admins
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}
