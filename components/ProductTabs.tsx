"use client";

import { useState } from "react";

// Mock data schema as requested by user's "yes"
const TABS_DATA = [
  {
    id: "tech-specs",
    label: "Technical Specifications",
    content: {
      "Product Type": "Shorty Wetsuit",
      "Water Conditions": "Warm Water",
      "Thickness": "3mm",
      "Closure Type": "YKK Back Zipper",
      "Gender": "Men",
      "Seam Construction": "Glued & Double-Stitched Flat Seams",
      "Material": "Premium Neoprene",
      "Thermal Features": "Titanium-Coated Collar, Sleeves & Legs",
      "Sleeve Adjustment": "Velcro Adjustable Sleeves",
      "Fit": "Preformed Anatomical Cut"
    }
  },
  {
    id: "design-comfort",
    label: "Design & Comfort",
    content: {
      "Design Style": "Modern Ergonomic",
      "Flexibility": "High Stretch Panels",
      "Neckline": "Comfort Glideskin",
      "Movement": "Unrestricted Range",
      "Inner Lining": "Soft Plush Lining"
    }
  },
  {
    id: "advanced-protection",
    label: "Advanced Protection",
    content: {
      "UV Protection": "UPF 50+",
      "Abrasion Resistance": "Reinforced Shoulders",
      "Sting Protection": "Jellyfish Shield",
      "Durability": "Heavy Duty Thread"
    }
  },
  {
    id: "zipper-system",
    label: "Zipper System",
    content: {
      "Main Zipper": "Heavy Duty #10 YKK",
      "Water Seal": "Inner Gusset Flap",
      "Pull Cord": "Extended Length with Grip",
      "Locking Mechanism": "Velcro Tab Closure"
    }
  },
  {
    id: "recommended-for",
    label: "Recommended For",
    content: {
      "Primary Activity": "Scuba Diving & Snorkeling",
      "Skill Level": "Beginner to Professional",
      "Environment": "Tropical to Sub-tropical waters",
      "Water Temp Range": "72°F - 85°F (22°C - 29°C)"
    }
  }
];

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState(TABS_DATA[0].id);

  const activeContent = TABS_DATA.find(t => t.id === activeTab)?.content || {};

  return (
    <div className="w-full mt-16 mb-16">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200">
        <div className="flex space-x-8 min-w-max px-4 md:px-0">
          {TABS_DATA.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-base md:text-lg font-medium transition-colors relative whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#0037AD]"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0037AD] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content Grid */}
      <div className="mt-8 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {Object.entries(activeContent).map(([key, value], idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-500 text-sm md:text-base">{key}</span>
              <span className="text-[#00113A] font-semibold text-sm md:text-base text-right">{value as string}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
