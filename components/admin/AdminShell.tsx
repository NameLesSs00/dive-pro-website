'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useSyncExternalStore } from 'react';
import {
  FiBookOpen,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiLayers,
  FiList,
  FiLogOut,
  FiPackage,
  FiMaximize,
  FiMapPin,
  FiMessageSquare,
  FiShield,
  FiUsers,
} from 'react-icons/fi';
import AdminLoadingPanel from '@/components/admin/AdminLoadingPanel';
import { clearAuthSession } from '@/features/auth/authSlice';
import { clearStoredAuth } from '@/features/auth/authStorage';
import { selectAdminEmail, selectAdminRoles, selectAuthHydrated, selectAuthSession } from '@/features/auth/authSelectors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { href: '/admin/admins', label: 'Admins', icon: FiUsers },
  { href: '/admin/categories', label: 'Categories', icon: FiLayers },
  { href: '/admin/subcategories', label: 'Subcategories', icon: FiList },
  { href: '/admin/sizes', label: 'Sizes', icon: FiMaximize },
  { href: '/admin/materials', label: 'Materials', icon: FiPackage },
  { href: '/admin/products', label: 'Products', icon: FiPackage },
  { href: '/admin/reviews', label: 'Reviews', icon: FiMessageSquare },
  { href: '/admin/locators', label: 'Locators', icon: FiMapPin },
  { href: '/admin/blog-categories', label: 'Blog Categories', icon: FiBookOpen },
  { href: '/admin/blogs', label: 'Blogs', icon: FiFileText },
  { href: '/admin/faqs', label: 'FAQs', icon: FiHelpCircle },
];

function subscribeToClientHydration(callback: () => void) {
  callback();
  return () => {};
}

function useHydratedClient() {
  return useSyncExternalStore(
    subscribeToClientHydration,
    () => true,
    () => false
  );
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const isClient = useHydratedClient();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectAuthHydrated);
  const session = useAppSelector(selectAuthSession);
  const email = useAppSelector(selectAdminEmail);
  const roles = useAppSelector(selectAdminRoles);

  useEffect(() => {
    if (isClient && hydrated && !session) {
      router.replace('/admin/login');
    }
  }, [hydrated, isClient, router, session]);

  if (!isClient || !hydrated || !session) {
    return <AdminLoadingPanel />;
  }

  const handleLogout = () => {
    clearStoredAuth();
    dispatch(clearAuthSession());
    router.replace('/admin/login');
  };

  return (
    <section className="min-h-screen bg-[#F5F7FB] text-[#00113A]">
      <aside className="border-b border-[#D9E4F5] bg-white lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="border-b border-[#E5ECF8] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#0037AD] text-white">
              <FiShield className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase text-[#5E6675]">Dive Pro Admin</p>
            <p className="mt-2 break-all text-sm font-bold text-[#00113A]">{email}</p>
            <p className="mt-2 text-xs font-semibold text-[#0037AD]">{roles.join(', ') || 'Admin'}</p>
          </div>

          <nav className="grid gap-1 p-3">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition-colors ${
                    isActive ? 'bg-[#EAF1FF] text-[#0037AD]' : 'text-[#384152] hover:bg-[#F6F8FC]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-[#E5ECF8] p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#D9E4F5] px-4 py-3 text-sm font-bold text-[#0037AD] transition-colors hover:bg-[#EAF1FF]"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 p-4 md:p-6 lg:ml-64 lg:p-8">{children}</main>
    </section>
  );
}
