import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { MockAuthService, UserRole } from './mock-auth.service';

/**
 * 必須已登入；未登入則導向 /login。
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(MockAuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};

/**
 * 角色守衛：route.data.roles 指定允許角色。
 * 角色不符：admin 嘗試進入 resident 區 → 導向 /admin/dashboard；
 * 反之導向 /home；未登入則導向 /login。
 */
export const roleGuard: (allowed: UserRole[]) => CanActivateFn = (allowed) => () => {
  const auth = inject(MockAuthService);
  const router = inject(Router);
  const role = auth.role();

  if (!role) {
    return router.createUrlTree(['/login']);
  }
  if (allowed.includes(role)) return true;

  return role === 'admin'
    ? router.createUrlTree(['/admin/dashboard'])
    : router.createUrlTree(['/home']);
};
