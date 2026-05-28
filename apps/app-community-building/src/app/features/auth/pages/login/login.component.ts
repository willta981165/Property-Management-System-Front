import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { MockAuthService } from '../../../../core/mock-auth.service';

/**
 * 功能頁面：登入頁（mock 登入，不打 API）
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  account = '';
  password = '';
  showPassword = signal(false);
  errorMsg = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private readonly auth: MockAuthService,
    private readonly router: Router
  ) {}

  togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  /** mock 登入 */
  submit(): void {
    this.errorMsg.set(null);
    if (!this.account.trim() || !this.password) {
      this.errorMsg.set('請輸入帳號與密碼');
      return;
    }
    this.loading.set(true);
    const user = this.auth.login(this.account, this.password);
    this.loading.set(false);
    if (!user) {
      this.errorMsg.set('帳號或密碼錯誤');
      return;
    }
    if (user.role === 'admin') {
      this.router.navigateByUrl('/admin/dashboard');
    } else {
      this.router.navigateByUrl('/home');
    }
  }

  /** 一鍵填入測試帳號 */
  fillDemo(role: 'admin' | 'resident'): void {
    if (role === 'admin') {
      this.account = 'admin';
      this.password = 'adm123';
    } else {
      this.account = 'resident';
      this.password = 'res123';
    }
  }
}
