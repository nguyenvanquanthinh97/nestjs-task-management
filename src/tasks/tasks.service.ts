import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/search-and-filter-task.dto';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasksFilter(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    return this.taskRepository.getTasksFilter(getTasksFilterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({ id, user });

    if (!task) {
      throw new NotFoundException(`Task with id=${id} NOT FOUND`);
    }
    return task;
  }

  async deleteTaskById(id: string, user: User): Promise<string> {
    const { affected } = await this.taskRepository.delete({ id, user });
    if (affected === 0) {
      throw new NotFoundException(`Task with id=${id} NOT FOUND`);
    }

    return 'OK';
  }

  async updateTaskById(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    // we can use update(id, {status}) in here
    const task = await this.getTaskById(id, user);
    if (!task) return;
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
