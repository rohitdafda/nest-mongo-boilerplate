import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse, FailResponse, HttpFailResponse } from 'src/types';

export class NormalException extends HttpException {
  constructor(message: string, code: number) {
    super({ message, code }, HttpStatus.BAD_REQUEST);
  }

  static HTTP_REQUEST_TIMEOUT = () => {
    return new NormalException(
      'HTTP Request Timeout',
      HttpStatus.REQUEST_TIMEOUT,
    );
  };

  static VALIDATION_ERROR = (msg?: string) => {
    return new NormalException(
      msg || 'Validation Error',
      HttpStatus.BAD_REQUEST,
    );
  };

  static UNEXPECTED = (msg?: string) => {
    return new NormalException(
      msg || 'Unexpected Error',
      HttpStatus.BAD_REQUEST,
    );
  };

  toJSON(): HttpFailResponse {
    const response = this.getResponse();
    return {
      error: {
        message: response.message,
        code: response.code,
      },
    };
  }

  toApiResponse(): ApiResponse<null> {
    const response = this.getResponse();
    return {
      statusCode: this.getStatus(),
      status: false,
      data: null,
      message: response.message,
    };
  }

  // @Override
  getResponse(): FailResponse {
    return <FailResponse>super.getResponse();
  }
}
