'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import PublicPageHero from '@/components/PublicPageHero';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const featureCards = [
  {
    title: 'Interactive Design',
    description:
      'Explore diving equipment in an interactive way and visualize different styles, colors, and configurations before making your selection.',
    image: '/aboutUs/design.png',
    alt: 'Interactive Design',
  },
  {
    title: 'Material Selection',
    description:
      'Learn about the premium materials used in our diving gear, including durability, flexibility, thermal protection, and underwater performance.',
    image: '/aboutUs/material.jpg',
    alt: 'Material Selection',
  },
  {
    title: 'Size & Fit Guides',
    description:
      'Access detailed sizing charts and fitting recommendations to ensure maximum comfort and performance during every dive.',
    image: '/aboutUs/Size.png',
    alt: 'Size and Fit Guides',
  },
];

export default function AboutUsPage() {
  return (
    <div className="bg-white">
      <PublicPageHero
        title="About Us"
        description="Passion for diving since 1995."
        imageSrc="/aboutUs/AboutUsHero.png"
        imageAlt="About Dive Pro"
      />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
          >
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 text-3xl font-bold md:text-4xl"
              style={{ color: '#0037AD' }}
            >
              <span className="border-b-[3px] pb-1" style={{ borderColor: '#D9D9D9' }}>
                Our
              </span>{' '}
              Story
            </motion.h2>

            <motion.div
              variants={staggerContainer}
              className="space-y-4 text-base leading-relaxed md:text-lg"
              style={{ color: '#444650' }}
            >
              {[
                'Dive Pro was founded by a passionate diver whose journey began in 1995. What started as a love for exploring the underwater world quickly evolved into a mission to provide divers with reliable, high-quality equipment designed for safety, comfort, and performance.',
                'Through years of diving experience and strong relationships within the diving community, we gained valuable knowledge about professional gear, emerging technologies, and the evolving needs of divers. This passion led to the creation of Dive Pro, a trusted destination for diving enthusiasts seeking dependable equipment and expert guidance.',
                'Today, we continue to support divers of all experience levels by offering carefully selected products and sharing our expertise to help every customer make informed decisions.',
              ].map((paragraph) => (
                <motion.p
                  key={paragraph}
                  variants={fadeUp}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            className="relative mx-auto aspect-square w-full max-w-md lg:ml-auto lg:mr-0 lg:max-w-none"
            initial={{ opacity: 0, x: 36, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.32 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 z-0 rounded-[32px] bg-[#F0F4FF]"
              initial={{ rotate: 7 }}
              whileInView={{ rotate: 4 }}
              whileHover={{ rotate: 0, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="relative z-10 h-full w-full overflow-hidden rounded-[32px] shadow-md"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/aboutUs/StoryImage.png"
                alt="Our Story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <motion.div
          className="flex flex-col gap-6 lg:flex-row lg:gap-10"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          {[
            {
              title: 'Mission',
              text: 'To provide divers with premium-quality equipment and professional guidance that enhance safety, confidence, and enjoyment beneath the surface.',
            },
            {
              title: 'Vision',
              text: 'To become a trusted leader in the diving industry by connecting divers with innovative equipment, expert knowledge, and unforgettable underwater experiences.',
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 rounded-3xl p-8 shadow-[0_16px_42px_rgba(0,17,58,0.06)] md:p-10"
              style={{ backgroundColor: '#B5CCFE4D' }}
            >
              <h3 className="mb-5 text-2xl font-bold md:text-3xl" style={{ color: '#0037AD' }}>
                <span className="border-b-[3px] pb-1" style={{ borderColor: '#D9D9D9' }}>
                  Our
                </span>{' '}
                {item.title}
              </h3>
              <p className="text-base leading-relaxed md:text-lg" style={{ color: '#444650' }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mx-auto px-4 pb-20 md:pb-32">
        <motion.div
          className="mb-12 text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl font-bold md:text-4xl" style={{ color: '#454444' }}>
            Why Choose Our Diving Equipment
          </h2>
          <motion.div
            className="mx-auto mt-4 h-1.5 w-20 rounded-full"
            style={{ backgroundColor: '#0037AD' }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
        >
          {featureCards.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-50 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h4 className="mb-3 text-xl font-bold" style={{ color: '#0037AD' }}>
                  {card.title}
                </h4>
                <p className="text-sm leading-relaxed md:text-base" style={{ color: '#454444' }}>
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
