import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class CustomValidationException extends HttpException {
  constructor(
    message: string,
    public readonly validationErrors: ValidationError[],
  ) {
    super({ message, validationErrors }, HttpStatus.BAD_REQUEST);
  }
}
