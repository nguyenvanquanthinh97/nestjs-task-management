import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/search-and-filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    delete task.user;

    return task;
  }

  async getTasksFilter(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { search, status } = getTasksFilterDto;
    const query = this.createQueryBuilder('task').where('task.user = :userId', {
      userId: user.id,
    });
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
