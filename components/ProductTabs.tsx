"use client";

import { useMemo, useState } from "react";
import { ProductSection } from "@/lib/models/product";

type ProductTabsProps = {
  sections?: ProductSection[];
};

const fallbackSections: ProductSection[] = [
  {
    id: 0,
    name: "Product Details",
    items: [],
  },
];

export default function ProductTabs({ sections = [] }: ProductTabsProps) {
  const tabs = useMemo(() => (sections.length ? sections : fallbackSections), [sections]);
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? 0);
  const activeSection = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className="mb-16 mt-16 w-full">
      <div className="flex overflow-x-auto border-b border-gray-200">
        <div className="flex min-w-max space-x-8 px-4 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative whitespace-nowrap pb-4 text-base font-medium transition-colors md:text-lg ${
                activeSection?.id === tab.id ? "text-[#0037AD]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.name}
              {activeSection?.id === tab.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-[#0037AD]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 px-4 md:px-0">
        {activeSection?.items?.length ? (
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
            {activeSection.items.map((item, index) => (
              <div key={`${item.key}-${index}`} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <span className="break-words text-sm text-gray-500 [overflow-wrap:anywhere] md:text-base">{item.key}</span>
                <span className="break-words text-right text-sm font-semibold text-[#00113A] [overflow-wrap:anywhere] md:text-base">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#F7FAFF] px-6 py-10 text-center text-sm font-semibold text-[#5E6675]">
            Product specifications will appear here once they are published.
          </div>
        )}
      </div>
    </div>
  );
}
