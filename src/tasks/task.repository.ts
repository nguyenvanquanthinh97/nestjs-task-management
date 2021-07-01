import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/search-and-filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async getTasksFilter(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = getTasksFilterDto;
    const query = this.createQueryBuilder('task');
    if (search) {
      query.andWhere(
        'task.title ILIKE :search OR task.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    return query.getMany();
  }
}
