import Image from 'next/image';
import Link from 'next/link';
import { FiPhone, FiGlobe, FiMapPin } from 'react-icons/fi';
import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer
      className="text-white pt-12 pb-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #00247A 0%, #0339B7 131.22%)' }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">

          {/* Col 1: Brand */}
          <div className="flex flex-col">
            <Image
              src="/logos/logoFooterWhite.png"
              alt="Dive Pro"
              width={150}
              height={60}
              className="w-[150px] h-auto object-contain"
            />
            <p className="text-sm text-blue-100 leading-relaxed mt-4">
              Passionate about diving since 1995, providing trusted diving equipment and expert knowledge for divers of all experience levels.
            </p>
          </div>

          {/* Col 2: Quick action — spacer keeps heading aligned with Contact Us */}
          <div className="flex flex-col">
            <div className="h-[56px] hidden md:block" aria-hidden="true" />
            <h3 className="font-semibold text-lg mb-4">Quick action</h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link href="/about-us" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link></li>
              <li><Link href="/store-locator" className="hover:text-white transition-colors">Store locator</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact Us — bubbles floats absolute, spacer keeps heading aligned */}
          <div className="flex flex-col relative">
            <Image
              src="/logos/Bubles.png"
              alt=""
              width={50}
              height={50}
              className="w-[50px] h-auto object-contain opacity-60 absolute -top-8 hidden md:block"
            />
            <div className="h-[56px] hidden md:block" aria-hidden="true" />
            <h3 className="font-semibold text-lg mb-4">contact Us</h3>
            <ul className="space-y-3 text-sm text-blue-100">
              <li className="flex items-center gap-3">
                <FiPhone className="text-lg flex-shrink-0" />
                <span>+00 (123) 456 889</span>
              </li>
              <li className="flex items-center gap-3">
                <FiGlobe className="text-lg flex-shrink-0" />
                <span>contact@example.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-lg flex-shrink-0 mt-1" />
                <span>583 Main Street, NY, USA</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Follow Us — spacer keeps heading aligned with Contact Us */}
          <div className="flex flex-col">
            <div className="h-[56px] hidden md:block" aria-hidden="true" />
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-blue-300 transition-colors" aria-label="Facebook">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors" aria-label="Instagram">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors" aria-label="TikTok">
                <FaTiktok className="text-xl" />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors" aria-label="X (Twitter)">
                <FaXTwitter className="text-xl" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="container mx-auto px-4 mt-12 pt-6 border-t border-blue-700 text-center text-xs text-blue-200">
        Powered By{' '}
        <a
          href="https://tech-gear.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-all duration-300 hover:-translate-y-1 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        >
          Tech Gear Solutions
        </a>{' '}
        &copy; 2026 All Rights Reserved
      </div>
    </footer>
  );
}
