import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { MockAuthService } from '../../../../core/mock-auth.service';

/**
 * 功能頁面：個人中心頁
 */
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  readonly user = computed(() => this.auth.user());

  /** 個人功能選單 mock */
  readonly menu = [
    { icon: 'badge', label: '住戶身份', value: '一般住戶' },
    { icon: 'phone', label: '聯絡電話', valueKey: 'phone' as const },
    { icon: 'mail', label: '電子郵件', valueKey: 'email' as const },
    { icon: 'home', label: '房號', valueKey: 'unit' as const }
  ];

  /** 設定區 */
  readonly settings = [
    { icon: 'notifications', label: '推播通知', desc: '管理通知偏好' },
    { icon: 'lock', label: '修改密碼', desc: '更新登入密碼' },
    { icon: 'language', label: '語言設定', desc: '繁體中文' },
    { icon: 'help', label: '常見問題', desc: '查看使用說明' }
  ];

  constructor(
    private readonly auth: MockAuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
