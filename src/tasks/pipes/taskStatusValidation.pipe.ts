import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../taskStatus.enum";

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROCESS,
    TaskStatus.DONE
  ]

  transform(
    value: any,
    // metadata: ArgumentMetadata
  ): any {
    value = value.toUpperCase()

    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`)
    }

    return value
  }

  private isValidStatus(status: any): Boolean {
    const index = this.allowedStatuses.indexOf(status)

    return index !== -1
  }
}
