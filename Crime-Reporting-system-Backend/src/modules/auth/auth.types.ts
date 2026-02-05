// src/modules/auth/auth.types.ts
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}
