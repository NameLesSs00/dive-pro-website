'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { Faq } from '@/lib/models/faq';

type FaqAccordionProps = {
  faqs: Faq[];
  defaultOpenId?: number | null;
};

export default function FaqAccordion({ faqs, defaultOpenId = null }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(defaultOpenId ?? faqs[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openId === faq.id;

        return (
          <motion.article
            key={faq.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`overflow-hidden rounded-2xl border transition-colors ${
              isOpen ? 'border-[#BFD0F5] bg-white shadow-[0_18px_45px_rgba(0,17,58,0.08)]' : 'border-[#E5ECF8] bg-white'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-start justify-between gap-4 px-5 py-5 text-left md:px-6"
              aria-expanded={isOpen}
            >
              <span className="min-w-0 break-words text-base font-extrabold leading-6 text-[#00113A] [overflow-wrap:anywhere] md:text-lg">
                {faq.question}
              </span>
              <span
                className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                  isOpen ? 'bg-[#0037AD] text-white' : 'bg-[#EAF1FF] text-[#0037AD]'
                }`}
              >
                {isOpen ? <FiMinus className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="border-t border-[#E5ECF8] px-5 py-5 md:px-6">
                    <p className="whitespace-pre-line break-words text-sm leading-7 text-[#5E6675] [overflow-wrap:anywhere] md:text-base">
                      {faq.answer}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        );
      })}
    </div>
  );
}
