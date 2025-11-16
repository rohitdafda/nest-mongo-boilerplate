export interface ApiResponse<T = any> {
  statusCode: number;
  status: boolean;
  data: T | null;
  message: string;
}

export type HandlerResponse<T> =
  | T
  | { data: T; message?: string }
  | { data?: T; message?: string };

export enum RoleTypesE {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  // we can add more role types as needed
}

// Generic user type with role constraint (Option 5)
// T extends the role type enum to ensure type safety
export interface AuthenticatedUser<T extends string = string> {
  id: string;
  email: string;
  role: {
    type: T;
  };
}

export interface FailResponse {
  readonly message: string;
  readonly code: number;
}

export interface HttpFailResponse {
  readonly error: FailResponse;
}

// ValidationError types for class-validator
export interface ValidationErrorConstraints {
  [type: string]: string;
}

// Typed interface matching class-validator's ValidationError structure
export interface TypedValidationError {
  target?: Record<string, unknown>;
  property: string;
  value?: unknown;
  constraints?: ValidationErrorConstraints;
  children?: TypedValidationError[];
  contexts?: Record<string, unknown>;
}

export interface ValidationErrorData {
  property: string;
  constraints: ValidationErrorConstraints | undefined;
  children: ValidationErrorData[] | undefined;
}

// Type guard to check if response contains validation errors
export interface BadRequestExceptionResponse {
  message?: string | string[];
  error?: string | string[];
  statusCode?: number;
}

// Type guard function
export function isValidationErrorArray(
  value: unknown,
): value is TypedValidationError[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    typeof (value[0] as TypedValidationError)?.property === 'string'
  );
}
