import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/search-and-filter-task.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  // createTask(title: string, description: string): Task {
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id=${id} NOT FOUND`);
    }

    return found;
  }

  deleteTaskById(id: string): string {
    const taskIdx = this.tasks.findIndex((task) => task.id === id);
    if (taskIdx === -1)
      throw new NotFoundException(`Task with id=${id} NOT FOUND`);
    this.tasks.splice(taskIdx, 1);
    return 'OK';
  }

  updateTaskById(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    if (!task) return;
    task.status = status;
    return task;
  }

  getTasksFilter(getTasksFilterDto: GetTasksFilterDto): Task[] {
    const { search, status } = getTasksFilterDto;
    let result = this.tasks;
    if (search) {
      result = result.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    if (status) {
      result = result.filter((task) => task.status === status);
    }
    return result;
  }
}
