import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-staff-invite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-staff-invite.component.html',
  styleUrls: ['./admin-staff-invite.component.scss']
})
export class AdminStaffInviteComponent {
  readonly form;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      employeeId: ['', Validators.required],
      department: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitted = false;

  submit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
