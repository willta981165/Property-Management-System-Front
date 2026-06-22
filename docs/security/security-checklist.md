# Security Checklist

本文件用於 Civic Premium Web、Android 與 iOS 上線前資安檢查。

## NOW

- [x] API 統一由 `libs/shared/api` 管理。
- [x] Feature 不直接注入 `HttpClient`。
- [x] JWT 僅傳送至 `API_BASE_URL`。
- [x] Login 與 refresh endpoint 不附加 JWT。
- [x] JWT 無 `exp`、格式無效或已過期時視為失效。
- [x] 移除會輸出密碼、Token、完整表單及完整 API response 的 debug log。
- [x] 硬編碼測試帳密已從登入流程與 environment 移除。
- [x] 富文字連結僅允許 HTTP、HTTPS、mailto 與 tel scheme。
- [x] `UserRole` 使用固定 union type。
- [x] Preferences 使用者資料經 runtime type guard 驗證。
- [x] 圖片只允許 JPEG、PNG、WebP，且限制為 5 MB。
- [x] 未發現 `Observable<any>` 或 Feature 繞過 shared API。
- [ ] 建立安全關鍵單元測試。
  - [ ] `authInterceptor` 不向第三方 API、CDN 或 assets 附加 Token。
  - [ ] Login 與 refresh request 不附加 Token。
  - [ ] JWT 無 `exp`、過期或格式無效時視為失效。
  - [ ] `toApiError()` 正確處理 401、403、404、500。
  - [ ] `buildHttpParams()` 忽略 `null`、`undefined`、空字串。

> 目前專案沒有可執行的 test target；開發階段不額外導入大型測試框架。

## TODO(PROD)

- [ ] 正式 API 全面使用 HTTPS。
- [ ] 評估 Certificate Pinning 與憑證輪替策略。
- [ ] JWT 與敏感 session 改用 iOS Keychain／Android Keystore secure storage。
- [ ] 關閉 Android `allowBackup` 或設定 data extraction rules。
- [ ] Android release 啟用 R8、Proguard 與 `shrinkResources`。
- [ ] 確認 release build 不可 debuggable。
- [ ] 正式版關閉敏感 logging。
- [ ] 建立 iOS `PrivacyInfo.xcprivacy`。
- [ ] 設定 CSP 與 Trusted Types。
- [ ] CSP 上線前統一移除 `javascript:void(0)`；目前保留既有 UI、E2E 與 QA 行為。
- [ ] 若導入 Deep Link 或 OAuth Callback，調整富文字 URL protocol allowlist。
- [ ] 外部網址統一使用系統瀏覽器或受控 In-App Browser。
- [ ] 完成 Universal Links／App Links 與 Deep Link allowlist。
- [ ] 核對 Firebase 正式設定與金鑰限制。
- [ ] 確認正式 bundle 不包含測試帳密與 development source map。
- [ ] 依威脅模型評估 Root／Jailbreak Detection。
- [ ] 執行 dependency audit、SAST、DAST、MobSF 與實機攔包測試。

## BACKEND_REQUIRED

- [ ] Refresh Token 發行、輪替、撤銷與重放防護。
- [ ] Access Token 有效期限及 `exp` 必填。
- [ ] API 角色與資源層級授權驗證。
- [ ] Rate Limit、登入嘗試限制與帳號鎖定。
- [ ] Session 撤銷與登出失效機制。
- [ ] 正式 CORS allowlist。
- [ ] HSTS 與安全 Response Headers。
- [ ] 上傳檔案 MIME、magic bytes、大小與惡意內容掃描。
- [ ] 富文字 HTML server-side sanitization。
- [ ] Swagger schema 與實際 API contract 核對。
- [ ] 敏感欄位不得出現在錯誤訊息或 API log。
- [ ] Password policy、雜湊與 MFA 策略。
- [ ] API audit log 與異常登入偵測。
