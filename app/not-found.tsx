import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-[#F5F8FF] px-4 py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(65,123,255,0.2),transparent_28%),radial-gradient(circle_at_82%_8%,rgba(0,55,173,0.14),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 rounded-[28px] border border-[#DCE8FF] bg-white p-6 shadow-[0_24px_80px_rgba(0,17,58,0.12)] md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[300px] overflow-hidden rounded-[24px] bg-[#0037AD] md:min-h-[460px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_72%_76%,rgba(65,123,255,0.32),transparent_34%)]" />
          <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-between p-6 text-white md:min-h-[460px] md:p-8">
            <Image
              src="/logos/logoFooterWhite.png"
              alt="Dive Pro"
              width={150}
              height={60}
              className="object-contain"
            />
            <div>
              <p className="text-[96px] font-black leading-none tracking-normal md:text-[150px] lg:text-[190px]">
                404
              </p>
              <p className="mt-3 text-lg font-bold text-blue-50">Page not found</p>
            </div>
          </div>
        </div>

        <div className="py-2 lg:py-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0037AD]">Lost at sea</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-[#00113A] md:text-6xl">
            Looks like you swam away out of our reach.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#5E6675] md:text-xl">
            The page you are looking for is not on this dive route. Let&apos;s get you back to familiar waters.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0037AD] px-7 font-bold text-white transition-colors hover:bg-[#00267A]"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#0037AD] px-7 font-bold text-[#0037AD] transition-colors hover:bg-[#EEF3FF]"
            >
              Explore products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
