'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const heroSlides = [
  {
    src: '/Home/heroImage.jpg',
    alt: 'Diver underwater',
    objectPosition: 'object-[62%_center] md:object-[72%_center]',
    imageTransform: '',
  },
  {
    src: '/Home/hero2.webp',
    alt: 'Dive Pro diver exploring blue water',
    objectPosition: 'object-[58%_28%] md:object-[58%_24%]',
    imageTransform: 'scale-[1.28] translate-x-[14%] translate-y-[4%] md:scale-[1.36] md:translate-x-[18%] md:translate-y-[5%]',
  },
  {
    src: '/Home/hero1.webp',
    alt: 'Diving gear in open water',
    objectPosition: 'object-[62%_18%] md:object-[62%_16%]',
    imageTransform: 'scale-[1.28] translate-x-[14%] md:scale-[1.36] md:translate-x-[18%]',
  },
];

export default function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5200);

    return () => window.clearInterval(sliderTimer);
  }, []);

  const goToPreviousSlide = () => {
    setActiveSlide((current) => (current - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNextSlide = () => {
    setActiveSlide((current) => (current + 1) % heroSlides.length);
  };

  return (
    <section className="relative flex min-h-[500px] w-full items-center overflow-hidden bg-[#00113A] md:min-h-[620px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={heroSlides[activeSlide].src}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={heroSlides[activeSlide].src}
            alt={heroSlides[activeSlide].alt}
            fill
            sizes="100vw"
            priority={activeSlide === 0}
            className={`object-cover ${heroSlides[activeSlide].objectPosition} ${heroSlides[activeSlide].imageTransform}`}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-[#00113A]/86 via-[#00113A]/50 to-[#00113A]/8 md:from-[#00113A]/94 md:via-[#00113A]/68 md:to-[#00113A]/18" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00113A]/24 via-transparent to-transparent" />

      <div className="container relative z-10 mx-auto px-4 pb-16 pt-14 text-white md:pb-28">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="mb-4 block text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#83B0FF] md:text-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
          >
            Built for divers. Trusted everywhere.
          </motion.span>

          <motion.h1
            className="max-w-[21rem] text-[2rem] font-extrabold leading-[1.08] tracking-normal sm:max-w-xl sm:text-5xl md:max-w-2xl md:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            Explore the Underwater World with Confidence
          </motion.h1>

          <motion.p
            className="mt-5 max-w-[21rem] text-sm leading-7 text-white/88 sm:max-w-xl md:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Professional-grade diving equipment engineered for safety, performance, and unparalleled clarity in every environment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/products"
              className="mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-[#155CFF] px-6 text-sm font-bold text-white shadow-[0_16px_34px_rgba(21,92,255,0.28)] transition-colors hover:bg-[#0037AD] md:h-14 md:px-7"
            >
              Explore products
              <FaArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          <motion.div
            className="mt-8 flex items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={goToPreviousSlide}
              aria-label="Show previous hero image"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <FaChevronLeft className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-center gap-2">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show hero image ${index + 1}`}
                  aria-current={activeSlide === index}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goToNextSlide}
              aria-label="Show next hero image"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/28 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <FaChevronRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-[-6px] left-0 right-0 z-10 h-24 md:h-36" aria-hidden="true">
        <Image
          src="/Group 1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-fill"
        />
        <div className="absolute inset-x-0 bottom-[-8px] h-5 bg-[#F8FAFF]" />
      </div>
    </section>
  );
}
