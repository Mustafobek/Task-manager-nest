import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/createTask.dto";
import { TaskStatus } from "./taskStatus.enum";
import { GetTaskFilterDto } from "./dto/getTaskFilter.dto";
import { User } from "../auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const {status, search} = filterDto
    // querybuilder
    const query = this.createQueryBuilder('task')

    // user's tasks
    query.andWhere('task.userId = :userId', { userId: user.id })
    
    // filters
    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` }
      );
    }
    
    // query execution
    const tasks = await query.getMany()

    return tasks
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { description, title } = createTaskDto;
    const task = new Task()
    task.title = title
    task.description = description
    task.status = TaskStatus.OPEN;
    task.user = user

    await task.save()

    delete task.user
    return task
  }
}