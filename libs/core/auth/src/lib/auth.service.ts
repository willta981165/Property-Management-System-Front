import { Injectable, signal } from "@angular/core";
import {
  AdminRegisterRequest,
  AdminRegisterResponse,
  ApiError,
  AuthApi,
  ChangePasswordRequest,
  CurrentUserResponse,
  LoginRequest,
  LoginResponse,
  LoginUser,
  RefreshTokenResponse,
} from "@civic/shared/api";
import { TokenStorageService, isTokenExpired } from "@civic/utils/auth";
import {
  Observable,
  forkJoin,
  from,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";

import { AuthSessionStorageService } from "./auth-session-storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly userState = signal<LoginUser | null>(null);

  /** 目前登入使用者。 */
  readonly user = this.userState.asReadonly();

  constructor(
    private readonly authApi: AuthApi,
    private readonly tokenStorage: TokenStorageService,
    private readonly sessionStorage: AuthSessionStorageService
  ) {}

  /** 登入並持久化 token 與使用者資料。 */
  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.authApi
      .login(payload)
      .pipe(switchMap((response) => this.establishSession(response)));
  }

  /** 建立管理員帳號並直接建立登入狀態。 */
  registerAdmin(
    payload: AdminRegisterRequest
  ): Observable<AdminRegisterResponse> {
    return this.authApi
      .registerAdmin(payload)
      .pipe(switchMap((response) => this.establishSession(response)));
  }

  changePassword(payload: ChangePasswordRequest) {
    return this.authApi.changePassword(payload);
  }

  getCurrentUser(): Observable<CurrentUserResponse> {
    return this.authApi.getCurrentUser().pipe(
      map((response) => ({
        user: normalizeLoginUser(response.user),
      })),
      switchMap((response) =>
        from(this.sessionStorage.setUser(response.user)).pipe(
          map(() => response)
        )
      ),
      tap(({ user }) => this.userState.set(user))
    );
  }

  refreshAccessToken(): Observable<RefreshTokenResponse> {
    return from(this.tokenStorage.getRefreshToken()).pipe(
      switchMap((refreshToken) => {
        if (!refreshToken) {
          return throwError(
            () =>
              new ApiError(
                401,
                "REFRESH_TOKEN_MISSING",
                "登入狀態已失效，請重新登入"
              )
          );
        }

        return this.authApi.refresh(refreshToken);
      }),
      switchMap((response) =>
        from(this.tokenStorage.setToken(response.access_token)).pipe(
          map(() => response)
        )
      )
    );
  }

  /** 清除登入狀態。 */
  logout(): Observable<void> {
    return forkJoin([
      from(this.tokenStorage.clearToken()),
      from(this.tokenStorage.clearRefreshToken()),
      from(this.sessionStorage.clearUser()),
    ]).pipe(
      tap(() => this.userState.set(null)),
      map(() => undefined)
    );
  }

  getToken(): Observable<string | null> {
    return from(this.tokenStorage.getToken());
  }

  hasValidToken(): Observable<boolean> {
    return this.getToken().pipe(
      map((token) => !!token && !isTokenExpired(token))
    );
  }

  /**
   * 還原 App 重啟或頁面重新整理前的登入狀態。
   * Token 無效時會同步清除殘留 session。
   */
  restoreSession(): Observable<LoginUser | null> {
    if (this.userState()) {
      return of(this.userState());
    }

    return forkJoin({
      token: from(this.tokenStorage.getToken()),
      user: from(this.sessionStorage.getUser()),
    }).pipe(
      switchMap(({ token, user }) => {
        if (!token || isTokenExpired(token) || !user) {
          return this.logout().pipe(map(() => null));
        }

        this.userState.set(user);
        return of(user);
      })
    );
  }

  private establishSession<TResponse extends LoginResponse>(
    response: TResponse
  ): Observable<TResponse> {
    const normalizedResponse = {
      ...response,
      user: normalizeLoginUser(response.user),
    };

    return forkJoin([
      from(this.tokenStorage.setToken(response.access_token)),
      from(this.tokenStorage.setRefreshToken(response.refresh_token)),
      from(this.sessionStorage.setUser(normalizedResponse.user)),
    ]).pipe(
      tap(() => this.userState.set(normalizedResponse.user)),
      map(() => normalizedResponse)
    );
  }
}

function normalizeLoginUser(user: LoginUser): LoginUser {
  if (
    (typeof user.id !== "string" && typeof user.id !== "number") ||
    typeof user.name !== "string" ||
    typeof user.role !== "string"
  ) {
    throw new ApiError(500, "INVALID_USER_RESPONSE", "登入資料格式不正確");
  }

  return {
    ...user,
    account: user.account ?? user.employee_id ?? user.unit_code ?? user.email,
    unit: user.unit ?? user.unit_code,
  };
}
