"use client";

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";

const DUMMY_REVIEWS = [
  {
    id: 1,
    author: "Alex",
    title: "Nature Lover",
    text: `"I rely on my GHI Dry Snorkel for all my snorkeling trips. The innovative design with a splash guard and purge valve allows for easy breathing and prevents water from entering the snorkel. It's comfortable to use, even during long snorkeling sessions, and has enhanced my overall snorkeling experience."`,
    bgColor: "#EEF3FF",
  },
  {
    id: 2,
    author: "Sarah",
    title: "Deep Sea Diver",
    text: `"Absolutely fantastic build quality. The neoprene is extremely flexible and provides excellent thermal protection in colder waters. I particularly like the robust zipper and the reinforced knee pads which add great durability for rougher entry points."`,
    bgColor: "#F3F4F6",
  },
  {
    id: 3,
    author: "Marcus",
    title: "Instructor",
    text: `"Great suit for the price. The fit is true to the sizing chart, and it looks really sleek underwater. The only minor issue is that the neck seal could be slightly tighter, but overall it performs exceptionally well during my weekend dives."`,
    bgColor: "#E8F5E9",
  },
];

const TOTAL = DUMMY_REVIEWS.length;

export default function ProductReviews() {
  const [index, setIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Shared motion value — both drag and buttons drive this
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const flyOff = async (direction: "left" | "right") => {
    if (isBusy) return;
    setIsBusy(true);
    const target = direction === "right" ? 700 : -700;
    await animate(x, target, { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] });
    // Reset x instantly (no visible flash — card changes at the same time)
    x.set(0);
    if (direction === "right") {
      setIndex((prev) => (prev + 1) % TOTAL);
    } else {
      setIndex((prev) => (prev - 1 + TOTAL) % TOTAL);
    }
    setIsBusy(false);
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      flyOff("right");
    } else if (info.offset.x < -threshold) {
      flyOff("left");
    } else {
      animate(x, 0, { type: "spring", stiffness: 250, damping: 30 });
    }
  };

  const review = DUMMY_REVIEWS[index];
  const nextReview = DUMMY_REVIEWS[(index + 1) % TOTAL];

  return (
    <div className="w-full mt-16 mb-24">

      {/* ── Rating + Card Slider ── */}
      <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-stretch mb-20">

        {/* Left: Star rating summary */}
        <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start justify-center">
          <div className="flex items-end gap-2 mb-4">
            <span className="text-6xl md:text-7xl font-bold text-[#00113A]">4.5</span>
            <FiStar className="w-10 h-10 text-yellow-400 fill-yellow-400 mb-2" />
          </div>
          <div className="bg-[#00113A] text-white text-sm px-4 py-1.5 rounded-full mb-8">
            653 reviews
          </div>

          <div className="w-full max-w-[250px] space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-3">{star}</span>
                <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{
                      width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Swipeable card */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 overflow-hidden">

          {/* Card area — full width */}
          <div className="w-full overflow-hidden">
            <div className="relative w-full" style={{ height: "360px" }}>

              {/* Ghost card peeking behind */}
              <div
                className="absolute inset-0 rounded-3xl scale-95 translate-y-3 opacity-40"
                style={{ backgroundColor: nextReview.bgColor }}
              />

              {/* Active swipeable card */}
              <motion.div
                key={index}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.9}
                onDragEnd={handleDragEnd}
                style={{
                  x,
                  rotate,
                  opacity: cardOpacity,
                  backgroundColor: review.bgColor,
                }}
                className="absolute inset-0 rounded-3xl p-8 md:p-10 shadow-md cursor-grab active:cursor-grabbing select-none"
              >
                {/* Decorative quote */}
                <div className="absolute top-8 right-10 text-[120px] font-serif leading-none text-black/10 pointer-events-none select-none">
                  "
                </div>

                {/* Badge */}
                <div className="inline-block bg-white/60 text-[#0037AD] text-xs font-bold px-3 py-1 rounded-full mb-5">
                  {review.id} of {TOTAL}
                </div>

                <p className="text-[#00113A] text-base md:text-lg leading-relaxed mb-8 relative z-10 min-h-[150px]">
                  {review.text}
                </p>

                <div className="pt-5 border-t border-gray-200/60">
                  <h4 className="font-bold text-[#00113A] text-base">{review.author}</h4>
                  <p className="text-sm text-gray-500">{review.title}</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Buttons below the card */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => flyOff("left")}
              disabled={isBusy}
              className="flex w-12 h-12 items-center justify-center rounded-full border border-[#0037AD] text-[#0037AD] hover:bg-blue-50 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => flyOff("right")}
              disabled={isBusy}
              className="flex w-12 h-12 items-center justify-center rounded-full border border-[#0037AD] text-[#0037AD] hover:bg-blue-50 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* ── Add Review ── */}
      <div className="w-full max-w-3xl">
        <h3 className="text-xl font-bold text-[#00113A] mb-2">Add Review</h3>
        <p className="text-gray-500 text-sm mb-6">
          Your email address will not be published. Required fields are marked{" "}
          <span className="text-red-500">*</span>
        </p>

        <div className="mb-6">
          <span className="block text-sm font-medium text-[#00113A] mb-2">Review</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isLit = star <= (hoveredRating || selectedRating);
              return (
                <button
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <FiStar
                    className={`w-7 h-7 transition-colors duration-150 ${
                      isLit
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {selectedRating > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              You selected <span className="font-semibold text-yellow-500">{selectedRating} star{selectedRating > 1 ? "s" : ""}</span>
            </p>
          )}
        </div>

        <div className="mb-6">
          <span className="block text-sm font-medium text-[#00113A] mb-2">Comment</span>
          <textarea
            className="w-full border border-gray-200 rounded-xl p-4 min-h-[120px] outline-none focus:border-[#0037AD] focus:ring-1 focus:ring-[#0037AD] transition-all resize-y"
            placeholder="Text..."
          />
        </div>

        <button className="w-full md:w-auto md:min-w-[200px] bg-[#0037AD] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-800 transition-colors cursor-pointer">
          Submit Review
        </button>
      </div>
    </div>
  );
}
