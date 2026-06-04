import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { CivicButtonComponent } from '@civic/ui-kits';
import { MockAuthService } from '../../../../core/mock-auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatIconModule, CivicButtonComponent],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(MockAuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    employeeId: ['', Validators.required],
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

  goRegister(): void {
    this.router.navigateByUrl('/auth/admin-register');
  }

  goInviteStaff(): void {
    this.router.navigateByUrl('/auth/admin-staff-invite');
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillTestAccount(): void {
    this.form.patchValue({
      employeeId: 'admin',
      password: 'adm123',
      rememberMe: true
    });
    this.errorMsg = null;
  }

  submit(): void {
    this.submitted = true;
    this.errorMsg = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { employeeId, password } = this.form.getRawValue();
    this.loading = true;
    const user = this.auth.login(employeeId ?? '', password ?? '');
    this.loading = false;

    if (!user || user.role !== 'admin') {
      this.errorMsg = '員工編號或密碼錯誤';
      return;
    }

    this.router.navigateByUrl('/admin/dashboard');
  }
}
