"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FaArrowLeft, FaArrowRight, FaQuoteLeft } from "react-icons/fa";

const REVIEWS = [
  {
    id: 1,
    author: "Alex",
    title: "PADI Open Water Diver",
    avatar: "/Home/avatar_1.png",
    bgColor: "#EEF3FF",
    text: `"I rely on my D&H Dry Snorkel for all my snorkeling trips. The innovative design with a splash guard and purge valve allows for easy breathing and prevents water from entering the snorkel. It's comfortable to use, even during long snorkeling sessions, and has enhanced my overall snorkeling experience."`,
  },
  {
    id: 2,
    author: "Sarah",
    title: "Advanced Open Water Diver",
    avatar: "/Home/avatar_2.png",
    bgColor: "#F0FFF4",
    text: `"Absolutely fantastic build quality. The neoprene is extremely flexible and provides excellent thermal protection in colder waters. I particularly love the robust zipper and reinforced knee pads — these add remarkable durability for rougher entry points on my regular deep-water dives."`,
  },
  {
    id: 3,
    author: "Marcus",
    title: "PADI Dive Instructor",
    avatar: "/Home/avatar_3.png",
    bgColor: "#FFFBEB",
    text: `"Great suit for the price. The fit is true to the sizing chart, and it looks really sleek underwater. As an instructor I recommend it to my students all the time. The only minor note is that the neck seal could be slightly tighter, but overall it performs exceptionally well."`,
  },
];

const TOTAL = REVIEWS.length;

export default function CustomerExperiences() {
  const [index, setIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const cardOpacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  const flyOff = async (direction: "left" | "right") => {
    if (isBusy) return;
    setIsBusy(true);
    const target = direction === "right" ? 700 : -700;
    await animate(x, target, { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] });
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

  const review = REVIEWS[index];
  const nextReview = REVIEWS[(index + 1) % TOTAL];

  return (
    <section className="relative py-16 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Home/customerSection.png"
          alt="Customer Experience Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00113A]/80 via-[#00113A]/70 to-[#00113A]/88" />
      </div>

      <div className="container mx-auto px-4 max-w-3xl relative z-10">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-14">
          <span className="text-[#7AAEFF] font-semibold text-sm tracking-widest uppercase block mb-3">
            What Our Divers Say
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white">
            Dive Into Customer Experiences
          </h2>
          <div className="w-16 h-1 bg-[#417BFF] mx-auto rounded-full mt-5" />
        </div>

        {/* Card Swipe Area */}
        <div className="w-full overflow-hidden">
          <div className="relative w-full h-[430px] md:h-[340px]">
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
              className="absolute inset-0 rounded-3xl px-8 py-8 md:px-12 md:py-10 shadow-2xl cursor-grab active:cursor-grabbing select-none flex flex-col justify-between"
            >
              {/* Decorative quote mark */}
              <FaQuoteLeft className="text-[#0037AD]/10 text-[80px] absolute top-6 left-8 pointer-events-none select-none" />

              {/* Badge */}
              <div className="inline-block bg-white/60 text-[#0037AD] text-xs font-bold px-3 py-1 rounded-full mb-3 w-fit">
                {review.id} of {TOTAL}
              </div>

              {/* Review text */}
              <p className="text-[#00113A] text-base md:text-lg leading-relaxed relative z-10 flex-1">
                {review.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-gray-300/40 mt-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#0037AD] shadow-md flex-shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-[#00113A] text-base">{review.author}</h4>
                  <p className="text-sm text-gray-500">{review.title}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation Buttons + Dots */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => flyOff("left")}
            disabled={isBusy}
            className="w-12 h-12 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-[#00113A] transition-all duration-300 disabled:opacity-40 cursor-pointer shadow-lg"
            aria-label="Previous review"
          >
            <FaArrowLeft />
          </button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isBusy && i !== index) {
                    const dir = i > index ? "right" : "left";
                    flyOff(dir);
                  }
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  i === index
                    ? "w-8 h-3 bg-white"
                    : "w-3 h-3 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => flyOff("right")}
            disabled={isBusy}
            className="w-12 h-12 rounded-full border-2 border-white/60 text-white flex items-center justify-center hover:bg-white hover:text-[#00113A] transition-all duration-300 disabled:opacity-40 cursor-pointer shadow-lg"
            aria-label="Next review"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
