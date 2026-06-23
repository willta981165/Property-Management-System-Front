import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "@civic/core/auth";
import { LoginUser } from "@civic/shared/api";
import { map } from "rxjs";

type UserRole = LoginUser["role"];

/**
 * 必須已登入；未登入則導向 /login。
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth
    .restoreSession()
    .pipe(map((user) => !!user || router.createUrlTree(["/login"])));
};

/**
 * 角色守衛：route.data.roles 指定允許角色。
 * 角色不符：admin 嘗試進入 resident 區 → 導向 /admin/dashboard；
 * 反之導向 /home；未登入則導向 /login。
 */
export const roleGuard: (allowed: UserRole[]) => CanActivateFn =
  (allowed) => () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.restoreSession().pipe(
      map((user) => {
        if (!user) {
          return router.createUrlTree(["/login"]);
        }

        const effectiveRole = user.role === "family" ? "resident" : user.role;

        if (allowed.includes(effectiveRole)) {
          return true;
        }

        return effectiveRole === "admin"
          ? router.createUrlTree(["/admin/dashboard"])
          : router.createUrlTree(["/home"]);
      })
    );
  };
