export interface LoginRequest {
  account: string;
  password: string;
}

export interface LoginUser {
  id: string;
  name: string;
  role: 'resident' | 'staff' | 'admin' | string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: LoginUser;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
}
