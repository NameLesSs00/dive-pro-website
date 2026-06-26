import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiShare2, FiHeart } from 'react-icons/fi';

// --- Mock Data ---
const mockBlogs = [
  {
    slug: 'how-to-choose-the-right-diving-regulator',
    title: 'How to Choose the Right Diving Regulator',
    date: 'May 16, 2024',
    author: 'Dive Pro Editorial',
    readTime: '8 min read',
    mainImage: '/categories/dummy/1ba5f7c04f90e6dc8bca640f5d9edc45d7d0a801.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Your regulator is the most critical piece of equipment in your scuba kit. It is literally your life-support system underwater, delivering air from your tank to your lungs with precision and reliability.',
      },
      {
        type: 'paragraph',
        text: 'Choosing the right regulator depends on where you dive, how often you dive, and your technical requirements. Whether you\'re a warm-water recreational diver or a deep-sea professional, understanding the core components is essential.',
      },
      {
        type: 'h2',
        text: '1. Understanding the Two Stages',
      },
      {
        type: 'paragraph',
        text: 'A regulator works in two primary stages. The first stage attaches to your tank valve and reduces the high-pressure air from the cylinder to an intermediate pressure. The second stage—the part you breathe from—reduces that intermediate pressure to the ambient pressure of the water surrounding you.',
      },
      {
        type: 'h2',
        text: '2. Environmental Sealing',
      },
      {
        type: 'paragraph',
        text: 'If you plan on diving in cold water (below 10°C/50°F) or silty environments, you should look for an environmentally sealed first stage. This prevents water and contaminants from entering the internal mechanism, reducing the risk of freezing or corrosion.',
      },
      {
        type: 'h2',
        text: '3. DIN vs. Yoke Connections',
      },
      {
        type: 'paragraph',
        text: 'Yoke (International) connections are common in recreational diving and rental fleets. However, many technical and European divers prefer DIN connections because they are rated for higher pressures and provide a more secure, O-ring-protected seal.',
      },
      {
        type: 'paragraph',
        text: 'Modern regulators often come in both versions, or offer conversion kits to ensure you can dive anywhere in the world without compatibility issues.',
      }
    ]
  },
  {
    slug: 'essential-diving-equipment-for-beginners',
    title: 'Essential Diving Equipment for Beginners',
    date: 'May 10, 2024',
    author: 'Dive Pro Editorial',
    readTime: '6 min read',
    mainImage: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png',
    content: [
      {
        type: 'paragraph',
        text: 'Discover the must-have gear every new diver needs, including masks, fins, B.C.D.s, wetsuits, and safety accessories.'
      }
    ]
  },
  {
    slug: 'finding-the-perfect-wetsuit-fit',
    title: 'Finding the Perfect Wetsuit Fit',
    date: 'May 02, 2024',
    author: 'Dive Pro Editorial',
    readTime: '5 min read',
    mainImage: '/categories/dummy/47bff598e4daefba915551cf7e61f9851be1d723.png',
    content: [
      {
        type: 'paragraph',
        text: 'A complete guide to choosing the correct wetsuit size, thickness, and material for maximum comfort and thermal protection underwater.'
      }
    ]
  }
];

const relatedArticles = [
  {
    title: 'The Essential Dive Gear Maintenance Checklist',
    date: 'May 10, 2024',
    image: '/categories/dummy/c0be01179f2125de455b8d8b77ca579d8b567492.png',
    slug: '#'
  },
  {
    title: 'How to Find the Perfect Wetsuit Fit',
    date: 'May 02, 2024',
    image: '/categories/dummy/47bff598e4daefba915551cf7e61f9851be1d723.png',
    slug: '/blogs/finding-the-perfect-wetsuit-fit'
  },
  {
    title: '5 Safety Tips for Deep Water Exploration',
    date: 'April 28, 2024',
    image: '/categories/dummy/e647b72f6e734ad63a8a86884ca044180c4965cc.png',
    slug: '#'
  }
];

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const blog = mockBlogs.find(b => b.slug === resolvedParams.id);
  
  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-white pb-20">
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
          <Link href="/" className="hover:text-[#0037AD] transition-colors">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/blogs" className="hover:text-[#0037AD] transition-colors">Blogs</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#0037AD]">{blog.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* ── LEFT COLUMN: Main Content ── */}
          <div className="flex-1 lg:w-2/3 max-w-3xl">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#00113A] mb-6 leading-tight">
              {blog.title}
            </h1>
            
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{blog.readTime}</span>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <span className="font-semibold text-gray-700">Share:</span>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600">
                  <FiShare2 className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600">
                  <FiHeart className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] rounded-[24px] overflow-hidden mb-10">
              <Image
                src={blog.mainImage}
                alt={blog.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
              {blog.content.map((block, index) => {
                if (block.type === 'h2') {
                  return (
                    <h2 key={index} className="text-2xl md:text-3xl font-bold text-[#00113A] mt-10 mb-4">
                      {block.text}
                    </h2>
                  );
                }
                return (
                  <p key={index} className="leading-relaxed">
                    {block.text}
                  </p>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT COLUMN: Sidebar ── */}
          <aside className="w-full lg:w-1/3 max-w-md mx-auto lg:mx-0 flex flex-col gap-10">
            
            {/* Related Articles Box */}
            <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-gray-50 p-6 md:p-8">
              <h3 className="text-xl font-bold text-[#00113A] mb-6">Related Articles</h3>
              <div className="flex flex-col gap-6">
                {relatedArticles.map((article, idx) => (
                  <Link key={idx} href={article.slug} className="flex items-center gap-4 group">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#00113A] group-hover:text-[#0037AD] transition-colors leading-tight mb-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-gray-500">{article.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Shop Ad Block */}
            <div className="relative w-full h-[320px] rounded-[24px] overflow-hidden group shadow-md">
              <Image
                src="/blogs/shop.png"
                alt="Shop Professional Regulators"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Ad Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-xs font-bold text-white uppercase tracking-wider mb-2 opacity-90">
                  Editor's Choice
                </span>
                <h3 className="text-2xl font-bold text-white mb-6 leading-tight">
                  Shop Professional<br />Regulators
                </h3>
                <Link 
                  href="/categories" 
                  className="inline-flex items-center gap-2 text-white font-medium hover:underline w-max"
                >
                  Explore Collection
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>

          </aside>
          
        </div>
      </div>
    </div>
  );
}
