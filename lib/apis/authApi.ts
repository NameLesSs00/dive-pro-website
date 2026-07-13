import { apiRequest } from '@/lib/api/client';
import {
  AuthSession,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  VerifyResetOtpRequest,
  VerifyResetOtpResponse,
} from '@/lib/models/auth';

export function login(payload: LoginRequest) {
  return apiRequest<AuthSession>('/auth/login', {
    method: 'POST',
    body: payload,
    action: 'auth.login',
  });
}

export function forgotPassword(payload: ForgotPasswordRequest, token?: string | null) {
  return apiRequest<null>('/auth/forgot-password', {
    method: 'POST',
    body: payload,
    token,
    action: 'auth.forgotPassword',
  });
}

export function verifyResetOtp(payload: VerifyResetOtpRequest, token?: string | null) {
  return apiRequest<VerifyResetOtpResponse>('/auth/verify-reset-otp', {
    method: 'POST',
    body: payload,
    token,
    action: 'auth.verifyResetOtp',
  });
}

export function resetPassword(payload: ResetPasswordRequest, token?: string | null) {
  return apiRequest<null>('/auth/reset-password', {
    method: 'POST',
    body: payload,
    token,
    action: 'auth.resetPassword',
  });
}
