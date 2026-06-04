import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { StitchButtonComponent } from '@stitch/ui-kits';

import { MockAuthService } from '../../../../core/mock-auth.service';

/**
 * 功能頁面：登入頁（mock 登入，不打 API）
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, StitchButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    account: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });

  submitted = false;
  showPassword = false;
  errorMsg: string | null = null;
  loading = false;

  goBack(): void {
    this.router.navigateByUrl('/auth/welcome');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** mock 登入 */
  submit(): void {
    this.submitted = true;
    this.errorMsg = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { account, password } = this.form.getRawValue();
    this.loading = true;
    const user = this.auth.login(account ?? '', password ?? '');
    this.loading = false;

    if (!user) {
      this.errorMsg = '帳號或密碼錯誤';
      return;
    }

    if (user.role === 'admin') {
      this.router.navigateByUrl('/admin/dashboard');
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}
