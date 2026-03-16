import { TaskStatus } from '../enums/task-status.enum';

export class Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
}
