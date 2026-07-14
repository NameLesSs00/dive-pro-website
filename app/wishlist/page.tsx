import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiShare2, FiTrash2 } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'My Wish-list | Dive Pro',
  description: 'Review your saved Dive Pro gear and return to your favorite products.',
};

const wishlistItems = [
  {
    id: '1',
    category: 'Wetsuits',
    title: 'AquaLung 5mm Wetsuit',
    imageSrc: '/products/Dumm/iamge1.png',
  },
  {
    id: '2',
    category: 'B.C.D.s',
    title: 'Scubapro Glide X BCD',
    imageSrc: '/categories/dummy/2f9fb533b5b75d5a9ab81611b2379efb9bf8b195.png',
  },
];

export default function WishlistPage() {
  return (
    <div className="bg-white text-[#20232A]">
      <section className="relative min-h-[300px] overflow-hidden bg-[#003D8E] md:min-h-[380px]">
        <Image
          src="/Home/diver.jpg"
          alt="Diver underwater"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#003D8E]/35" />

        <div className="container relative z-10 mx-auto flex min-h-[300px] items-center justify-between gap-8 px-4 py-12 md:min-h-[380px] md:py-16">
          <div className="max-w-xl text-white">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-6xl">My Wish-list</h1>
            <p className="max-w-2xl text-sm leading-7 text-white/90 md:text-lg">
              Your saved gear for future adventures. Review your favourite and make them yours whenever you&apos;re ready.
            </p>
          </div>

          <div className="hidden h-40 w-40 flex-shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white shadow-[0_20px_60px_rgba(0,17,58,0.25)] backdrop-blur-sm md:flex lg:h-48 lg:w-48">
            <FiHeart className="h-16 w-16" />
          </div>
        </div>

        <div
          className="absolute -bottom-24 left-1/2 h-44 w-[125vw] -translate-x-1/2 rounded-[50%_50%_0_0] bg-white md:-bottom-28 md:h-56"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-16 left-1/2 h-44 w-[112vw] -translate-x-1/2 rounded-[50%_50%_0_0] border-t border-white/80"
          aria-hidden="true"
        />
      </section>

      <section className="container mx-auto px-4 pb-24 pt-10 md:pt-12 lg:pb-32">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base font-semibold text-[#20232A]">
            <span className="text-[#0037AD]">8</span> Items
          </p>

          <button
            type="button"
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full border border-[#B8C1D0] px-5 text-sm font-bold text-[#0037AD] transition-colors hover:border-[#0037AD] hover:bg-[#EEF3FF]"
          >
            <FiShare2 className="h-4 w-4" />
            Share Wishlist
          </button>
        </div>

        <div className="space-y-8">
          {wishlistItems.map((item) => (
            <article
              key={item.id}
              className="grid gap-6 rounded-2xl border border-[#B8C1D0] bg-white p-5 shadow-[0_10px_30px_rgba(0,17,58,0.04)] md:grid-cols-[190px_1fr_auto] md:items-center md:p-6 lg:grid-cols-[220px_1fr_180px]"
            >
              <Link
                href={`/products/${item.id}`}
                className="relative mx-auto h-40 w-full max-w-[210px] md:mx-0 md:h-48"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 80vw, 220px"
                  className="object-contain"
                />
              </Link>

              <div className="text-center md:text-left">
                <p className="mb-2 text-base font-bold text-[#0037AD]">{item.category}</p>
                <h2 className="text-xl font-bold text-[#20232A] md:text-2xl">{item.title}</h2>
              </div>

              <div className="flex items-center justify-center gap-4 md:justify-end lg:flex-col lg:items-end">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF3FF] text-[#0037AD] transition-transform hover:scale-105"
                    aria-label={`Keep ${item.title} in wishlist`}
                  >
                    <FiHeart className="h-5 w-5 fill-current" />
                  </button>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F6] text-[#20232A] transition-colors hover:bg-[#E6E9EF]"
                    aria-label={`Remove ${item.title} from wishlist`}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>

                <Link
                  href={`/products/${item.id}`}
                  className="inline-flex h-12 min-w-40 items-center justify-center rounded-xl bg-[#0037AD] px-6 text-base font-bold text-white transition-colors hover:bg-[#00267A]"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-full border border-[#0037AD] px-8 text-base font-bold text-[#0037AD] transition-colors hover:bg-[#EEF3FF]"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
