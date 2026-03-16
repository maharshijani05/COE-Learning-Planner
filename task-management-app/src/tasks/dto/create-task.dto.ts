import { IsString, IsNotEmpty, IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { TaskStatus } from '../enums/task-status.enum';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty({ message: 'Title must not be empty' })
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be OPEN, IN_PROGRESS, or DONE' })
  status?: TaskStatus;
}
