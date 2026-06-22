import { HttpErrorResponse } from "@angular/common/http";

import { ApiError, ApiErrorResponse } from "../models/common.model";

const DEFAULT_ERRORS: Record<number, Pick<ApiError, "code" | "message">> = {
  0: {
    code: "NETWORK_ERROR",
    message: "無法連線至伺服器，請確認網路狀態",
  },
  401: {
    code: "UNAUTHORIZED",
    message: "驗證失敗，請重新登入",
  },
  403: {
    code: "FORBIDDEN",
    message: "您沒有執行此操作的權限",
  },
  404: {
    code: "NOT_FOUND",
    message: "找不到指定的資料",
  },
  500: {
    code: "INTERNAL_SERVER_ERROR",
    message: "系統忙碌中，請稍後再試",
  },
};

export function toApiError(error: HttpErrorResponse): ApiError {
  const response = isApiErrorResponse(error.error) ? error.error : undefined;
  const fallback = DEFAULT_ERRORS[error.status] ?? {
    code: "API_ERROR",
    message: "系統忙碌中，請稍後再試",
  };

  return new ApiError(
    error.status,
    response?.code ?? fallback.code,
    response?.message ?? fallback.message,
    response?.details
  );
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return typeof value === "object" && value !== null;
}
