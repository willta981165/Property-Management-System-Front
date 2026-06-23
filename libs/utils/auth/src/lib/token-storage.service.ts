import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";

const AUTH_TOKEN_KEY = "auth.token";
const REFRESH_TOKEN_KEY = "auth.refresh-token";

// TODO(SECURITY): 正式版需改用 iOS Keychain / Android Keystore 等 secure storage。
@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  async getToken(): Promise<string | null> {
    const result = await Preferences.get({ key: AUTH_TOKEN_KEY });
    return result.value;
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({
      key: AUTH_TOKEN_KEY,
      value: token,
    });
  }

  async clearToken(): Promise<void> {
    await Preferences.remove({ key: AUTH_TOKEN_KEY });
  }

  async getRefreshToken(): Promise<string | null> {
    const result = await Preferences.get({ key: REFRESH_TOKEN_KEY });
    return result.value;
  }

  async setRefreshToken(refreshToken: string): Promise<void> {
    await Preferences.set({
      key: REFRESH_TOKEN_KEY,
      value: refreshToken,
    });
  }

  async clearRefreshToken(): Promise<void> {
    await Preferences.remove({ key: REFRESH_TOKEN_KEY });
  }
}
