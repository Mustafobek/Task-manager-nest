import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/createTask.dto";
import { GetTaskFilterDto } from "./dto/getTaskFilter.dto";
import { TaskRepository } from "./task.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./task.entity";
import { TaskStatus } from "./taskStatus.enum";
import { User } from "../auth/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ) { }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user)
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Task with ${id} id not found`)
    }

    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user)
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user)

    task.status = status
    await task.save()

    return task
  }

  async deleteTask(id: number, user: User): Promise<{}> {
    const task = await this.getTaskById(id, user)
    await this.taskRepository.delete({ id: task.id, userId: user.id });

    return { message: 'Task was deleted successfully!' };
  }
}
