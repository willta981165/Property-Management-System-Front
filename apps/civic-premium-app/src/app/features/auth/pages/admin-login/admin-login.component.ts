import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "@civic/core/auth";
import { ApiError } from "@civic/shared/api";
import { CivicButtonComponent } from "@civic/ui-kits";

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
        identifier: employeeId ?? "",
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
