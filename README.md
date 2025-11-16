# NestJS MongoDB Boilerplate

A production-ready NestJS boilerplate with MongoDB support, featuring comprehensive type safety, exception handling, and authentication guards.

## Features

- ✅ **Type-Safe Architecture**: Full TypeScript type safety with custom type definitions
- ✅ **Global Type Augmentation**: Express Request types with authenticated user support
- ✅ **Response Interceptor**: Consistent API response format
- ✅ **Exception Filters**: Comprehensive error handling for validation and normal exceptions
- ✅ **Authentication Guards**: JWT authentication and role-based access control
- ✅ **Validation**: Class-validator integration with typed error handling
- ✅ **Configuration Management**: Global ConfigModule setup

## Project Structure

```
src/
├── exception/          # Custom exception classes
│   ├── normal.exception.ts
│   └── validation.exception.ts
├── filters/            # Exception filters
│   ├── normal-exception.filter.ts
│   └── validator-exception.filter.ts
├── guards/             # Authentication & authorization guards
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── interceptor/        # Response interceptors
│   └── response.interceptor.ts
├── types/              # Type definitions
│   ├── express.d.ts    # Express Request type augmentation
│   └── index.ts        # Shared types and interfaces
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

## Installation

```bash
# Install dependencies
$ yarn install
```

## Running the App

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Type Safety Features

### Global User Type Augmentation

The boilerplate includes global Express Request type augmentation for type-safe user access:

```typescript
// In any controller, guard, or interceptor
@Get()
someMethod(@Req() request: Request) {
  // request.user is automatically typed as AuthenticatedUser<RoleTypesE> | undefined
  const user = request.user;
  if (user) {
    // TypeScript knows user.role.type exists
    console.log(user.role.type);
  }
}
```

### Response Types

All API responses follow a consistent format:

```typescript
interface ApiResponse<T> {
  statusCode: number;
  status: boolean;
  data: T | null;
  message: string;
}
```

### Validation Error Types

Fully typed validation error handling:

```typescript
interface ValidationErrorData {
  property: string;
  constraints: ValidationErrorConstraints | undefined;
  children: ValidationErrorData[] | undefined;
}
```

## Key Components

### Response Interceptor

Automatically formats all responses to a consistent structure:

```typescript
// Handler can return:
// 1. Direct data: return { id: 1, name: 'John' }
// 2. With message: return { data: { id: 1 }, message: 'Success' }
// 3. Just data: return { id: 1 }

// All are transformed to:
{
  statusCode: 200,
  status: true,
  data: { id: 1, name: 'John' },
  message: 'Request successful'
}
```

### Exception Filters

#### Validation Exception Filter

Handles `BadRequestException` from NestJS ValidationPipe and formats validation errors:

```typescript
// Automatically catches validation errors and formats them
{
  statusCode: 422,
  status: false,
  data: [
    {
      property: 'email',
      constraints: { isEmail: 'email must be an email' },
      children: undefined
    }
  ],
  message: 'email must be an email'
}
```

#### Normal Exception Filter

Handles custom `NormalException` class for consistent error responses.

### Guards

#### JWT Auth Guard

```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
protectedRoute() {
  return 'This route requires authentication';
}
```

#### Roles Guard

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleTypesE.ADMIN, RoleTypesE.MODERATOR)
@Get('admin')
adminRoute() {
  return 'This route requires admin or moderator role';
}
```

## Type Definitions

### Role Types

```typescript
enum RoleTypesE {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}
```

### Authenticated User

```typescript
interface AuthenticatedUser<T extends string = string> {
  role: {
    type: T;
  };
  // Add other user fields as needed
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
# Add your MongoDB connection string and other configs
```

## Testing

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Code Quality

```bash
# Lint code
$ yarn run lint

# Format code
$ yarn run format
```

## Dependencies

### Core

- `@nestjs/common` - NestJS core
- `@nestjs/core` - NestJS framework
- `@nestjs/platform-express` - Express adapter
- `@nestjs/config` - Configuration management
- `@nestjs/passport` - Authentication

### Validation

- `class-validator` - Decorator-based validation
- `class-transformer` - Object transformation

### Utilities

- `rxjs` - Reactive programming
- `reflect-metadata` - Metadata reflection

## Development

This boilerplate is configured with:

- TypeScript strict mode (with some relaxed rules)
- ESLint for code quality
- Prettier for code formatting
- SWC for fast compilation

## License

UNLICENSED - Private project

## Author

**Rohit Dafda**

- Email: rohitdafda@gmail.com

---

Built with [NestJS](https://nestjs.com/) - A progressive Node.js framework.
