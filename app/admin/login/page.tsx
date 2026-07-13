import type { Metadata } from 'next';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | Dive Pro',
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
