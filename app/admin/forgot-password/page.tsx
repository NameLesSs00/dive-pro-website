import type { Metadata } from 'next';
import AdminForgotPasswordFlow from '@/components/admin/AdminForgotPasswordFlow';

export const metadata: Metadata = {
  title: 'Forgot Password | Dive Pro Admin',
};

export default function AdminForgotPasswordPage() {
  return <AdminForgotPasswordFlow />;
}
