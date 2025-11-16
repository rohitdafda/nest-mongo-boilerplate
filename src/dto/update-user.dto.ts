import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RoleTypesE } from 'src/types';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name?: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @IsEnum(RoleTypesE, { message: 'Role must be a valid role type' })
  @IsOptional()
  role?: RoleTypesE;

  @IsOptional()
  isActive?: boolean;
}
