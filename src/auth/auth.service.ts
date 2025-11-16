import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from 'src/dto/register.dto';
import { AuthenticatedUser, RoleTypesE } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    if (!user.password) {
      throw new UnauthorizedException('User has no password set');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Ensure _id is converted to string safely
    // Mongoose Document._id is an ObjectId which has a toString() method
    const userId = user._id?.toString();
    if (!userId) {
      throw new UnauthorizedException('Invalid user ID');
    }

    return {
      id: userId,
      email: user.email,
      role: {
        type: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(registerDto.password);

    // Create user
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: hashedPassword,
      role: registerDto.role || RoleTypesE.USER,
      isActive: true,
    });

    // Generate JWT token
    // Ensure _id is converted to string (Mongoose toObject() already does this)
    const userId = user._id ? String(user._id) : '';
    const payload: AuthenticatedUser = {
      id: userId,
      email: user.email,
      role: {
        type: user.role,
      },
    };

    const accessToken = this.generateToken(payload);

    return {
      user,
      accessToken,
    };
  }

  login(user: AuthenticatedUser) {
    const payload: AuthenticatedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.generateToken(payload);

    return {
      user,
      accessToken,
    };
  }

  private generateToken(payload: AuthenticatedUser): string {
    return this.jwtService.sign({
      id: payload.id,
      email: payload.email,
      role: payload.role.type,
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
