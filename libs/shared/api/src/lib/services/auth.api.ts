import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import {
  AdminRegisterRequest,
  AdminRegisterResponse,
  ChangePasswordRequest,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenResponse,
} from "../models/auth.model";
import { ApiMessageResponse } from "../models/common.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";

/**
 * Auth domain 的 HTTP API。
 *
 * 僅負責 request/response，不處理 token 儲存、導頁或畫面狀態。
 */
@Injectable({
  providedIn: "root",
})
export class AuthApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/api/auth/login`,
      payload
    );
  }

  registerAdmin(
    payload: AdminRegisterRequest
  ): Observable<AdminRegisterResponse> {
    return this.http.post<AdminRegisterResponse>(
      `${this.baseUrl}/api/auth/admin/register`,
      payload
    );
  }

  changePassword(
    payload: ChangePasswordRequest
  ): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(
      `${this.baseUrl}/api/auth/change-password`,
      payload
    );
  }

  getCurrentUser(): Observable<CurrentUserResponse> {
    return this.http.get<CurrentUserResponse>(`${this.baseUrl}/api/auth/me`);
  }

  refresh(refreshToken: string): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(
      `${this.baseUrl}/api/auth/refresh`,
      null,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${refreshToken}`,
        }),
      }
    );
  }
}
