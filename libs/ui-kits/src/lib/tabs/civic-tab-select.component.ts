import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface CivicTabOption {
  value: string;
  label: string;
}

@Component({
  selector: 'civic-tab-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="civic-tab-select" role="tablist" [attr.aria-label]="ariaLabel">
      <button
        *ngFor="let option of options"
        type="button"
        role="tab"
        class="tab-btn"
        [class.active]="option.value === value"
        [attr.aria-selected]="option.value === value"
        (click)="onSelect(option.value)">
        {{ option.label }}
      </button>
    </div>
  `,
  styles: [
    `
      .civic-tab-select {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 0.25rem;
        border-radius: 0.95rem;
        background: #e9ebf0;
        padding: 0.25rem;
      }

      .tab-btn {
        border: 0;
        border-radius: 0.78rem;
        background: transparent;
        color: #344054;
        font-size: 1.06rem;
        line-height: 1.25;
        padding: 0.72rem 0.45rem;
        font-weight: 500;
        cursor: pointer;
      }

      .tab-btn.active {
        background: #ffffff;
        color: #111827;
        box-shadow: 0 1px 4px rgba(2, 6, 23, 0.06);
        font-weight: 700;
      }
    `
  ]
})
export class CivicTabSelectComponent {
  @Input({ required: true }) options: CivicTabOption[] = [];
  @Input() value = '';
  @Input() ariaLabel = 'tab select';
  @Output() readonly valueChange = new EventEmitter<string>();

  onSelect(next: string): void {
    if (next === this.value) {
      return;
    }
    this.valueChange.emit(next);
  }
}
