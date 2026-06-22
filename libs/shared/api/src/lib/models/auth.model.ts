export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginUser {
  id: string;
  account?: string;
  name: string;
  role: "resident" | "staff" | "admin" | string;
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
