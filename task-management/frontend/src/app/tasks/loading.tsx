// Next.js renders this automatically while tasks/page.tsx is fetching data
export default function TasksLoading() {
  return (
    <div>
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6" />
      <div className="grid gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between">
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-4 w-72 bg-gray-100 rounded animate-pulse mt-3" />
          </div>
        ))}
      </div>
    </div>
  );
}