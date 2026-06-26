"use client";

import Image from 'next/image';
import { useState } from 'react';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dummy WhatsApp number
    const waNumber = "201234567890";
    const waText = `Hello Dive Pro,\n\nMy name is ${name} (${email}).\n\n${message}`;
    const encodedText = encodeURIComponent(waText);
    
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, '_blank');
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen pb-24">
      
      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src="/categories/ContactHero.png"
          alt="Contact Us Hero"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Text content */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Get In Touch
            </h1>
            <p className="text-white text-base md:text-lg max-w-lg leading-relaxed opacity-90">
              We're here to help with any questions about our products and professional maritime services. Reach out to our experts today.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO BAR (Single unified card overlapping hero) ── */}
      <section className="relative z-10 -mt-20 container mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[28px] shadow-[0_8px_40px_rgb(0,0,0,0.08)] p-6 md:p-8 lg:p-6 xl:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-gray-200">

          {/* Location */}
          <div className="flex items-center gap-4 lg:px-6 xl:px-8">
            <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#EEF3FF', color: '#0037AD' }}>
              <FiMapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold mb-0.5" style={{ color: '#0037AD' }}>Location</p>
              <p className="text-sm text-gray-500">Hurghada, Red Sea, Egypt</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-4 lg:px-6 xl:px-8">
            <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#EEF3FF', color: '#0037AD' }}>
              <FiPhone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold mb-0.5" style={{ color: '#0037AD' }}>Phone</p>
              <p className="text-sm text-gray-500">+20 123 456 7890</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 lg:px-6 xl:px-8">
            <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#EEF3FF', color: '#0037AD' }}>
              <FiMail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold mb-0.5" style={{ color: '#0037AD' }}>Email</p>
              <p className="text-sm text-gray-500">info@divepro.com</p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="flex items-center gap-4 lg:px-6 xl:px-8">
            <div className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#EEF3FF', color: '#0037AD' }}>
              <FiClock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-base font-bold mb-0.5" style={{ color: '#0037AD' }}>Working Hours</p>
              <p className="text-sm text-gray-500">Saturday – Thursday<br/>9:00 AM – 6:00 PM</p>
            </div>
          </div>

        </div>
      </section>

      {/* ── MAIN CONTENT (Form & Map) ── */}
      <section className="container mx-auto px-4 md:px-8 mt-20">
        
        {/* Form Container */}
        <div className="bg-white rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.04)] p-8 md:p-12 max-w-3xl mx-auto mb-20">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#00113A' }}>
              Send Us a Message
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Have a question or need more information about our products? Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <form onSubmit={handleWhatsAppSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Your name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
              <textarea 
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black transition-colors resize-y"
              />
            </div>

            <div className="mt-2 text-center md:text-left">
              <button 
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-[#0037AD] text-white font-bold rounded-full hover:bg-[#002a85] transition-colors shadow-lg shadow-blue-900/20"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* Map Container */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold inline-block border-b-4 pb-2 border-[#0037AD]" style={{ color: '#00113A' }}>
              Find Us
            </h2>
          </div>
          <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden shadow-lg border border-gray-100 bg-gray-100">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3548.086218923439!2d33.838090625319786!3d27.216442720409084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1452873da7764f2b%3A0x221743fe3810f9ed!2sDive%20Shop!5e0!3m2!1sen!2seg!4v1782467384939!5m2!1sen!2seg" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </section>
    </div>
  );
}
