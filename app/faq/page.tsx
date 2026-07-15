'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiHelpCircle, FiSearch } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import FaqAccordion from '@/components/faq/FaqAccordion';
import { usePublicFaqs } from '@/features/faqs/faqQueries';

export default function FaqPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const faqsQuery = usePublicFaqs({ pageNumber: 1, pageSize: 100, search });
  const faqs = faqsQuery.data?.faqs ?? [];

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <div className="bg-white text-[#00113A]">
      <section className="relative isolate flex min-h-[340px] items-center overflow-hidden bg-[#00113A] md:min-h-[430px]">
        <Image
          src="/Home/customerSection.png"
          alt="Dive Pro FAQ"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#00113A]/68" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <motion.div
          className="container relative z-10 mx-auto px-4 py-16 text-white md:px-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm font-bold text-white/82">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="text-white/55">&gt;</span>
            <span>FAQ</span>
          </nav>
          <p className="mb-3 w-fit rounded-full bg-white/14 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur">
            Help center
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Frequently Asked Questions</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/88 md:text-lg">
            Find clear answers about Dive Pro products, sizing, materials, care, and support.
          </p>
        </motion.div>
      </section>

      <section className="bg-[#F8FAFE] py-10 md:py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.form
            onSubmit={handleSearchSubmit}
            className="mx-auto mb-8 flex max-w-3xl flex-col gap-3 rounded-[24px] border border-[#D9E4F5] bg-white p-3 shadow-[0_18px_45px_rgba(0,17,58,0.06)] sm:flex-row"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <label className="relative block flex-1">
              <FiSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#0037AD]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-13 w-full rounded-lg border border-transparent bg-[#F7FAFF] py-4 pl-12 pr-4 text-[#00113A] outline-none focus:border-[#0037AD] focus:bg-white"
                placeholder="Search questions"
              />
            </label>
            <button
              type="submit"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-lg bg-[#0037AD] px-7 py-4 font-extrabold text-white transition-colors hover:bg-[#00267A]"
            >
              Search
              <FiArrowRight className="h-4 w-4" />
            </button>
          </motion.form>

          <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:items-start">
            <motion.aside
              className="rounded-[24px] border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_45px_rgba(0,17,58,0.06)] lg:sticky lg:top-24"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#0037AD]">
                <FiHelpCircle className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-2xl font-extrabold text-[#00113A]">Need quick help?</h2>
              <p className="mt-3 text-sm leading-6 text-[#5E6675]">
                Browse all published answers or search for a specific topic. If you still need help, our team can guide you.
              </p>
              <Link
                href="/contact-us"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#EAF1FF] px-5 text-sm font-extrabold text-[#0037AD] transition-colors hover:bg-[#0037AD] hover:text-white"
              >
                Contact us
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </motion.aside>

            <div className="min-w-0">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0037AD]">All answers</p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#00113A] md:text-3xl">
                    {faqs.length} {faqs.length === 1 ? 'question' : 'questions'}
                  </h2>
                </div>
                {search && <p className="text-sm font-semibold text-[#5E6675]">Search: &quot;{search}&quot;</p>}
              </div>

              {faqsQuery.isLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="h-20 animate-pulse rounded-2xl bg-white" />
                  ))}
                </div>
              )}

              {faqsQuery.isError && <ApiErrorMessage error={faqsQuery.error} title="Could not load FAQs" />}

              {!faqsQuery.isLoading && !faqsQuery.isError && faqs.length > 0 && (
                <FaqAccordion faqs={faqs} defaultOpenId={faqs[0]?.id} />
              )}

              {!faqsQuery.isLoading && !faqsQuery.isError && faqs.length === 0 && (
                <div className="rounded-[24px] border border-[#D9E4F5] bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(0,17,58,0.06)]">
                  <h3 className="text-2xl font-extrabold text-[#00113A]">No FAQs found</h3>
                  <p className="mx-auto mt-3 max-w-md text-[#5E6675]">
                    Try a different search term or check back after new answers are published.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
