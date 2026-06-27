"use client";

import { useEffect } from "react";
import Image from "next/image";
import { FiX } from "react-icons/fi";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[#00113A]">Size Guide</h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative flex-1 p-4 bg-gray-50 overflow-auto min-h-[500px]">
          <div className="relative w-full h-full min-h-[500px]">
             <Image
              src="/products/SizeGuide.png"
              alt="Size Guide"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
