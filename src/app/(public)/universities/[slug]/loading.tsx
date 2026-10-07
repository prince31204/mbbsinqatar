export default function UniversityLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-[#5B0F26] h-64 lg:h-80 w-full" />
      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 bg-[#F9FAFB] rounded-2xl" />
          <div className="h-48 bg-[#F9FAFB] rounded-2xl" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-[#F9FAFB] rounded-xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-[#F9FAFB] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
