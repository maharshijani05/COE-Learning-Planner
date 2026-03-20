import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/tasks" className="font-bold text-gray-900 text-lg">
          Task Manager
        </Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link href="/tasks" className="text-gray-600 hover:text-gray-900 transition-colors">
            Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}