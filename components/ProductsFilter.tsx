"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function ProductsFilter() {
  const [price, setPrice] = useState(150);

  return (
    <div className="w-full bg-white md:bg-transparent md:pr-6 flex flex-col gap-8">
      
      {/* Search Bar (Moved from main page for smaller screens and cleaner sidebar) */}
      <div className="relative w-full">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search Product..." 
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#04328E] placeholder-[#9EA3A9] text-black transition-shadow" 
        />
      </div>

      {/* Category Section */}
      <div>
        <h2 className="text-xl font-bold mb-4" style={{ color: '#0037AD' }}>Filter</h2>
        
        <ul className="space-y-3">
          <li className="flex items-center justify-between text-[#0037AD] font-bold cursor-pointer">
            <span>All Wetsuits</span>
            <span className="bg-[#0037AD] text-white text-xs py-0.5 px-2 rounded-md">48</span>
          </li>
          <li className="flex items-center justify-between text-gray-500 hover:text-[#0037AD] cursor-pointer transition-colors">
            <span>Men's Full Suits</span>
            <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-md">12</span>
          </li>
          <li className="flex items-center justify-between text-gray-500 hover:text-[#0037AD] cursor-pointer transition-colors">
            <span>Women's Full Suits</span>
            <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-md">14</span>
          </li>
          <li className="flex items-center justify-between text-gray-500 hover:text-[#0037AD] cursor-pointer transition-colors">
            <span>Shorties & Springsuits</span>
            <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-md">8</span>
          </li>
          <li className="flex items-center justify-between text-gray-500 hover:text-[#0037AD] cursor-pointer transition-colors">
            <span>Hoods & Accessories</span>
            <span className="bg-gray-100 text-gray-500 text-xs py-0.5 px-2 rounded-md">14</span>
          </li>
        </ul>
        
        <div className="border-b border-gray-200 mt-6" />
      </div>

      {/* Thickness Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-[#00113A]">Thickness</h3>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0037AD] focus:ring-[#0037AD]" />
            <span className="text-gray-600 group-hover:text-[#0037AD] transition-colors">3mm (Tropical)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0037AD] focus:ring-[#0037AD]" />
            <span className="text-gray-600 group-hover:text-[#0037AD] transition-colors">5mm (Temperate)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0037AD] focus:ring-[#0037AD]" />
            <span className="text-gray-600 group-hover:text-[#0037AD] transition-colors">7mm (Cold Water)</span>
          </label>
        </div>

        <div className="border-b border-gray-200 mt-6" />
      </div>

      {/* Price Range Section */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-[#00113A]">Price Range</h3>
        
        <div className="px-2">
          {/* Mock Range Slider */}
          <input 
            type="range" 
            min="150" 
            max="850" 
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0037AD]"
          />
          <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
            <span>${price}</span>
            <span>$850+</span>
          </div>
        </div>
      </div>

    </div>
  );
}
