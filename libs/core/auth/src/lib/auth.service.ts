import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SystemConfigService } from '@stitch/shared/config';
import { TokenStorageService, isTokenExpired } from '@stitch/utils/auth';
import { Observable, catchError, from, map, switchMap, throwError } from 'rxjs';

import { ApiErrorResponse, LoginRequest, LoginResponse } from './auth-api.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly systemConfig: SystemConfigService,
    private readonly tokenStorage: TokenStorageService
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.systemConfig.getConfig().pipe(
      switchMap((config) =>
        this.http.post<LoginResponse>(`${config.apiBaseUrl}${config.loginPath}`, payload)
      ),
      switchMap((response) => from(this.tokenStorage.setToken(response.token)).pipe(map(() => response))),
      catchError((error: HttpErrorResponse) => throwError(() => this.toApiError(error)))
    );
  }

  logout(): Observable<void> {
    return from(this.tokenStorage.clearToken());
  }

  getToken(): Observable<string | null> {
    return from(this.tokenStorage.getToken());
  }

  hasValidToken(): Observable<boolean> {
    return this.getToken().pipe(map((token) => !!token && !isTokenExpired(token)));
  }

  private toApiError(error: HttpErrorResponse): ApiErrorResponse {
    if (error.status === 401 || error.status === 403) {
      return {
        code: 'INVALID_CREDENTIALS',
        message: '帳號或密碼錯誤'
      };
    }

    return {
      code: error.error?.code ?? 'LOGIN_FAILED',
      message: error.error?.message ?? '系統忙碌中，請稍後再試'
    };
  }
}
