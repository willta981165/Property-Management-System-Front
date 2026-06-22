import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import { LoginUser } from "@civic/shared/api";

const AUTH_USER_KEY = "auth.user";

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
      return JSON.parse(value) as LoginUser;
    } catch {
      await this.clearUser();
      return null;
    }
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
