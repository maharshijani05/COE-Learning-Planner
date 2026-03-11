import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './create-task.dto';

export interface Task {
  id: number;
  title: string;
  description: string;
}

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  findAll(): Task[] {
    return this.tasks;
  }

  create(dto: CreateTaskDto): Task {
    const task = { id: this.nextId++, ...dto };
    this.tasks.push(task);
    return task;
  }
}
