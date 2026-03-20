import type { Task, User, PaginatedResult } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export async function getTasks(page = 1, limit = 10): Promise<PaginatedResult<Task>> {
  const res = await fetch(`${BASE_URL}/tasks?page=${page}&limit=${limit}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json() as Promise<PaginatedResult<Task>>;
}

export async function getTask(id: number): Promise<Task> {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Task with id ${id} not found`);
  return res.json() as Promise<Task>;
}

export async function getUser(id: number): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`User with id ${id} not found`);
  return res.json() as Promise<User>;
}