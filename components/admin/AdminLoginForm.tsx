'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { FiLock, FiMail } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { setAuthSession } from '@/features/auth/authSlice';
import { saveStoredAuth } from '@/features/auth/authStorage';
import { login } from '@/lib/apis/authApi';
import { useAppDispatch } from '@/store/hooks';

export default function AdminLoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <section className="bg-[#F5F8FF] px-4 py-12 md:py-20">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[28px] border border-[#DCE8FF] bg-white shadow-[0_24px_80px_rgba(0,17,58,0.12)] lg:grid-cols-[1fr_1.05fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#0037AD] p-10 text-white lg:block">
          <Image
            src="/Home/diver.jpg"
            alt="Diver underwater"
            fill
            priority
            sizes="50vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[#0037AD]/45" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <Image
              src="/logos/logoFooterWhite.png"
              alt="Dive Pro"
              width={150}
              height={60}
              className="h-auto w-[150px] object-contain"
            />
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-blue-100">Admin workspace</p>
              <h1 className="text-5xl font-bold leading-tight">Manage Dive Pro with clarity.</h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-blue-50">
                Login to manage admins and prepare the dashboard for the product backend.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 lg:p-14">
          <div className="mb-10 lg:hidden">
            <Image
              src="/logos/logoHeaderBlue.png"
              alt="Dive Pro"
              width={110}
              height={46}
              className="h-auto w-[110px] object-contain"
            />
          </div>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase text-[#0037AD]">Admin login</p>
            <h2 className="mt-2 text-3xl font-bold text-[#00113A] md:text-4xl">Welcome back</h2>
            <p className="mt-3 text-[#5E6675]">Use your admin credentials to continue.</p>
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
                  className="h-13 w-full rounded-2xl border border-[#DCE8FF] bg-[#F7FAFF] py-4 pl-12 pr-4 text-[#00113A] outline-none transition focus:border-[#0037AD] focus:bg-white"
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
                  className="h-13 w-full rounded-2xl border border-[#DCE8FF] bg-[#F7FAFF] py-4 pl-12 pr-4 text-[#00113A] outline-none transition focus:border-[#0037AD] focus:bg-white"
                  placeholder="Enter password"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="flex h-13 w-full items-center justify-center rounded-2xl bg-[#0037AD] px-6 py-4 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
