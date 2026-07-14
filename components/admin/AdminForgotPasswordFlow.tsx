'use client';

import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { FiCheckCircle, FiKey, FiLock, FiMail } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { forgotPassword, resetPassword, verifyResetOtp } from '@/lib/apis/authApi';

type ResetStep = 'email' | 'otp' | 'password' | 'done';

export default function AdminForgotPasswordFlow() {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const forgotMutation = useMutation({
    mutationFn: (payload: { email: string }) => forgotPassword(payload),
    onSuccess: () => {
      setStep('otp');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (payload: { email: string; otp: string }) => verifyResetOtp(payload),
    onSuccess: (response) => {
      setResetToken(response.data.resetToken);
      setStep('password');
    },
  });

  const resetMutation = useMutation({
    mutationFn: (payload: { email: string; resetToken: string; newPassword: string }) => resetPassword(payload),
    onSuccess: () => {
      setStep('done');
      setOtp('');
      setResetToken('');
      setNewPassword('');
    },
  });

  const handleEmailSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    forgotMutation.mutate({ email });
  };

  const handleOtpSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    verifyMutation.mutate({ email, otp });
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetMutation.mutate({ email, resetToken, newPassword });
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="mb-8 flex justify-center">
          <Image src="/logos/logoHeaderBlue.png" alt="Dive Pro" width={120} height={50} className="object-contain" />
        </div>

        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase text-[#0037AD]">Password reset</p>
          <h1 className="mt-2 text-3xl font-bold text-[#00113A]">
            {step === 'email' && 'Forgot password'}
            {step === 'otp' && 'Verify OTP'}
            {step === 'password' && 'Set new password'}
            {step === 'done' && 'Password reset'}
          </h1>
          <p className="mt-3 text-sm text-[#5E6675]">
            {step === 'email' && 'Enter the admin email to receive a reset OTP.'}
            {step === 'otp' && 'Enter the OTP sent to the admin email.'}
            {step === 'password' && 'Choose a new password for this admin account.'}
            {step === 'done' && 'You can now login with the new password.'}
          </p>
        </div>

        {forgotMutation.isError && step === 'email' && (
          <div className="mb-5">
            <ApiErrorMessage error={forgotMutation.error} title="Could not send OTP" />
          </div>
        )}

        {verifyMutation.isError && step === 'otp' && (
          <div className="mb-5">
            <ApiErrorMessage error={verifyMutation.error} title="Could not verify OTP" />
          </div>
        )}

        {resetMutation.isError && step === 'password' && (
          <div className="mb-5">
            <ApiErrorMessage error={resetMutation.error} title="Could not reset password" />
          </div>
        )}

        {step === 'email' && (
          <form className="space-y-5" onSubmit={handleEmailSubmit}>
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

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0037AD] px-6 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {forgotMutation.isPending ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form className="space-y-5" onSubmit={handleOtpSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#00113A]">OTP</span>
              <span className="relative block">
                <FiKey className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0037AD]" />
                <input
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  required
                  inputMode="numeric"
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] py-3 pl-12 pr-4 text-[#00113A] outline-none transition focus:border-[#0037AD] focus:bg-white"
                  placeholder="Enter OTP"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={verifyMutation.isPending}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0037AD] px-6 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 'password' && (
          <form className="space-y-5" onSubmit={handlePasswordSubmit}>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[#00113A]">New password</span>
              <span className="relative block">
                <FiLock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0037AD]" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                  className="h-12 w-full rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] py-3 pl-12 pr-4 text-[#00113A] outline-none transition focus:border-[#0037AD] focus:bg-white"
                  placeholder="New password"
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={resetMutation.isPending}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0037AD] px-6 font-bold text-white transition-colors hover:bg-[#00267A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {resetMutation.isPending ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <FiCheckCircle className="h-6 w-6" />
            </div>
            <Link
              href="/admin/login"
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0037AD] px-6 font-bold text-white transition-colors hover:bg-[#00267A]"
            >
              Back to login
            </Link>
          </div>
        )}

        {step !== 'done' && (
          <div className="mt-5 text-center">
            <Link href="/admin/login" className="text-sm font-bold text-[#0037AD] hover:underline">
              Back to login
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
