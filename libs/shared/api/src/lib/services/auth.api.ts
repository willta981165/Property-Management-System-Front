import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LoginRequest, LoginResponse } from "../models/auth.model";
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
    // TODO(API): 取得可下載的 Swagger JSON 後，核對 login path 與 LoginResponse schema。
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/api/auth/login`,
      payload
    );
  }
}
