import { TaskStatus } from "../taskStatus.enum";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";

export class GetTaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.DONE, TaskStatus.IN_PROCESS])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
