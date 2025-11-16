import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { IUser } from 'src/models/user.model';
import { RoleTypesE } from 'src/types';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const userData = {
      ...createUserDto,
      role: createUserDto.role || RoleTypesE.USER,
      isActive:
        createUserDto.isActive !== undefined ? createUserDto.isActive : true,
    };

    const createdUser = new this.userModel(userData);
    const savedUser = await createdUser.save();

    // Remove password from response
    const userObject = savedUser.toObject();
    delete userObject.password;

    return userObject as IUser;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.userModel.find().select('-password').exec();
    return users.map((user) => user.toObject() as IUser);
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user.toObject() as IUser;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .select('-password')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser.toObject() as IUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
