import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'civic-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <button mat-flat-button color="primary" class="civic-button" [disabled]="disabled || loading" [type]="type">
      <mat-progress-spinner *ngIf="loading; else content" diameter="18" mode="indeterminate"></mat-progress-spinner>
      <ng-template #content>
        <span class="content-slot">
          <ng-content></ng-content>
        </span>
      </ng-template>
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .civic-button {
        width: 100%;
      }

      .content-slot {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      mat-progress-spinner {
        display: inline-flex;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CivicButtonComponent {
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' = 'button';
}
