import Link from 'next/link';
import type { Task } from '@/types';
import TaskStatusBadge from './TaskStatusBadge';

export default function TaskCard({ task }: { task: Task }) {
  return (
    <Link href={`/tasks/${task.id}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-semibold text-gray-900 text-base">{task.title}</h2>
          <TaskStatusBadge status={task.status} />
        </div>

        {task.description && (
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{task.description}</p>
        )}

        <p className="mt-3 text-xs text-gray-400">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}