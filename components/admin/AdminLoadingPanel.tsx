import Image from 'next/image';

export default function AdminLoadingPanel() {
  return (
    <section className="min-h-screen bg-[#F3F6FB] px-4 py-10">
      <div className="mx-auto max-w-6xl rounded-lg border border-[#D9E4F5] bg-white p-6 shadow-[0_18px_50px_rgba(0,17,58,0.08)] md:p-8">
        <div className="mb-8 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#0037AD]">
              <Image
                src="/logos/logoFooterWhite.png"
                alt="Dive Pro"
                width={92}
                height={38}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-[#0037AD]">Dive Pro Admin</p>
              <h1 className="text-2xl font-bold text-[#00113A] md:text-3xl">Loading workspace</h1>
            </div>
          </div>
          <div className="hidden h-12 w-12 animate-spin rounded-full border-4 border-[#DCE8FF] border-t-[#0037AD] md:block" />
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_260px]">
          <div className="space-y-4 rounded-lg border border-[#D9E4F5] bg-white p-5">
            <div className="h-6 w-48 rounded bg-[#DCE8FF]" />
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-28 rounded-lg bg-[#F2F6FF]" />
              <div className="h-28 rounded-lg bg-[#F2F6FF]" />
              <div className="h-28 rounded-lg bg-[#F2F6FF]" />
            </div>
            <div className="h-44 rounded-lg bg-[#F7FAFF]" />
          </div>
          <div className="space-y-3 rounded-lg border border-[#D9E4F5] bg-[#F7FAFF] p-4">
            <div className="h-10 rounded bg-[#DCE8FF]" />
            <div className="h-10 rounded bg-[#E8EFFE]" />
            <div className="h-10 rounded bg-[#E8EFFE]" />
          </div>
        </div>
      </div>
    </section>
  );
}
