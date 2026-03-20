import { Suspense } from 'react';
import { getTasks } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import Pagination from '@/components/Pagination';

// This is a Server Component — no 'use client' directive
// Data is fetched on the server, not in the browser
interface SearchParams {
  page?: string;
}

export default async function TasksPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page ?? 1);
  const result = await getTasks(page, 10);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tasks</h1>

      {result.data.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="grid gap-3">
          {result.data.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      <Suspense>
        <Pagination page={result.page} totalPages={result.totalPages} total={result.total} />
      </Suspense>
    </div>
  );
}