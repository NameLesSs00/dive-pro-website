import Image from 'next/image';
import Link from 'next/link';

// --- Data ---
const categories = [
  {
    slug: 'regulators',
    name: 'Regulators',
    count: 15,
    image: '/categories/dummy/1ba5f7c04f90e6dc8bca640f5d9edc45d7d0a801.jpg',
  },
  {
    slug: 'bcds',
    name: 'B.C.D.s',
    count: 10,
    image: '/categories/dummy/47bff598e4daefba915551cf7e61f9851be1d723.png',
  },
  {
    slug: 'masks-snorkels',
    name: 'Masks & Snorkels',
    count: 10,
    image: '/categories/dummy/c0be01179f2125de455b8d8b77ca579d8b567492.png',
  },
  {
    slug: 'wetsuits',
    name: 'Wetsuits',
    count: 15,
    image: '/categories/dummy/e647b72f6e734ad63a8a86884ca044180c4965cc.png',
  },
  {
    slug: 'fins',
    name: 'Fins',
    count: 15,
    image: '/categories/dummy/d65ad75af8f298fcaf546795cd58e7b70c15be84.png',
  },
  {
    slug: 'bags-accessories',
    name: 'Bags & Accessories',
    count: 15,
    image: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png',
  },
];

const featureCards = [
  {
    icon: '/categories/iconPREMIUM.png',
    title: 'PREMIUM QUALITY',
    subtitle: 'Carefully selected high quality diving equipment.',
  },
  {
    icon: '/categories/iconTRUSTED.png',
    title: 'TRUSTED BRANDS',
    subtitle: 'Top diving brands you can rely on.',
  },
  {
    icon: '/categories/iconSUPPORT.png',
    title: 'EXPERT SUPPORT',
    subtitle: "We're here to help you every step of the way.",
  },
];

// --- Page ---
export default function CategoriesPage() {
  return (
    <div className="bg-white">

      {/* ── SECTION 1: Hero ── */}
      <section className="relative w-full bg-[#00173A]">
        {/* Mobile Background (Cropped for height) */}
        <div className="md:hidden relative w-full h-[380px]">
          <Image
            src="/categories/CategoriesDesktop.png"
            alt="Categories Hero"
            fill
            sizes="100vw"
            priority
            className="object-cover object-bottom"
          />
        </div>
        
        {/* Desktop Background (Natural Aspect Ratio) */}
        <div className="hidden md:block w-full">
          <Image
            src="/categories/CategoriesDesktop.png"
            alt="Categories Hero"
            width={1920}
            height={800}
            priority
            className="w-full h-auto block"
          />
        </div>

        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-4 z-10 mt-[-20px] md:mt-[-40px]">
            {/* Breadcrumb */}
            <nav className="flex items-center text-sm font-medium text-white mb-3 md:mb-5 opacity-90">
              <Link href="/" className="hover:underline">Home</Link>
              <span className="mx-2">&gt;</span>
              <span>Categories</span>
            </nav>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight">
              Categories
            </h1>

            {/* Subtitle */}
            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed max-w-[280px] sm:max-w-sm md:max-w-md opacity-95">
              Discover a wide range of professional diving gear designed for safety, comfort, and performance.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Body ── */}
      <section className="container mx-auto px-4 py-16">

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group bg-white rounded-3xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {/* Product image */}
              <div className="flex items-center justify-center h-64 lg:h-72 pt-6 pb-2 px-6">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Card footer */}
              <div className="flex items-center justify-between px-8 py-6 mt-auto border-t border-gray-50">
                <div>
                  <p className="font-bold text-xl lg:text-2xl" style={{ color: '#0037AD' }}>
                    {cat.name}
                  </p>
                  <p className="text-base mt-1" style={{ color: '#6B7280' }}>
                    {cat.count} Product
                  </p>
                </div>
                {/* Arrow button */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: '#0037AD' }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="white"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="flex items-center gap-5 rounded-[20px] px-8 py-8 shadow-sm"
              style={{ backgroundColor: '#B5CCFE80' }}
            >
              <div
                className="flex-shrink-0 w-14 h-14 relative flex items-center justify-center rounded-full"
                style={{ backgroundColor: '#0041C91A' }}
              >
                <Image
                  src={card.icon}
                  alt={card.title}
                  width={24}
                  height={24}
                  className="w-6 h-auto object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm lg:text-base tracking-widest uppercase mb-1" style={{ color: '#00113A' }}>
                  {card.title}
                </p>
                <p className="text-sm lg:text-base leading-relaxed" style={{ color: '#444650' }}>
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}
