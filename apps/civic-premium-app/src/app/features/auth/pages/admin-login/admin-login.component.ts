import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "@civic/core/auth";
import { ApiError } from "@civic/shared/api";
import { CivicButtonComponent } from "@civic/ui-kits";

import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    CivicButtonComponent,
  ],
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"],
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  /**
   * TODO(SECURITY): 正式環境不可提供或打包測試帳密。
   * Production environment 必須維持 testAccount 為 undefined。
   */
  readonly testAccount = environment.testAccount;

  readonly form = this.fb.group({
    employeeId: ["", Validators.required],
    password: ["", Validators.required],
    rememberMe: [false],
  });

  submitted = false;
  showPassword = false;
  errorMsg: string | null = null;
  loading = false;

  goBack(): void {
    this.router.navigateByUrl("/auth/welcome");
  }

  goRegister(): void {
    this.router.navigateByUrl("/auth/admin-register");
  }

  goInviteStaff(): void {
    this.router.navigateByUrl("/auth/admin-staff-invite");
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillTestAccount(): void {
    if (!this.testAccount) {
      return;
    }

    this.form.patchValue({
      employeeId: this.testAccount.account,
      password: this.testAccount.password,
      rememberMe: true,
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
    this.auth
      .login({
        account: employeeId ?? "",
        password: password ?? "",
      })
      .subscribe({
        next: ({ user }) => {
          this.loading = false;

          if (user.role !== "admin") {
            this.auth.logout().subscribe();
            this.errorMsg = "此帳號沒有管理員權限";
            return;
          }

          this.router.navigateByUrl("/admin/dashboard");
        },
        error: (error: unknown) => {
          this.loading = false;
          this.errorMsg =
            error instanceof ApiError
              ? error.message
              : "系統忙碌中，請稍後再試";
        },
      });
  }
}
