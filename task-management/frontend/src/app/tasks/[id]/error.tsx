'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function TaskDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Task not found</h2>
      <p className="text-gray-500 mb-6">{error.message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 transition-colors"
        >
          Try again
        </button>
        <Link
          href="/tasks"
          className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors"
        >
          Back to tasks
        </Link>
      </div>
    </div>
  );
}