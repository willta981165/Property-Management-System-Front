import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CivicImageUploadSingleComponent,
  CivicRichEditorComponent,
  CivicTabOption,
  CivicTabSelectComponent
} from '@civic/ui-kits';

/**
 * 功能頁面：管理員公告管理頁
 */
@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CivicTabSelectComponent,
    CivicRichEditorComponent,
    CivicImageUploadSingleComponent
  ],
  templateUrl: './admin-announcements.component.html',
  styleUrls: ['./admin-announcements.component.scss']
})
export class AdminAnnouncementsComponent {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    audience: ['all'],
    scheduleEnabled: [false]
  });

  readonly categoryOptions: CivicTabOption[] = [
    { value: 'important', label: '重要' },
    { value: 'urgent', label: '緊急' },
    { value: 'event', label: '活動' }
  ];

  selectedCategory = 'important';
  editorHtml = '';
  uploadedImageBase64: string | null = null;

  setCategory(next: string): void {
    this.selectedCategory = next;
  }

  onEditorModelChange(value: string): void {
    this.editorHtml = value;
  }

  onImageBase64Change(value: string | null): void {
    this.uploadedImageBase64 = value;
  }

  publish(): void {
    console.log('publish announcement', {
      ...this.form.getRawValue(),
      category: this.selectedCategory,
      content: this.editorHtml,
      imageBase64: this.uploadedImageBase64
    });
  }

  saveDraft(): void {
    console.log('save draft', {
      ...this.form.getRawValue(),
      category: this.selectedCategory,
      content: this.editorHtml,
      imageBase64: this.uploadedImageBase64
    });
  }
}
