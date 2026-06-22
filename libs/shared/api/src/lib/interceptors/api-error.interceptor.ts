import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

import { toApiError } from "../utils/api-error.util";

/**
 * 將 Angular HttpErrorResponse 統一轉成 ApiError。
 */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      // TODO(API): 後端提供 refresh token 後，在 401 分支加入 refresh/retry；
      // refresh 失敗時再由 App session facade 執行 logout。
      return throwError(() => toApiError(error));
    })
  );
