import { Injectable } from '@nestjs/common';
import { TestDto } from './dto/test.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Nest BoilerPlate';
  }

  testValidation(testDto: TestDto) {
    return {
      message: 'Validation passed successfully',
      data: testDto,
    };
  }
}
