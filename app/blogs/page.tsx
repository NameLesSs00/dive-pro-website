import Image from 'next/image';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';

// --- Blog Data ---
const blogs = [
  {
    id: 1,
    slug: 'how-to-choose-the-right-diving-regulator',
    title: 'How to Choose the Right Diving Regulator',
    excerpt:
      'Learn the key factors to consider when selecting a regulator, from breathing performance and durability to diving conditions and experience level.',
    image: '/categories/dummy/1ba5f7c04f90e6dc8bca640f5d9edc45d7d0a801.jpg',
  },
  {
    id: 2,
    slug: 'essential-diving-equipment-for-beginners',
    title: 'Essential Diving Equipment for Beginners',
    excerpt:
      'Discover the must-have gear every new diver needs, including masks, fins, B.C.D.s, wetsuits, and safety accessories.',
    image: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png',
  },
  {
    id: 3,
    slug: 'finding-the-perfect-wetsuit-fit',
    title: 'Finding the Perfect Wetsuit Fit',
    excerpt:
      'A complete guide to choosing the correct wetsuit size, thickness, and material for maximum comfort and thermal protection underwater.',
    image: '/categories/dummy/47bff598e4daefba915551cf7e61f9851be1d723.png',
  },
];

const categories = [
  { label: 'All Articles', active: true },
  { label: 'Equipment Guides', active: false },
  { label: 'Safety Protocols', active: false },
  { label: 'Training Tips', active: false },
  { label: 'Marine Life', active: false },
];

// --- Page ---
export default function BlogsPage() {
  return (
    <div className="bg-white">

      {/* ── SECTION 1: Hero ── */}
      <section className="relative w-full bg-[#00173A]">
        {/* Mobile Background (Cropped for height) */}
        <div className="md:hidden relative w-full h-[380px]">
          <Image
            src="/categories/CategoriesDesktop.png"
            alt="Blogs Hero"
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
            alt="Blogs Hero"
            width={1920}
            height={800}
            priority
            className="w-full h-auto block"
          />
        </div>

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-4 z-10 w-full mt-[-20px] md:mt-[-40px]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Diving Guides &amp; Expert Tips
            </h1>
            <p className="text-white text-sm md:text-base leading-relaxed max-w-[300px] sm:max-w-md md:max-w-lg opacity-95">
              Explore expert advice, equipment guides, safety recommendations, and practical tips
              designed to help divers of all experience levels enjoy safer and more rewarding
              underwater adventures.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Body (Sidebar + Blog Grid) ── */}
      <section className="container mx-auto px-4 py-14 md:py-20">
        <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-full md:w-56 lg:w-64 flex-shrink-0">
            <div className="border-l-4 border-[#0037AD] pl-4 mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#0037AD' }}>Categories</h2>
            </div>
            <nav className="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-between ${
                    cat.active
                      ? 'bg-[#EEF3FF] text-[#0037AD]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#0037AD]'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.active && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </nav>

            {/* Filter by name Search Box */}
            <div className="mt-8 p-5 rounded-xl border border-gray-100 shadow-sm" style={{ backgroundColor: '#EEF3FF' }}>
              <h3 className="text-sm font-bold mb-3" style={{ color: '#0037AD' }}>
                Filter by name
              </h3>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search Article"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-transparent rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#0037AD] focus:ring-1 focus:ring-[#0037AD] shadow-sm"
                />
              </div>
            </div>
          </aside>

          {/* ── Blog Cards Grid ── */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative w-full h-52 overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2 leading-snug group-hover:opacity-80 transition-opacity" style={{ color: '#0037AD' }}>
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1 mb-5">
                      {blog.excerpt}
                    </p>
                    {/* Read More Button */}
                    <div>
                      <span
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-opacity group-hover:opacity-90"
                        style={{ backgroundColor: '#0037AD' }}
                      >
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* See More Button */}
            <div className="flex justify-center">
              <button
                className="flex items-center gap-3 px-16 py-4 rounded-full border-2 border-[#0037AD] text-[#0037AD] text-base font-semibold transition-all duration-200 hover:bg-[#0037AD] hover:text-white"
              >
                See More
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
