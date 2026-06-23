import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AdminApi, ApiError, ResidentRole } from "@civic/shared/api";

@Component({
  selector: "app-admin-create-resident",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-create-resident.component.html",
  styleUrls: ["./admin-create-resident.component.scss"],
})
export class AdminCreateResidentComponent {
  private readonly fb = inject(FormBuilder);
  private readonly adminApi = inject(AdminApi);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name: ["", Validators.required],
    unitCode: ["", Validators.required],
    phone: [""],
    email: ["", Validators.email],
    password: [createInitialPassword(), Validators.required],
    role: ["resident" as ResidentRole, Validators.required],
    notes: [""],
  });

  submitted = false;
  loading = false;
  errorMsg: string | null = null;

  setRole(role: ResidentRole): void {
    this.form.controls.role.setValue(role);
  }

  regeneratePassword(): void {
    this.form.controls.password.setValue(createInitialPassword());
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

    this.adminApi
      .createResident({
        name: value.name,
        unit_code: value.unitCode,
        phone: value.phone || undefined,
        email: value.email || undefined,
        password: value.password,
        role: value.role,
        notes: value.notes || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigateByUrl("/admin/residents");
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

function createInitialPassword(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const values = new Uint32Array(10);
  crypto.getRandomValues(values);

  return Array.from(values, (value) => alphabet[value % alphabet.length]).join(
    ""
  );
}
