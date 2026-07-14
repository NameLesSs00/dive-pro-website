'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { FiAward, FiHeadphones, FiHeart, FiShield, FiTool } from 'react-icons/fi';

const categories = [
  { title: 'Regulators', count: '15 Products', img: '/categories/dummy/1ba5f7c04f90e6dc8bca640f5d9edc45d7d0a801.jpg' },
  { title: 'B.C.D.s', count: '10 Products', img: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png' },
  { title: 'Masks & Snorkels', count: '10 Products', img: '/categories/dummy/c0be01179f2125de455b8d8b77ca579d8b567492.png' },
  { title: 'Wetsuits', count: '15 Products', img: '/categories/dummy/e647b72f6e734ad63a8a86884ca044180c4965cc.png' },
  { title: 'Fins', count: '15 Products', img: '/categories/dummy/d65ad75af8f298fcaf546795cd58e7b70c15be84.png' },
  { title: 'Bags & Accessories', count: '15 Products', img: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png' },
];

const products = [
  { id: '1', title: 'Jet Fin', subtitle: 'Fins', imageSrc: '/products/Dumm/iamge3.png' },
  { id: '2', title: 'Coral Shorty Suit', subtitle: 'Wetsuits', imageSrc: '/products/Dumm/iamge1.png' },
  { id: '3', title: 'Manta', subtitle: 'B.C.D.s', imageSrc: '/products/Dumm/iamge4.png' },
];

const guides = [
  {
    title: 'How to Choose the Right Diving Regulator',
    desc: 'Learn the key factors to consider when selecting a regulator for maximum performance and safety.',
    img: '/categories/dummy/1ba5f7c04f90e6dc8bca640f5d9edc45d7d0a801.jpg',
  },
  {
    title: 'Essential Diving Equipment for Beginners',
    desc: 'A guide to must-have gear for new divers, including masks, fins, BCDs, and safety accessories.',
    img: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png',
  },
  {
    title: 'Finding the Perfect Wetsuit Fit',
    desc: 'A complete guide to choosing the correct wetsuit for warmth, comfort, and performance in any condition.',
    img: '/Home/heroImage.jpg',
  },
];

const features = [
  { icon: <FiShield />, title: 'Safety First', desc: 'Engineered to the highest safety standards for peace of mind underwater.' },
  { icon: <FiAward />, title: 'Premium Quality', desc: 'Durable materials and precision craftsmanship for long-lasting performance.' },
  { icon: <FiTool />, title: 'Innovative Design', desc: 'Thoughtful features that enhance comfort, ease of use, and efficiency.' },
  { icon: <FiHeadphones />, title: 'Expert Support', desc: 'Our team is here to help you every step of the way.' },
];

const sectionIntro = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      className="mb-8 text-center md:mb-14"
      variants={sectionIntro}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <p className={`mb-2 text-xs font-bold uppercase tracking-[0.22em] ${dark ? 'text-white/65' : 'text-[#0037AD]'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-2xl font-extrabold leading-tight md:text-4xl ${dark ? 'text-white' : 'text-[#00113A]'}`}>
        {title}
      </h2>
      <div className={`mx-auto mt-4 h-1 w-16 rounded-full ${dark ? 'bg-white/80' : 'bg-[#0037AD]'}`} />
    </motion.div>
  );
}

export default function HomeShowcaseSections() {
  return (
    <>
      <section className="bg-[#c4d6fd] py-12 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Shop by need" title="Equipment Categories" />

          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 lg:grid-cols-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                className="min-w-[88%] snap-center md:min-w-0"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/categories"
                  className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_18px_45px_rgba(0,17,58,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,17,58,0.16)]"
                >
                  <div className="relative mx-4 mt-4 flex h-72 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8FBFF] to-[#EAF1FF] p-6 md:h-64">
                    <Image
                      src={category.img}
                      alt={category.title}
                      fill
                      sizes="(max-width: 768px) 88vw, 33vw"
                      className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex items-end justify-between gap-4 p-5 md:p-6">
                    <div>
                      <h3 className="text-2xl font-extrabold leading-tight text-[#0037AD] md:text-xl lg:text-2xl">
                        {category.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-[#6B7280]">{category.count}</p>
                    </div>
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#0037AD] transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-[#0037AD] group-hover:text-white">
                      <FaArrowRight />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-5 text-center md:mt-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/categories" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0037AD] bg-white px-8 font-bold text-[#0037AD] transition-colors hover:bg-[#0037AD] hover:text-white">
              View All Categories <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#00113A] py-12 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading eyebrow="Popular picks" title="Best Selling Products" dark />

          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {products.map((product, index) => (
              <motion.article
                key={product.id}
                className="group min-w-[86%] snap-center overflow-hidden rounded-[30px] border border-white/12 bg-white p-4 shadow-[0_22px_65px_rgba(0,0,0,0.28)] md:min-w-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-[24px] bg-gradient-to-br from-[#F7FAFF] to-[#EAF1FF] p-8">
                  <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0037AD] shadow-md transition-transform group-hover:scale-110" aria-label={`Save ${product.title}`}>
                    <FiHeart className="h-5 w-5" />
                  </button>
                  <Image
                    src={product.imageSrc}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 86vw, 33vw"
                    className="object-contain p-8 transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-5">
                  <div>
                    <p className="text-sm font-bold text-[#6B7280]">{product.subtitle}</p>
                    <h3 className="mt-1 text-2xl font-extrabold text-[#0037AD]">{product.title}</h3>
                  </div>
                  <Link href={`/products/${product.id}`} className="inline-flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-[#0037AD] px-4 text-xs font-bold text-white transition-colors hover:bg-[#00267A]">
                    Details <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-2 md:mt-10">
            {products.map((product, index) => (
              <span key={product.id} className={`h-2.5 rounded-full ${index === 0 ? 'w-8 bg-white' : 'w-2.5 bg-white/35'}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <SectionHeading title="Why Choose Our Diving Equipment" />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="rounded-3xl border border-[#E8EEF8] bg-white p-5 text-center shadow-[0_12px_35px_rgba(0,17,58,0.05)] md:p-7"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.06, duration: 0.5 }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF1FF] text-3xl text-[#0037AD] md:h-20 md:w-20">
                  {feature.icon}
                </div>
                <h3 className="text-base font-extrabold text-[#00113A] md:text-lg">{feature.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#5E6675] md:text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F8FAFE] py-12 md:py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="Learn before you dive" title="Diving Tips & Guides" />

          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-5 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
            {guides.map((guide, index) => (
              <motion.article
                key={guide.title}
                className="group flex min-w-[86%] snap-center flex-col overflow-hidden rounded-[28px] border border-[#E5ECF8] bg-white shadow-[0_18px_45px_rgba(0,17,58,0.08)] md:min-w-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative h-56 overflow-hidden md:h-60">
                  <Image
                    src={guide.img}
                    alt={guide.title}
                    fill
                    sizes="(max-width: 768px) 86vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="line-clamp-2 text-xl font-extrabold leading-tight text-[#00113A] transition-colors group-hover:text-[#0037AD]">
                    {guide.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-[#5E6675]">{guide.desc}</p>
                  <Link href="/blogs" className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[#0037AD]">
                    Read more <FaArrowRight className="text-xs" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="mt-5 text-center md:mt-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/blogs" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0037AD] bg-white px-8 font-bold text-[#0037AD] transition-colors hover:bg-[#0037AD] hover:text-white">
              See More Guides <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
