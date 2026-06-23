export interface ApiErrorResponse {
  code?: string;
  message?: string;
  details?: unknown;
}

export interface ApiMessageResponse {
  message?: string;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}
