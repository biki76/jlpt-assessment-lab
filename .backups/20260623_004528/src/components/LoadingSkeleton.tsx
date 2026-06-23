export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 bg-dark-700 rounded w-3/4" />
      <div className="h-4 bg-dark-700 rounded w-1/2" />
      <div className="grid grid-cols-1 gap-4 mt-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-dark-700 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
