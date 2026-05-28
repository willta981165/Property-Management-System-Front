# Community Building Mobile App

Nx + Angular + Capacitor 行動應用程式，可編譯到 Android 與 iOS。

## 專案位置

```txt
/Users/claire/Downloads/stitch_resident_community_management_system
```

## 專案結構

```txt
apps/app-community-building
libs/core/auth
libs/shared/config
libs/ui-kits
libs/utils/auth
```

## 安裝

```bash
npm install
```

## 開發

```bash
npm start
```

路由：

- `/login`
- `/home`
- 空路徑導向 `/login`

## API 設定

API URL 集中於：

```txt
apps/app-community-building/src/assets/configs/system.json
```

範例：

```json
{
  "apiBaseUrl": "https://api.example.com",
  "loginPath": "/api/login"
}
```

登入 API：

```txt
POST {apiBaseUrl}{loginPath}
```

request：

```json
{
  "account": "resident001",
  "password": "password"
}
```

success response：

```json
{
  "token": "jwt-token",
  "expiresIn": 3600,
  "user": {
    "id": "resident-001",
    "name": "王小明",
    "role": "resident"
  }
}
```

error response：

```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "帳號或密碼錯誤"
}
```

錯誤處理流程：

1. 表單必填驗證失敗：停留登入頁並顯示欄位錯誤。
2. API 回傳 401/403：顯示帳號或密碼錯誤。
3. API 回傳其他錯誤：顯示系統忙碌訊息。
4. 登入成功：token 寫入 Capacitor Preferences，導向 `/home`。

## 開發規範與提醒

- **Angular 20 Standalone Component 寫法**：所有新元件建議使用 `standalone: true`，並在 `imports` 明確引入所需 Angular Material、共用元件與自訂元件。
- **Material 與自訂元件引用**：每個 component 需在 `imports` 裡引入自己用到的 Material module（如 MatCardModule、MatIconModule 等）與自訂元件（如 StitchButtonComponent）。
- **SCSS 樣式引用**：
  - 全域樣式請用 `@use 'material-theme' as stitch-theme;`，路徑已由 Nx 設定 `includePaths`，不需寫相對路徑。
  - 共用設計 token 也可直接用 `@use 'tokens' as tokens;`。
- **libs/ui-kits**：只 export standalone component，不要再 export module。
- **不要混用 Tailwind 與 Material**：同一個 Material 元件請勿同時加 Tailwind class，避免樣式衝突。
- **如需新增 SCSS 共用樣式**，請放在 `libs/ui-kits/src/styles/`，並用 `@use` 引用。
- **如需新增共用元件**，建議放在 `libs/ui-kits`，並設為 standalone component。
- **如需新增共用 service**，建議放在 `libs/shared` 或 `libs/core`。
- **如需調整 build 設定**，請同步檢查 `apps/app-community-building/project.json` 的 stylePreprocessorOptions。
- **如需擴充 Capacitor 原生功能**，請參考 Capacitor 官方文件。

> 若有新規範或重要提醒，請務必補充在本區段，讓團隊成員都能遵循！

## UI 與主題

- Angular Material 主題集中在 `libs/ui-kits/src/styles/_material-theme.scss`。
- 共用設計 token 在 `libs/ui-kits/src/styles/_tokens.scss` 與 `tools/design-tokens.cjs`。
- Tailwind 設定在 `tailwind.config.js`。
- 登入與首頁主要使用 SCSS，避免在同一個 Material 元件上混用 Tailwind class。
- 不使用 `::ng-deep`、MDC 私有 class 或覆蓋 Material 內部結構。

## 打包

```bash
npm run build
```

## Android

首次建立 native 專案：

```bash
npm run cap:add:android
```

同步與開啟 Android Studio：

```bash
npm run build:android
```

## iOS

首次建立 native 專案：

```bash
npm run cap:add:ios
```

同步與開啟 Xcode：

```bash
npm run build:ios
```

## Nx Targets

```bash
nx build app-community-building
nx serve app-community-building
nx run app-community-building:deploy
nx run app-community-building:deploy:android
nx run app-community-building:deploy:ios
```

## 注意事項

- Capacitor 官方目前以 `@capacitor/preferences` 取代舊 Storage 套件；本專案以 `TokenStorageService` 封裝 token 存取。
- Android/iOS native 目錄由 `npx cap add android`、`npx cap add ios` 產生。

## 資安與個資合規評估與建議

1. **蒐集敏感性資料前取得同意**
   - 請於蒐集帳號、身分證、聯絡方式等敏感資料前，彈出同意視窗或條款，並記錄用戶同意。
2. **提供拒絕蒐集敏感性資料之權利**
   - 於同意視窗提供「不同意」選項，並允許用戶選擇不提供敏感資料（如不同意則部分功能受限）。
3. **儲存敏感性資料前取得同意**
   - 儲存前再次提示用戶，並取得明確同意（如「記住帳號」等功能需額外同意）。
4. **避免重複儲存敏感性資料**
   - 僅於必要時儲存敏感資料，並於每次儲存前再次確認用戶同意。
5. **避免登出/關閉後敏感資料殘留**
   - 登出或關閉 app 時，清除本地所有敏感資料（如 token、個資），避免殘留於快取、日誌、暫存檔。
6. **防護螢幕覆蓋攻擊**
   - 建議於 Capacitor/原生層加上防截圖、螢幕遮罩等防護（如 Android FLAG_SECURE、iOS isScreenCaptured）。
7. **敏感資料加密儲存**
   - 本地儲存（如 Preferences、Storage）敏感資料時，請採用 AES-256 等強加密，金鑰妥善管理。
8. **敏感資料不得出現在程式碼**
   - 不可將密碼、金鑰、token 等硬編碼於前端程式碼，亦不可 commit 測試帳密。
9. **確認伺服器憑證有效性**
   - 所有 API 請強制使用 HTTPS，並於 Capacitor/原生層啟用憑證釘選（certificate pinning）或有效性檢查。

> 請團隊於開發新功能時，務必依據上述規範設計與實作，並於上線前進行自我查核。
