import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/search-and-filter-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
@Injectable()
export class TasksService {
  constructor(private taskRepository: TaskRepository) {}

  getTasksFilter(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasksFilter(getTasksFilterDto);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ id });

    if (!task) {
      throw new NotFoundException(`Task with id=${id} NOT FOUND`);
    }
    return task;
  }

  async deleteTaskById(id: string): Promise<string> {
    // we can use delete([id]) in here
    const task = await this.getTaskById(id);
    if (!task) throw new NotFoundException(`Task with id=${id} NOT FOUND`);
    await this.taskRepository.remove(task);
    return 'OK';
  }

  async updateTaskById(id: string, status: TaskStatus): Promise<Task> {
    // we can use update(id, {status}) in here
    const task = await this.getTaskById(id);
    if (!task) return;
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
