export default function TaskDetailLoading() {
  return (
    <div className="max-w-2xl">
      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
        <div className="flex justify-between">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="mt-6 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}