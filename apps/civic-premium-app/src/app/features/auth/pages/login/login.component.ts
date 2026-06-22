import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "@civic/core/auth";
import { ApiError } from "@civic/shared/api";
import { CivicButtonComponent } from "@civic/ui-kits";

/**
 * 功能頁面：住戶登入頁。
 */
@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    CivicButtonComponent,
  ],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    account: ["", Validators.required],
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

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /** 呼叫登入 API，成功後依回傳角色導向對應首頁。 */
  submit(): void {
    this.submitted = true;
    this.errorMsg = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { account, password } = this.form.getRawValue();
    this.loading = true;
    this.auth
      .login({
        account: account ?? "",
        password: password ?? "",
      })
      .subscribe({
        next: ({ user }) => {
          this.loading = false;
          this.router.navigateByUrl(
            user.role === "admin" ? "/admin/dashboard" : "/home"
          );
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
