import { AppEnvironment } from "./environment.model";

export const environment: AppEnvironment = {
  production: true,
  // TODO(API): 正式環境後端應改用 HTTPS 網址。
  apiBaseUrl: "",
  // TODO(SECURITY): 正式環境不可設定測試帳密。
  testAccount: undefined,
};
