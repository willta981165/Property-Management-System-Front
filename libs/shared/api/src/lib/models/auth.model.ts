export interface LoginRequest {
  account: string;
  password: string;
}

export type UserRole = "resident" | "staff" | "admin";

export interface LoginUser {
  id: string;
  account?: string;
  name: string;
  role: UserRole;
  unit?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: LoginUser;
}
