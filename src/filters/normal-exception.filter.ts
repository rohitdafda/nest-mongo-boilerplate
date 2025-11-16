import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { NormalException } from '../exception/normal.exception';
import { Response } from 'express';

@Catch(NormalException)
export class NormalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NormalExceptionFilter.name);

  catch(exception: NormalException, host: ArgumentsHost) {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = response.statusCode || 400;
    response.status(statusCode).json({
      statusCode,
      status: false,
      data: null,
      message: exception.message || 'An error occurred',
    });
  }
}
