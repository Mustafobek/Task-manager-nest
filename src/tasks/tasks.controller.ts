import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { TasksService } from './tasks.service';
import { CreateTaskDto } from "./dto/createTask.dto";
import { GetTaskFilterDto } from "./dto/getTaskFilter.dto";
import { TaskStatusValidationPipe } from "./pipes/taskStatusValidation.pipe";
import { Task } from "./task.entity";
import { TaskStatus } from "./taskStatus.enum";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../auth/getUser.decorator";
import { User } from "../auth/user.entity";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }


  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }

  @Delete(':id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    return this.tasksService.deleteTask(id, user);
  }
}
