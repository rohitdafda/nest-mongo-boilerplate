import { RoleTypesE } from 'src/types';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: RoleTypesE;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  role?: RoleTypesE;
  isActive?: boolean;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: RoleTypesE;
  isActive?: boolean;
  lastLogin?: Date;
}
