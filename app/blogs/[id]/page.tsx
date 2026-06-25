export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-[#04328E] mb-6">Blog Detail {resolvedParams.id}</h1>
      <p className="text-gray-600">Blog detail content coming soon.</p>
    </div>
  );
}
