import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenStorageService } from "@civic/utils/auth";
import { from, switchMap } from "rxjs";

/**
 * 對 API request 自動附加 JWT。
 *
 * Static assets 不屬於後端 API，避免將 Authorization header 帶入設定檔請求。
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url.startsWith("assets/")) {
    return next(request);
  }

  return from(inject(TokenStorageService).getToken()).pipe(
    switchMap((token) => {
      if (!token) {
        return next(request);
      }

      return next(
        request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
    })
  );
};
