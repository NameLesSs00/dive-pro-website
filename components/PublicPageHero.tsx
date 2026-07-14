'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Breadcrumb = {
  href?: string;
  label: string;
};

type PublicPageHeroProps = {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs?: Breadcrumb[];
  imagePosition?: string;
};

export default function PublicPageHero({
  title,
  description,
  imageSrc,
  imageAlt,
  breadcrumbs = [{ href: '/', label: 'Home' }, { label: title }],
  imagePosition = 'center',
}: PublicPageHeroProps) {
  return (
    <section className="relative flex min-h-[300px] w-full items-center overflow-hidden bg-[#00113A] md:min-h-[380px]">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="100vw"
        priority
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#00113A]/88 via-[#00113A]/62 to-[#00113A]/26" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#00113A]/25 via-transparent to-transparent" />

      <motion.div
        className="container relative z-10 mx-auto px-4 py-12 text-white md:px-8 md:py-16"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold text-white/82 md:mb-5 md:text-sm">
          {breadcrumbs.map((item, index) => (
            <span key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && <span className="text-white/55">&gt;</span>}
            </span>
          ))}
        </nav>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-normal md:text-6xl">{title}</h1>
        {description && (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/88 md:text-lg">{description}</p>
        )}
      </motion.div>
    </section>
  );
}
