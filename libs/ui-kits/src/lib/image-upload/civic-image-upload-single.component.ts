import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'civic-image-upload-single',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="civic-image-upload-single">
      <input
        #fileInput
        type="file"
        accept="image/*"
        hidden
        (change)="onFileSelected($event)"
        [attr.aria-label]="ariaLabel" />

      <button
        *ngIf="!imageBase64"
        type="button"
        class="add-image"
        (click)="fileInput.click()"
        [attr.aria-label]="addButtonLabel">
        <mat-icon>add_photo_alternate</mat-icon>
        <span>{{ addButtonLabel }}</span>
      </button>

      <div *ngIf="imageBase64" class="preview-wrap">
        <img class="preview-image" [src]="imageBase64" alt="上傳圖片預覽" />
        <button
          type="button"
          class="remove-image"
          aria-label="移除圖片"
          (click)="removeImage(fileInput)">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .civic-image-upload-single {
        display: flex;
      }

      .add-image,
      .preview-wrap {
        width: 102px;
        height: 102px;
        border-radius: 14px;
      }

      .add-image {
        border: 2px dashed #b7beca;
        color: #374151;
        background: transparent;
        font-size: 0.9rem;
        font-weight: 700;
        display: grid;
        place-content: center;
        gap: 4px;
      }

      .add-image mat-icon {
        justify-self: center;
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .preview-wrap {
        position: relative;
        overflow: hidden;
        background: #e5e7eb;
      }

      .preview-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .remove-image {
        position: absolute;
        right: 6px;
        top: 6px;
        width: 24px;
        height: 24px;
        border-radius: 999px;
        border: 0;
        background: rgba(17, 24, 39, 0.85);
        color: #fff;
        display: grid;
        place-content: center;
      }

      .remove-image mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    `
  ]
})
export class CivicImageUploadSingleComponent {
  @Input() imageBase64: string | null = null;
  @Input() ariaLabel = '上傳圖片';
  @Input() addButtonLabel = '添加圖片';

  @Output() readonly imageBase64Change = new EventEmitter<string | null>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file || !file.type.startsWith('image/')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageBase64 = typeof reader.result === 'string' ? reader.result : null;
      this.imageBase64Change.emit(this.imageBase64);
    };
    reader.readAsDataURL(file);
  }

  removeImage(fileInput: HTMLInputElement): void {
    this.imageBase64 = null;
    this.imageBase64Change.emit(null);
    fileInput.value = '';
  }
}
