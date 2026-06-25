export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-[#04328E] mb-6">Product Detail {resolvedParams.id}</h1>
      <p className="text-gray-600">Product detail content coming soon.</p>
    </div>
  );
}
