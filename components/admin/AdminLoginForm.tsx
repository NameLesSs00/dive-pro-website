'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { FiLock, FiMail } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { setAuthSession } from '@/features/auth/authSlice';
import { saveStoredAuth } from '@/features/auth/authStorage';
import { selectAuthHydrated, selectAuthSession } from '@/features/auth/authSelectors';
import { login } from '@/lib/apis/authApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectAuthHydrated);
  const session = useAppSelector(selectAuthSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (hydrated && session) {
      router.replace('/admin/dashboard');
    }
  }, [hydrated, router, session]);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      saveStoredAuth(response.data);
      dispatch(setAuthSession(response.data));
      router.push('/admin/dashboard');
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logos/logoHeaderBlue.png"
            alt="Dive Pro"
            width={120}
            height={50}
            priority
            className="object-contain"
          />
        </div>

        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase text-[#0037AD]">Admin login</p>
          <h1 className="mt-2 text-3xl font-bold text-[#00113A]">Welcome back</h1>
          <p className="mt-3 text-sm text-[#5E6675]">Use your admin credentials to continue.</p>
        </div>

        {loginMutation.isError && (
          <div className="mb-6">
            <ApiErrorMessage error={loginMutation.error} title="Login failed" />
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#00113A]">Email</span>
            <span className="relative block">
              <FiMail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0037AD]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] py-3 pl-12 pr-4 text-[#00113A] outline-none transition focus:border-[#0037AD] focus:bg-white"
                placeholder="admin@example.com"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-[#00113A]">Password</span>
            <span className="relative block">
              <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0037AD]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] py-3 pl-12 pr-4 text-[#00113A] outline-none transition focus:border-[#0037AD] focus:bg-white"
                placeholder="Enter password"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0037AD] px-6 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/admin/forgot-password" className="text-sm font-bold text-[#0037AD] hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </section>
  );
}
