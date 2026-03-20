import Link from 'next/link';
import { getTask, getUser } from '@/lib/api';
import TaskStatusBadge from '@/components/TaskStatusBadge';

// Dynamic route — [id] comes from the URL e.g. /tasks/5
export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await getTask(Number(params.id));
  const assignedUser = task.userId ? await getUser(task.userId) : null;

  return (
    <div className="max-w-2xl">
      <Link href="/tasks" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
        ← Back to tasks
      </Link>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mt-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <TaskStatusBadge status={task.status} />
        </div>

        {task.description && (
          <p className="mt-4 text-gray-600">{task.description}</p>
        )}

        <div className="mt-6 border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Assigned to</span>
            <p className="font-medium text-gray-900 mt-1">
              {assignedUser ? assignedUser.name : 'Unassigned'}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Task ID</span>
            <p className="font-medium text-gray-900 mt-1">#{task.id}</p>
          </div>
          <div>
            <span className="text-gray-400">Created</span>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Last updated</span>
            <p className="font-medium text-gray-900 mt-1">
              {new Date(task.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}