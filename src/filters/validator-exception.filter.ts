import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  BadRequestExceptionResponse,
  isValidationErrorArray,
  TypedValidationError,
  ValidationErrorData,
} from 'src/types';

// Re-format error response of class-validator to fit Google JSON style
// NestJS ValidationPipe throws BadRequestException with validation errors
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost): void {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    let message = 'Validation Error';
    let data: ValidationErrorData[] | ValidationErrorData | null = null;

    // Check if response contains ValidationError array (from ValidationPipe)
    if (isValidationErrorArray(exceptionResponse)) {
      const messages: string[] = [];

      data = exceptionResponse.map((err: TypedValidationError) => {
        const constraints = err.constraints
          ? Object.values(err.constraints)
          : [];
        if (constraints.length) {
          messages.push(...constraints);
        }
        return {
          property: err.property,
          constraints: err.constraints || undefined,
          children: this.mapChildren(err.children),
        };
      });

      message = messages.length > 0 ? messages.join(', ') : message;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      // Handle BadRequestException with message property
      const errorResponse = exceptionResponse as BadRequestExceptionResponse;
      message =
        typeof errorResponse.message === 'string'
          ? errorResponse.message
          : Array.isArray(errorResponse.message)
            ? errorResponse.message.join(', ')
            : message;
      data = null;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      data = null;
    }

    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      status: false,
      data,
      message,
    });
  }

  private mapChildren(
    children: TypedValidationError[] | undefined,
  ): ValidationErrorData[] | undefined {
    if (!children || children.length === 0) {
      return undefined;
    }

    return children.map((child: TypedValidationError) => ({
      property: child.property,
      constraints: child.constraints || undefined,
      children: this.mapChildren(child.children),
    }));
  }
}
