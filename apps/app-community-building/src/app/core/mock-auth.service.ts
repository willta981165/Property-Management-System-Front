import { Injectable, signal, computed } from '@angular/core';

/** 角色 */
export type UserRole = 'admin' | 'resident';

/** 已登入使用者資料 */
export interface MockUser {
  id: string;
  account: string;
  name: string;
  role: UserRole;
  unit?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

const STORAGE_KEY = 'stitch_mock_user';

/** mock 帳號表（前端假登入） */
const MOCK_ACCOUNTS: Array<{ account: string; password: string; user: MockUser }> = [
  {
    account: 'admin',
    password: 'adm123',
    user: {
      id: 'admin-001',
      account: 'admin',
      name: '陳大文',
      role: 'admin',
      phone: '0912-345-678',
      email: 'admin@stitch.com',
      avatar: 'https://i.pravatar.cc/100?img=68'
    }
  },
  {
    account: 'resident',
    password: 'res123',
    user: {
      id: 'resident-001',
      account: 'resident',
      name: '王小明',
      role: 'resident',
      unit: '12F-A',
      phone: '0922-111-222',
      email: 'resident@stitch.com',
      avatar: 'https://i.pravatar.cc/100?img=12'
    }
  }
];

/**
 * Mock 登入服務：純前端、純 localStorage、無 API。
 */
@Injectable({ providedIn: 'root' })
export class MockAuthService {
  private readonly _user = signal<MockUser | null>(this.readFromStorage());

  /** 目前登入者（signal） */
  readonly user = this._user.asReadonly();
  /** 是否已登入 */
  readonly isLoggedIn = computed(() => this._user() !== null);
  /** 目前角色 */
  readonly role = computed<UserRole | null>(() => this._user()?.role ?? null);

  /** mock 登入：成功回傳 user，失敗回傳 null */
  login(account: string, password: string): MockUser | null {
    const hit = MOCK_ACCOUNTS.find(
      (a) => a.account === account.trim() && a.password === password
    );
    if (!hit) return null;
    this._user.set(hit.user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hit.user));
    } catch {
      /* ignore */
    }
    return hit.user;
  }

  /** 登出：清除 localStorage 並重置 signal */
  logout(): void {
    this._user.set(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  /** 取得目前使用者 */
  getUser(): MockUser | null {
    return this._user();
  }

  private readFromStorage(): MockUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as MockUser;
      if (parsed && (parsed.role === 'admin' || parsed.role === 'resident')) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }
}
