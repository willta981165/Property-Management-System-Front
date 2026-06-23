import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { Router, RouterModule } from "@angular/router";
import { AuthService } from "@civic/core/auth";
import { ApiError } from "@civic/shared/api";
import { CivicButtonComponent } from "@civic/ui-kits";

@Component({
  selector: "app-admin-register",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    CivicButtonComponent,
  ],
  templateUrl: "./admin-register.component.html",
  styleUrls: ["./admin-register.component.scss"],
})
export class AdminRegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly departments = [
    "物業管理",
    "櫃檯服務",
    "維修工程",
    "財務行政",
    "系統管理",
  ];

  readonly form = this.fb.group(
    {
      name: ["", Validators.required],
      employeeId: ["", Validators.required],
      department: ["物業管理", Validators.required],
      projectName: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
      confirmPassword: ["", Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );

  submitted = false;
  showPassword = false;
  showConfirmPassword = false;
  loading = false;
  errorMsg: string | null = null;

  goBack(): void {
    this.router.navigateByUrl("/auth/admin-login");
  }

  goLogin(): void {
    this.router.navigateByUrl("/auth/admin-login");
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  submit(): void {
    this.submitted = true;
    this.errorMsg = null;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.loading = true;

    this.auth
      .registerAdmin({
        name: value.name ?? "",
        employee_id: value.employeeId ?? "",
        department: value.department ?? "",
        project_name: value.projectName ?? "",
        email: value.email ?? "",
        password: value.password ?? "",
        confirm_password: value.confirmPassword ?? "",
      })
      .subscribe({
        next: () => {
          this.loading = false;
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

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
