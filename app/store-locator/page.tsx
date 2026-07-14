'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiHeadphones, FiMail, FiMapPin, FiNavigation, FiPhone, FiSearch } from 'react-icons/fi';
import ApiErrorMessage from '@/components/api/ApiErrorMessage';
import { usePublicLocators } from '@/features/locators/locatorQueries';
import { Locator } from '@/lib/models/locator';

function toTimeLabel(value: string) {
  if (!value) return '';
  const [hours = '', minutes = ''] = value.split(':');
  return hours && minutes ? `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}` : value;
}

function getDirectionsHref(locator: Locator) {
  return `https://www.google.com/maps/search/?api=1&query=${locator.latitude},${locator.longitude}`;
}

function getEmbedMapHref(locator: Locator) {
  const query = encodeURIComponent(`${locator.latitude},${locator.longitude}`);
  return `https://www.google.com/maps?q=${query}&z=15&output=embed`;
}

function formatHours(locator: Locator) {
  return `${toTimeLabel(locator.from)} - ${toTimeLabel(locator.to)}`;
}

export default function StoreLocatorPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLocatorId, setSelectedLocatorId] = useState<number | null>(null);
  const locatorsQuery = usePublicLocators({ pageNumber: 1, pageSize: 100, search });
  const locators = useMemo(() => locatorsQuery.data?.locators ?? [], [locatorsQuery.data?.locators]);
  const selectedLocator =
    locators.find((locator) => locator.id === selectedLocatorId) ?? locators[0] ?? null;

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <div className="bg-[#EAF3FD] pb-16 text-[#00113A]">
      <section className="container mx-auto flex min-h-[300px] flex-col justify-center px-4 pb-10 pt-12 md:min-h-[380px] md:px-8 md:pb-14 md:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-4xl font-extrabold leading-tight text-[#07326E] md:text-6xl">Store Locator</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5E6B7D] md:text-lg">
            Find authorized Dive Pro dealers, dive centers, and equipment partners near your location.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearchSubmit}
          className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-[1fr_1.4fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-[#405169]">Location</label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <FiMapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#1D63C4]" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="h-14 w-full rounded-lg border border-[#D9E4F5] bg-white pl-12 pr-4 text-[#00113A] shadow-sm outline-none focus:border-[#1D63C4]"
                  placeholder="Search by city, country, or area"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-lg bg-[#1D63C4] px-7 font-bold text-white shadow-[0_12px_28px_rgba(29,99,196,0.22)] transition-colors hover:bg-[#0037AD] sm:w-auto"
              >
                <FiSearch className="h-5 w-5" />
                Find Store
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-[#405169]">Category</label>
            <div className="relative">
              <select
                className="h-14 w-full appearance-none rounded-lg border border-[#D9E4F5] bg-white px-5 pr-12 text-[#5E6B7D] shadow-sm outline-none focus:border-[#1D63C4]"
                defaultValue="all"
              >
                <option value="all">All Locations</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5E6B7D]" />
            </div>
          </div>
        </motion.form>

        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-[400px_1fr]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <aside className="bg-white shadow-[0_16px_45px_rgba(0,17,58,0.08)]">
            <div className="border-b border-[#E5ECF8] px-6 py-6">
              <h2 className="text-xl font-extrabold text-[#1D2B3A]">Stores found ({locators.length})</h2>
            </div>

            <div className="max-h-[680px] space-y-4 overflow-y-auto p-5">
              {locatorsQuery.isLoading && (
                <>
                  <div className="h-36 rounded-2xl bg-[#F2F6FF]" />
                  <div className="h-36 rounded-2xl bg-[#F2F6FF]" />
                  <div className="h-36 rounded-2xl bg-[#F2F6FF]" />
                </>
              )}

              {locatorsQuery.isError && (
                <ApiErrorMessage error={locatorsQuery.error} title="Could not load store locators" />
              )}

              {!locatorsQuery.isLoading && !locatorsQuery.isError && locators.length === 0 && (
                <div className="rounded-2xl border border-[#E5ECF8] bg-[#F7FAFF] px-5 py-10 text-center">
                  <h3 className="font-bold text-[#00113A]">No stores found</h3>
                  <p className="mt-2 text-sm text-[#5E6B7D]">Try another city, country, or area.</p>
                </div>
              )}

              {locators.map((locator, index) => {
                const isSelected = selectedLocator?.id === locator.id;

                return (
                  <motion.button
                    key={locator.id}
                    type="button"
                    onClick={() => setSelectedLocatorId(locator.id)}
                    className={`w-full rounded-2xl border bg-white p-5 text-left transition-all ${
                      isSelected
                        ? 'border-[#1D63C4] shadow-[0_14px_35px_rgba(29,99,196,0.14)]'
                        : 'border-[#E5ECF8] hover:border-[#C5D8F5] hover:shadow-[0_10px_28px_rgba(0,17,58,0.08)]'
                    }`}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index, duration: 0.45 }}
                  >
                    <div className="flex gap-4">
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3FF] text-[#1D63C4]">
                        <FiMapPin className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="break-words text-base font-extrabold text-[#1D2B3A] [overflow-wrap:anywhere]">
                          {locator.name}
                        </h3>
                        <p className="mt-2 flex gap-2 break-words text-sm leading-5 text-[#7A8798] [overflow-wrap:anywhere]">
                          <FiMapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                          {locator.address}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm text-[#7A8798]">
                          <FiPhone className="h-4 w-4 flex-shrink-0" />
                          {locator.phone}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#30B56A]">
                          <span className="h-2 w-2 rounded-full bg-[#30B56A]" />
                          Open Today
                          <span className="font-semibold text-[#7A8798]">{formatHours(locator)}</span>
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </aside>

          <section className="relative min-h-[560px] overflow-hidden bg-white shadow-[0_16px_45px_rgba(0,17,58,0.08)]">
            {selectedLocator ? (
              <>
                <iframe
                  key={selectedLocator.id}
                  src={getEmbedMapHref(selectedLocator)}
                  title={`${selectedLocator.name} map`}
                  className="h-[560px] w-full border-0 md:h-[680px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <motion.div
                  key={`card-${selectedLocator.id}`}
                  className="absolute left-5 right-5 top-8 rounded-2xl bg-white p-4 shadow-[0_20px_55px_rgba(0,17,58,0.22)] md:left-auto md:right-10 md:top-36 md:w-[360px]"
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex gap-4">
                    <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#1D63C4]">
                      <FiMapPin className="h-9 w-9" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words font-extrabold text-[#1D2B3A] [overflow-wrap:anywhere]">
                        {selectedLocator.name}
                      </h3>
                      <p className="mt-2 break-words text-xs leading-5 text-[#7A8798] [overflow-wrap:anywhere]">
                        {selectedLocator.address}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-xs text-[#7A8798]">
                        <FiPhone className="h-3.5 w-3.5 flex-shrink-0" />
                        {selectedLocator.phone}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-xs font-bold text-[#30B56A]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#30B56A]" />
                        Open Today
                        <span className="font-semibold text-[#7A8798]">{formatHours(selectedLocator)}</span>
                      </p>
                    </div>
                  </div>

                  <a
                    href={getDirectionsHref(selectedLocator)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#1D63C4] font-bold text-white transition-colors hover:bg-[#0037AD]"
                  >
                    <FiNavigation className="h-4 w-4" />
                    Get Directions
                  </a>
                </motion.div>
              </>
            ) : (
              <div className="flex h-[560px] items-center justify-center bg-[#F7FAFF] px-6 text-center text-[#5E6B7D] md:h-[680px]">
                Select a locator to view it on the map.
              </div>
            )}
          </section>
        </motion.div>

        <motion.section
          className="mt-9 overflow-hidden rounded-2xl bg-[#1D63C4] text-white shadow-[0_18px_45px_rgba(0,17,58,0.16)]"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid md:grid-cols-[140px_1fr_220px]">
            <div className="flex items-center justify-center bg-white/10 p-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
                <FiHeadphones className="h-7 w-7" />
              </div>
            </div>
            <div className="p-7 md:p-8">
              <h2 className="text-2xl font-extrabold">Can&apos;t find a store near you?</h2>
              <p className="mt-2 text-white/82">Our team can help you locate the nearest Dive Pro partner.</p>
            </div>
            <div className="flex items-center justify-start bg-[#144D9B] p-7 md:justify-center md:p-8">
              <Link
                href="/contact-us"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-bold text-[#1D63C4] transition-colors hover:bg-[#EAF3FF]"
              >
                <FiMail className="h-4 w-4" />
                Contact Us
              </Link>
            </div>
          </div>
        </motion.section>
      </section>
    </div>
  );
}
