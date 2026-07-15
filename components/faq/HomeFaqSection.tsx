'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHelpCircle } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import FaqAccordion from '@/components/faq/FaqAccordion';
import { usePublicFaqs } from '@/features/faqs/faqQueries';

export default function HomeFaqSection() {
  const faqsQuery = usePublicFaqs({ pageNumber: 1, pageSize: 5, search: '' });
  const faqs = faqsQuery.data?.faqs ?? [];

  return (
    <section className="bg-[#F8FAFE] py-12 md:py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#0037AD]">
              <FiHelpCircle className="h-7 w-7" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#0037AD]">Questions answered</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#00113A] md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-[#5E6675]">
              Quick answers about Dive Pro gear, sizing, product care, and getting the right support before your next dive.
            </p>
            <Link
              href="/faq"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0037AD] px-7 font-bold text-white transition-colors hover:bg-[#00267A]"
            >
              View all FAQ
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div>
            {faqsQuery.isLoading && (
              <div className="space-y-3">
                {[0, 1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-20 animate-pulse rounded-2xl bg-white" />
                ))}
              </div>
            )}

            {faqsQuery.isError && <ApiErrorMessage error={faqsQuery.error} title="Could not load FAQs" />}

            {!faqsQuery.isLoading && !faqsQuery.isError && faqs.length > 0 && (
              <FaqAccordion faqs={faqs} defaultOpenId={faqs[0]?.id} />
            )}

            {!faqsQuery.isLoading && !faqsQuery.isError && faqs.length === 0 && (
              <div className="rounded-2xl border border-[#E5ECF8] bg-white px-6 py-10 text-center">
                <h3 className="text-xl font-extrabold text-[#00113A]">No FAQs yet</h3>
                <p className="mt-2 text-[#5E6675]">Helpful answers will appear here once they are published.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
