import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiErrorResponse, AuthService } from '@stitch/core/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { StitchButtonComponent } from '@stitch/ui-kits';

@Component({
  selector: 'stitch-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    StitchButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  loading = false;
  readonly loginForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.loginForm = this.formBuilder.nonNullable.group({
      account: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  submit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { account } = this.loginForm.getRawValue();
    if (account === 'claire518') {
      Preferences.set({ key: 'auth.token', value: 'FAKE_TOKEN' }).then(() => {
        this.router.navigateByUrl('/home');
      });
      return;
    }

    this.loading = true;
    this.changeDetectorRef.markForCheck();

    this.auth
      .login(this.loginForm.getRawValue())
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe({
        next: () => void this.router.navigateByUrl('/home'),
        error: (error: ApiErrorResponse) => {
          this.snackBar.open(error.message, '關閉', { duration: 3500 });
        }
      });
  }
}
