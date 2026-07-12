import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CustomerExperiences from '@/components/CustomerExperiences';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { FiShield, FiAward, FiTool, FiHeadphones } from 'react-icons/fi';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] md:min-h-[600px] flex items-center justify-start overflow-hidden bg-[#00113A]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Home/heroImage.jpg"
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-white relative">
          <div className="max-w-3xl">
            <span className="text-[#417BFF] font-bold text-sm tracking-wider uppercase mb-4 block">Built for divers. Trusted everywhere.</span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-5 md:mb-8 leading-tight">
              Explore the<br />Underwater World<br />with Confidence
            </h1>
            <p className="text-base md:text-xl lg:text-2xl mb-6 md:mb-10 text-gray-200">
              Professional-grade diving equipment engineered for safety, performance, and unparalleled clarity in every environment.
            </p>
            <Link href="/products" className="inline-flex items-center justify-center bg-[#0037AD] hover:bg-[#00267A] text-white font-bold py-3 px-7 md:py-4 md:px-10 rounded-full transition-colors duration-300 shadow-lg hover:shadow-xl text-base md:text-lg">
              Explore products <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-12 md:py-24 bg-[#DCE8FF]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-[#00113A] mb-4">Equipment Categories</h2>
            <div className="w-16 h-1 bg-[#0037AD] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Category Cards */}
            {[
              { title: "Regulators", count: "15 Product", img: "/Home/diver.jpg" },
              { title: "B.C.D.s", count: "10 Product", img: "/Home/customerSection.png" },
              { title: "Masks & Snorkels", count: "10 Product", img: "/Home/diver.jpg" },
              { title: "Wetsuits", count: "15 Product", img: "/Home/customerSection.png" },
              { title: "Fins", count: "15 Product", img: "/Home/diver.jpg" },
              { title: "Bags & Accessories", count: "15 Product", img: "/Home/customerSection.png" },
            ].map((cat, idx) => (
              <Link href="/categories" key={idx} className="group bg-white rounded-[24px] p-3 md:p-6 flex flex-col hover:shadow-2xl transition-all duration-300">
                <div className="w-full h-32 sm:h-48 md:h-64 relative mb-3 md:mb-6 rounded-xl overflow-hidden bg-transparent flex items-center justify-center p-2 md:p-4">
                  <Image src={cat.img} alt={cat.title} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex flex-row justify-between items-end w-full mt-auto">
                  <div>
                    <h3 className="text-sm md:text-2xl font-bold text-[#0037AD]">{cat.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{cat.count}</p>
                  </div>
                  <FaArrowRight className="text-[#0037AD] text-xl transform group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:mt-16 text-center">
            <Link href="/categories" className="inline-flex items-center justify-center border-2 border-[#0037AD] text-[#0037AD] hover:bg-[#0037AD] hover:text-white font-bold py-3 px-10 rounded-full transition-colors duration-300 bg-white">
              View All Categories <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-12 md:py-24 bg-[#00113A]">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Best Selling Products</h2>
            <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
          </div>
          
          <div className="relative">
            {/* Left Arrow */}
            <button className="absolute left-[-20px] lg:left-[-70px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-[#00113A] transition-colors z-10 hidden md:flex shadow-lg">
              <FaArrowLeft />
            </button>
            
            <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
              <div className="min-w-[85%] snap-center flex-shrink-0 md:min-w-0">
                <ProductCard id="1" title="Jet Fin" subtitle="Fins" imageSrc="/Home/diver.jpg" />
              </div>
              <div className="min-w-[85%] snap-center flex-shrink-0 md:min-w-0">
                <ProductCard id="2" title="Coral Shorty Suit" subtitle="Wetsuits" imageSrc="/Home/customerSection.png" />
              </div>
              <div className="min-w-[85%] snap-center flex-shrink-0 md:min-w-0">
                <ProductCard id="3" title="Manta" subtitle="B.C.D.s" imageSrc="/Home/diver.jpg" />
              </div>
            </div>
            
            {/* Right Arrow */}
            <button className="absolute right-[-20px] lg:right-[-70px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white text-white flex items-center justify-center hover:bg-white hover:text-[#00113A] transition-colors z-10 hidden md:flex shadow-lg">
              <FaArrowRight />
            </button>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 md:mt-12 gap-4">
            <div className="w-4 h-4 rounded-full bg-white cursor-pointer hover:scale-110 transition-transform shadow-md"></div>
            <div className="w-4 h-4 rounded-full bg-white/40 cursor-pointer hover:scale-110 transition-transform"></div>
            <div className="w-4 h-4 rounded-full bg-white/40 cursor-pointer hover:scale-110 transition-transform"></div>
            <div className="w-4 h-4 rounded-full bg-white/40 cursor-pointer hover:scale-110 transition-transform"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Diving Equipment */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-xl md:text-4xl font-bold text-[#00113A] mb-4">Why Choose Our Diving Equipment</h2>
            <div className="w-16 h-1 bg-[#0037AD] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {[
              { icon: <FiShield />, title: "Safety First", desc: "Engineered to the highest safety standards for peace of mind underwater." },
              { icon: <FiAward />, title: "Premium Quality", desc: "Durable materials and precision craftsmanship for long-lasting performance." },
              { icon: <FiTool />, title: "Innovative Design", desc: "Thoughtful features that enhance comfort, ease of use, and efficiency." },
              { icon: <FiHeadphones />, title: "Expert Support", desc: "Our team is here to help you every step of the way before and after purchase." }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white border border-gray-100 text-[#0037AD] flex items-center justify-center text-4xl mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[#00113A] mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diving Tips & Guides */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-xl md:text-3xl font-bold text-center text-[#00113A] mb-6 md:mb-12">Diving Tips &amp; Guides</h2>
          
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
            {[
              { title: "How to Choose the Right Diving Regulator", desc: "Learn the key factors to consider when selecting a regulator for maximum performance and safety.", img: "/Home/diver.jpg" },
              { title: "Essential Diving Equipment for Beginners", desc: "A guide to must-have gear for new divers, including masks, fins, BCDs, and safety accessories.", img: "/Home/customerSection.png" },
              { title: "Finding the Perfect Wetsuit Fit", desc: "A complete guide to choosing the correct wetsuit for warmth, comfort, and performance in any condition.", img: "/Home/heroImage.jpg" }
            ].map((guide, idx) => (
              <div key={idx} className="min-w-[85%] snap-center flex-shrink-0 md:min-w-0 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col group cursor-pointer">
                <div className="relative w-full h-56 overflow-hidden">
                  <Image src={guide.img} alt={guide.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#00113A] mb-4 group-hover:text-[#0037AD] transition-colors">{guide.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1 leading-relaxed">{guide.desc}</p>
                  <Link href="/guides" className="text-[#0037AD] font-bold text-sm inline-flex items-center hover:underline">
                    Read more <FaArrowRight className="ml-2 text-xs" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 md:mt-16 text-center">
            <Link href="/guides" className="inline-flex items-center justify-center border-2 border-[#0037AD] text-[#0037AD] hover:bg-[#0037AD] hover:text-white font-bold py-3 px-8 rounded-full transition-colors duration-300">
              See More Guides <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dive Into Customer Experiences */}
      <CustomerExperiences />

      {/* About Dive Pro */}
      <section className="py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-4xl font-bold text-[#00113A] mb-8 relative inline-block">
                About Dive Pro
                <span className="absolute bottom-0 left-0 w-1/3 h-1 bg-[#417BFF] transform translate-y-4"></span>
              </h2>
              <div className="space-y-6 text-gray-600 mb-10 leading-relaxed mt-10 text-lg">
                <p>Creator of the Dive Pro company started diving in the 1990s year.</p>
                <p>The love for diving and variety of diving! <br/>The love for unknown new experiences and seeing The new!</p>
                <p>The new friendship and common interest opportunity to meet with the creators of large companies and immerse him in the study of new equipment and skills.</p>
              </div>
              <Link href="/about" className="inline-flex items-center justify-center bg-[#0037AD] hover:bg-[#00267A] text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 shadow-md">
                Read More About Us <FaArrowRight className="ml-2" />
              </Link>
            </div>

            {/* Mobile-only simple image — no absolute positioning */}
            <div className="block lg:hidden w-full h-56 relative rounded-2xl overflow-hidden shadow-lg">
              <Image src="/Home/diver.jpg" alt="Diver underwater" fill className="object-cover object-[90%_center]" />
            </div>

            {/* Desktop image layout with absolute positioning */}
            <div className="hidden lg:flex lg:w-1/2 relative h-[500px] items-center justify-center">
                {/* Images Layout */}
                <div className="absolute right-0 top-0 w-4/5 h-[400px] rounded-[40px] overflow-hidden shadow-xl z-0 border border-gray-100">
                  <Image src="/Home/diver.jpg" alt="Diver underwater" fill className="object-cover object-[90%_center]" />
                </div>
                <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full overflow-hidden shadow-2xl z-10 border-8 border-white bg-white flex items-center justify-center p-8">
                  <Image src="/Home/divepro-logo 1 [Vectorized].png" alt="Dive Pro Logo" width={180} height={120} className="object-contain" />
                </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
