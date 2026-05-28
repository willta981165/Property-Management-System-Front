# 🏢 Community Building App

社區住戶 / 物業管理 行動應用程式，可同時部署到 Web、iOS、Android。

> 🛠 Tech Stack：**Angular 20** ・ **Nx 21** ・ **Capacitor 7** ・ **TypeScript** ・ **SCSS / Tailwind**

---

## 📦 1. 專案介紹

一套雙角色社區管理系統：

- 👤 **Resident（住戶端）**：包裹、報修、公設預約、公告、個人資料
- 🛡 **Admin（物業端）**：住戶、包裹、報修、公設、公告管理

單一 codebase，依角色切換不同 Layout 與 Route。

---

## 🗂 2. 專案架構

```txt
apps/
└── app-community-building/         # 主應用
    └── src/app/
        ├── core/                   # Guards、MockAuthService
        ├── layout/                 # auth / main(resident) / admin layout
        └── features/
            ├── auth/               # 登入
            ├── home/ parcels/ ...  # 住戶端頁面
            └── admin/              # 管理端頁面
libs/
├── core/ shared/ utils/            # 共用邏輯
└── ui-kits/                        # 共用 UI 元件
```

> 採 **Standalone Component + Lazy Route + Feature-Based** 結構。

---

## 💻 3. 環境需求

| 工具 | 版本 |
|---|---|
| Node.js | **18.x 或 20.x（LTS）** |
| npm | **>= 9** |
| Angular CLI | 20.x（隨專案安裝即可） |
| Nx | 21.x（隨專案安裝） |

### 🍎 Mac 額外需求
- Xcode 15+（iOS build）
- CocoaPods：`sudo gem install cocoapods`

### 🪟 Windows 額外需求
- PowerShell 5.1+ 或 Windows Terminal
- Android Studio（Android build）
- Git for Windows
- ⚠ 專案路徑請放在「**全英文、不含空白**」資料夾下

---

## 🚀 4. 安裝方式

### 🍎 Mac

```bash
git clone <repo-url>
cd stitch_resident_community_management_system
npm install
```

### 🪟 Windows

開啟 PowerShell：

```powershell
# 1. 允許 npm script 執行（只需設定一次）
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

# 2. clone 到不含中文的路徑
git clone <repo-url> C:\dev\community-app
cd C:\dev\community-app

# 3. 安裝
npm install
```

> 💡 若 `npm install` 卡 `node-gyp`：安裝 Visual Studio Build Tools（含 C++ 工作負載）。
> 💡 若權限錯誤：用一般使用者 PowerShell，**不要**用系統管理員執行 `npm install`。

---

## ▶️ 5. 啟動方式

### 🌐 Web（最快）

```bash
npm start
```

開啟 http://localhost:4200

### 🍎 iOS（⚠ 僅限 macOS）

> Apple 工具鏈不支援 Windows / Linux，iOS 編譯與測試**只能在 macOS + Xcode** 環境進行。

```bash
npm run build:ios
npx cap open ios
```

於 Xcode 點 Run。

### 🤖 Android

```bash
npm run build:android
npx cap open android
```

於 Android Studio 點 Run。

> 改完 web 程式碼想同步到原生 App：`npm run cap:sync`

---

## 🔑 6. 測試帳號

目前登入使用 **前端 mock**，無需後端。

| 角色 | 帳號 | 密碼 | 登入後導向 |
|---|---|---|---|
| 🛡 管理員 | `admin` | `adm123` | `/admin/dashboard` |
| 👤 住戶 | `resident` | `res123` | `/home` |

> 登入頁有「測試帳號」快捷按鈕可一鍵帶入。
> 登出後 `localStorage` 會被清除並導回 `/login`。

---

## 🤝 7. 前後端協作

### API 規範建議

| 項目 | 規則 |
|---|---|
| Base URL | `/api/v1/...` |
| 命名 | 小寫複數 + kebab-case：`/api/v1/parcels`、`/api/v1/maintenance-requests` |
| Method | RESTful：`GET / POST / PATCH / DELETE` |
| Status | `200 / 201 / 204 / 400 / 401 / 403 / 404 / 422 / 500` |
| Date | ISO 8601（`2026-05-28T10:00:00+08:00`） |
| Pagination | Query：`?page=1&pageSize=20`；回傳含 `total / page / pageSize` |
| Upload | `multipart/form-data`，欄位名 `file` |
| 回傳格式 | 統一 `{ data, meta?, error? }` |

### 範例 Response

```json
{
  "data": [{ "id": "1", "title": "..." }],
  "meta": { "page": 1, "pageSize": 20, "total": 42 }
}
```

### Mock 對接流程

1. 🧱 後端先提供 **Swagger / OpenAPI spec**
2. 🎨 前端先用 mock data 完成畫面（目前狀態）
3. 🔌 API ready 後逐頁替換 mock → HttpClient
4. 🔁 雙方保持「欄位命名一致」（前端 interface 直接對齊 spec）

> 目前所有 mock data 集中在各 Component 內，方便 grep 替換。

---

## ❓ 8. 常見問題

<details>
<summary>📌 <code>npm install</code> 卡住或失敗</summary>

- 清快取：`npm cache clean --force`
- 移除後重裝：`rm -rf node_modules package-lock.json && npm install`
- Windows：確認路徑不含中文 / 空白
</details>

<details>
<summary>📌 Nx 行為怪異 / build 抓不到最新檔</summary>

```bash
npx nx reset
```
</details>

<details>
<summary>📌 iOS 內容被瀏海擋住 / 底部被 home indicator 蓋住</summary>

Layout 已套用 `env(safe-area-inset-*)`。新頁面請放在 `main-layout` / `admin-layout` 之下，不要自行覆蓋 `padding-top`。
</details>

<details>
<summary>📌 <code>npx cap sync</code> 失敗</summary>

```bash
npm run build
npx cap sync
```
順序：先 build → 再 sync。
</details>

<details>
<summary>📌 Android SDK 找不到</summary>

於 Android Studio 開啟一次專案，到 `Settings → Android SDK` 安裝 SDK Platform 34 + Build-Tools。
</details>

<details>
<summary>📌 Windows 權限錯誤</summary>

- 不要用「系統管理員」執行 `npm install`
- 確認 ExecutionPolicy：`Get-ExecutionPolicy`
</details>

---

## ✍️ 9. Commit 規範

採 **Conventional Commits**：

| Prefix | 用途 |
|---|---|
| `feat:` | 新功能 |
| `fix:` | 修 bug |
| `refactor:` | 重構（不改行為） |
| `style:` | 樣式 / 排版 |
| `docs:` | 文件 |
| `chore:` | 雜項（設定、依賴） |

範例：

```txt
feat: add parcel detail page
fix: bottom nav covers content on iPhone
refactor: extract MockAuthService
```

---

## 🧭 10. 開發規範

- ✅ Component 一律 **standalone**，不要新增 NgModule
- ✅ Route 使用 **lazy `loadComponent`**
- ✅ 依 **feature 資料夾** 切分（`features/<domain>/pages/<page>/`）
- ✅ SCSS 命名採 **kebab-case**，避免巢狀超過 3 層
- ✅ Mock data 暫時放在對應 component `.ts` 內，命名 `XxxMock`
- ✅ 進入受保護頁面前須掛 `authGuard` + `roleGuard(['admin' | 'resident'])`
- ❌ 不要在頁面內自己加 `min-height: 100vh` 或固定寬度，交給 Layout 處理
- ❌ 不要直接修改 routing 命名（路徑、class 名稱保持穩定）

---

🎉 5 分鐘上手：`npm install` → `npm start` → 用測試帳號登入即可。
