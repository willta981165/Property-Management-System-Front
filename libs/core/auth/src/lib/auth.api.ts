import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { API_BASE_URL, SystemConfigService } from "@civic/shared/config";
import { Observable, switchMap } from "rxjs";

import { LoginRequest, LoginResponse } from "./auth-api.model";

@Injectable({
  providedIn: "root",
})
export class AuthApi {
  constructor(
    private readonly http: HttpClient,
    private readonly systemConfig: SystemConfigService,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    // TODO(API): 取得可下載的 Swagger JSON 後，核對 login path 與 LoginResponse schema。
    return this.systemConfig
      .getConfig()
      .pipe(
        switchMap((config) =>
          this.http.post<LoginResponse>(
            `${this.apiBaseUrl}${config.loginPath}`,
            payload
          )
        )
      );
  }
}
