import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { TokenStorageService } from "@civic/utils/auth";
import { from, switchMap } from "rxjs";

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
