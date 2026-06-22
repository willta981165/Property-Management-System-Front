import { Injectable, signal } from "@angular/core";
import {
  AuthApi,
  LoginRequest,
  LoginResponse,
  LoginUser,
} from "@civic/shared/api";
import { TokenStorageService, isTokenExpired } from "@civic/utils/auth";
import { Observable, forkJoin, from, map, of, switchMap, tap } from "rxjs";

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
    return this.authApi.login(payload).pipe(
      switchMap((response) =>
        forkJoin([
          from(this.tokenStorage.setToken(response.token)),
          from(this.sessionStorage.setUser(response.user)),
        ]).pipe(map(() => response))
      ),
      tap((response) => this.userState.set(response.user))
    );
  }

  /** 清除登入狀態。 */
  logout(): Observable<void> {
    return forkJoin([
      from(this.tokenStorage.clearToken()),
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
}
