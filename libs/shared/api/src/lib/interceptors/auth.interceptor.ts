import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenStorageService } from "@civic/utils/auth";
import { from, switchMap } from "rxjs";

import { API_BASE_URL } from "../tokens/api-base-url.token";

const PUBLIC_AUTH_PATHS = ["/api/auth/login", "/api/auth/refresh"];

/**
 * 對 API request 自動附加 JWT。
 *
 * 僅允許本系統 API，避免將 Authorization header 傳給 assets、CDN 或第三方服務。
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const baseUrl = inject(API_BASE_URL).replace(/\/+$/, "");

  if (
    !baseUrl ||
    !request.url.startsWith(`${baseUrl}/`) ||
    isPublicAuthRequest(request.url, baseUrl)
  ) {
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

function isPublicAuthRequest(url: string, baseUrl: string): boolean {
  const requestPath = url.slice(baseUrl.length).split(/[?#]/, 1)[0];
  return PUBLIC_AUTH_PATHS.includes(requestPath);
}
