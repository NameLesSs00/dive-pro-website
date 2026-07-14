import Image from 'next/image';
import Link from 'next/link';
import CustomerExperiences from '@/components/CustomerExperiences';
import HomeHero from '@/components/HomeHero';
import HomeShowcaseSections from '@/components/HomeShowcaseSections';
import { FaArrowRight } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <HomeHero />

      <HomeShowcaseSections />

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
