'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { FiGrid, FiLogOut, FiShield, FiUsers } from 'react-icons/fi';
import AdminLoadingPanel from '@/components/admin/AdminLoadingPanel';
import { clearAuthSession } from '@/features/auth/authSlice';
import { clearStoredAuth } from '@/features/auth/authStorage';
import { selectAdminEmail, selectAdminRoles, selectAuthHydrated, selectAuthSession } from '@/features/auth/authSelectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/admins', label: 'Admins', icon: FiUsers },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectAuthHydrated);
  const session = useAppSelector(selectAuthSession);
  const email = useAppSelector(selectAdminEmail);
  const roles = useAppSelector(selectAdminRoles);

  useEffect(() => {
    if (hydrated && !session) {
      router.replace('/admin/login');
    }
  }, [hydrated, router, session]);

  if (!hydrated || !session) {
    return <AdminLoadingPanel />;
  }

  const handleLogout = () => {
    clearStoredAuth();
    dispatch(clearAuthSession());
    router.replace('/admin/login');
  };

  return (
    <section className="bg-[#F5F8FF] px-4 py-8 md:py-12">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-[#DCE8FF] bg-white p-5 shadow-[0_16px_50px_rgba(0,17,58,0.08)]">
          <div className="mb-8 rounded-2xl bg-[#0037AD] p-5 text-white">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <FiShield className="h-6 w-6" />
            </div>
            <p className="text-sm text-blue-100">Signed in as</p>
            <p className="mt-1 break-all text-base font-bold">{email}</p>
            <p className="mt-3 text-sm text-blue-100">{roles.join(', ') || 'Admin'}</p>
          </div>

          <nav className="space-y-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition-colors ${
                    isActive ? 'bg-[#EEF3FF] text-[#0037AD]' : 'text-[#384152] hover:bg-[#F7FAFF]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-[#DCE8FF] px-4 py-3 font-bold text-[#0037AD] transition-colors hover:bg-[#EEF3FF]"
          >
            <FiLogOut className="h-5 w-5" />
            Logout
          </button>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
