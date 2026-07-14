'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PublicMotionShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin || prefersReducedMotion) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <motion.main
      key={pathname}
      className="flex-1"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
