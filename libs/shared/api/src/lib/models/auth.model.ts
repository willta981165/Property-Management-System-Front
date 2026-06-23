export interface LoginRequest {
  identifier: string;
  password: string;
}

export type UserRole = "resident" | "family" | "staff" | "admin";

export interface LoginUser {
  id: string | number;
  account?: string;
  employee_id?: string;
  unit_code?: string;
  name: string;
  role: UserRole;
  unit?: string;
  phone?: string;
  email?: string;
  department?: string;
  project_name?: string;
  is_active?: boolean;
  avatar?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: LoginUser;
}

export interface AdminRegisterRequest {
  name: string;
  employee_id: string;
  department: string;
  project_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

export interface AdminRegisterResponse extends LoginResponse {
  message: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

export interface CurrentUserResponse {
  user: LoginUser;
}

export interface RefreshTokenResponse {
  access_token: string;
}
