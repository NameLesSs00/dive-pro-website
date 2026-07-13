import Image from 'next/image';

export default function AdminLoadingPanel() {
  return (
    <section className="relative overflow-hidden bg-[#EEF3FF] px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(65,123,255,0.18),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(0,55,173,0.14),transparent_30%)]" />
      <div className="relative mx-auto max-w-6xl rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(0,17,58,0.12)] md:p-10">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0037AD]">
              <Image
                src="/logos/logoFooterWhite.png"
                alt="Dive Pro"
                width={92}
                height={38}
                className="h-auto w-12 object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-[#0037AD]">Dive Pro Admin</p>
              <h1 className="text-2xl font-bold text-[#00113A] md:text-3xl">Loading workspace</h1>
            </div>
          </div>
          <div className="hidden h-12 w-12 animate-spin rounded-full border-4 border-[#DCE8FF] border-t-[#0037AD] md:block" />
        </div>

        <div className="grid gap-5 md:grid-cols-[260px_1fr]">
          <div className="space-y-3 rounded-2xl bg-[#F7FAFF] p-4">
            <div className="h-10 rounded-xl bg-[#DCE8FF]" />
            <div className="h-10 rounded-xl bg-[#E8EFFE]" />
            <div className="h-10 rounded-xl bg-[#E8EFFE]" />
          </div>
          <div className="space-y-4 rounded-2xl border border-[#DCE8FF] bg-white p-5">
            <div className="h-6 w-48 rounded-full bg-[#DCE8FF]" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-28 rounded-2xl bg-[#F2F6FF]" />
              <div className="h-28 rounded-2xl bg-[#F2F6FF]" />
              <div className="h-28 rounded-2xl bg-[#F2F6FF]" />
            </div>
            <div className="h-44 rounded-2xl bg-[#F7FAFF]" />
          </div>
        </div>
      </div>
    </section>
  );
}
