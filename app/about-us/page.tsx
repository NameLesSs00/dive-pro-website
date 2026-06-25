import Image from 'next/image';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="bg-white">

      {/* ── SECTION 1: Hero ── */}
      <section className="relative w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px]">
        <Image
          src="/aboutUs/AboutUsHero.png"
          alt="About Us Hero"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 leading-tight tracking-wide">
              About Us
            </h1>
            <p className="text-white text-base md:text-xl leading-relaxed max-w-[300px] sm:max-w-md md:max-w-lg opacity-95">
              Passion For Diving Since 1995
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: Our Story ── */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#0037AD' }}>
              <span className="border-b-[3px] pb-1" style={{ borderColor: '#D9D9D9' }}>
                Our
              </span>{' '}
              Story
            </h2>
            <div className="space-y-4 text-base md:text-lg leading-relaxed" style={{ color: '#444650' }}>
              <p>
                Dive Pro was founded by a passionate diver whose journey began in 1995. What started as a love for exploring the underwater world quickly evolved into a mission to provide divers with reliable, high-quality equipment designed for safety, comfort, and performance.
              </p>
              <p>
                Through years of diving experience and strong relationships within the diving community, we gained valuable knowledge about professional gear, emerging technologies, and the evolving needs of divers. This passion led to the creation of Dive Pro—a trusted destination for diving enthusiasts seeking dependable equipment and expert guidance.
              </p>
              <p>
                Today, we continue to support divers of all experience levels by offering carefully selected products and sharing our expertise to help every customer make informed decisions.
              </p>
            </div>
          </div>

          {/* Image with Rotated Box Effect */}
          <div className="relative max-w-md mx-auto lg:max-w-none lg:mx-0 lg:ml-auto w-full aspect-square">
            {/* The rotated background box */}
            <div className="absolute inset-0 bg-[#F0F4FF] rounded-[32px] transform rotate-[4deg] origin-center z-0 transition-transform hover:rotate-0 duration-500" />
            
            {/* The actual image */}
            <div className="relative w-full h-full rounded-[32px] overflow-hidden z-10 shadow-md">
              <Image
                src="/aboutUs/StoryImage.png"
                alt="Our Story"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── SECTION 3: Mission & Vision ── */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          
          {/* Mission */}
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: '#B5CCFE4D' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: '#0037AD' }}>
              <span className="border-b-[3px] pb-1" style={{ borderColor: '#D9D9D9' }}>
                Our
              </span>{' '}
              Mission
            </h3>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#444650' }}>
              To provide divers with premium-quality equipment and professional guidance that enhance safety, confidence, and enjoyment beneath the surface.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-3xl p-8 md:p-10" style={{ backgroundColor: '#B5CCFE4D' }}>
            <h3 className="text-2xl md:text-3xl font-bold mb-5" style={{ color: '#0037AD' }}>
              <span className="border-b-[3px] pb-1" style={{ borderColor: '#D9D9D9' }}>
                Our
              </span>{' '}
              Vision
            </h3>
            <p className="text-base md:text-lg leading-relaxed" style={{ color: '#444650' }}>
              To become a trusted leader in the diving industry by connecting divers with innovative equipment, expert knowledge, and unforgettable underwater experiences.
            </p>
          </div>

        </div>
      </section>

      {/* ── SECTION 4: Why Choose Us ── */}
      <section className="container mx-auto px-4 pb-20 md:pb-32">
        
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#454444' }}>
            Why Choose Our Diving Equipment
          </h2>
          {/* Small blue underline */}
          <div className="h-1.5 w-20 mx-auto mt-4 rounded-full" style={{ backgroundColor: '#0037AD' }} />
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col group">
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src="/aboutUs/design.png"
                alt="Interactive Design"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h4 className="text-xl font-bold mb-3" style={{ color: '#0037AD' }}>
                Interactive Design
              </h4>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: '#454444' }}>
                Explore diving equipment in an interactive way and visualize different styles, colors, and configurations before making your selection.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col group">
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src="/aboutUs/material.jpg"
                alt="Material Selection"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h4 className="text-xl font-bold mb-3" style={{ color: '#0037AD' }}>
                Material Selection
              </h4>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: '#454444' }}>
                Learn about the premium materials used in our diving gear, including durability, flexibility, thermal protection, and underwater performance.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-50 flex flex-col group">
            <div className="relative w-full h-56 overflow-hidden">
              <Image
                src="/aboutUs/Size.png"
                alt="Size & Fit Guides"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col">
              <h4 className="text-xl font-bold mb-3" style={{ color: '#0037AD' }}>
                Size & Fit Guides
              </h4>
              <p className="text-sm md:text-base leading-relaxed" style={{ color: '#454444' }}>
                Access detailed sizing charts and fitting recommendations to ensure maximum comfort and performance during every dive.
              </p>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
