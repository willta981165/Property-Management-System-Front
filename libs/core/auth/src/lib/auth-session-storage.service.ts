import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { LoginUser, UserRole } from "@civic/shared/api";

const AUTH_USER_KEY = "auth.user";
const USER_ROLES: readonly UserRole[] = ["resident", "staff", "admin"];

// TODO(SECURITY): 正式版若需保存敏感使用者資料，應改用 secure storage 並縮減欄位。
/**
 * 管理已登入使用者的本機持久化資料。
 *
 * Token 仍由 TokenStorageService 負責，避免 session model 與 token utility 耦合。
 */
@Injectable({
  providedIn: "root",
})
export class AuthSessionStorageService {
  async getUser(): Promise<LoginUser | null> {
    const { value } = await Preferences.get({ key: AUTH_USER_KEY });

    if (!value) {
      return null;
    }

    try {
      const user: unknown = JSON.parse(value);

      if (isLoginUser(user)) {
        return user;
      }
    } catch {
      // Invalid JSON is handled by clearing the persisted session below.
    }

    await this.clearUser();
    return null;
  }

  async setUser(user: LoginUser): Promise<void> {
    await Preferences.set({
      key: AUTH_USER_KEY,
      value: JSON.stringify(user),
    });
  }

  async clearUser(): Promise<void> {
    await Preferences.remove({ key: AUTH_USER_KEY });
  }
}

function isLoginUser(value: unknown): value is LoginUser {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user["id"] === "string" &&
    typeof user["name"] === "string" &&
    typeof user["role"] === "string" &&
    USER_ROLES.includes(user["role"] as UserRole) &&
    isOptionalString(user["account"]) &&
    isOptionalString(user["unit"]) &&
    isOptionalString(user["phone"]) &&
    isOptionalString(user["email"]) &&
    isOptionalString(user["avatar"])
  );
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}
