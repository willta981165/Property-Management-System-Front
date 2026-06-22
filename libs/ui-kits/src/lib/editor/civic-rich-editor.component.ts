import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Editor } from '@tiptap/core';
import Link from '@tiptap/extension-link';
import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';

const ALLOWED_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:'];

// TODO(PROD):
// 若未來導入 Deep Link 或 OAuth Callback，需調整 allowlist。
function normalizeSafeUrl(value: string): string | null {
  try {
    const url = new URL(value, window.location.origin);

    if (!ALLOWED_PROTOCOLS.includes(url.protocol)) {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}

@Component({
  selector: 'civic-rich-editor',
  standalone: true,
  imports: [CommonModule, MatIconModule, TiptapEditorDirective],
  template: `
    <div class="civic-rich-editor">
      <div class="toolbar" role="toolbar" aria-label="文字格式工具列">
        <button type="button" (click)="toggleBold()" [attr.aria-pressed]="isBoldActive()" aria-label="粗體字">
          <mat-icon>format_bold</mat-icon>
        </button>
        <button type="button" (click)="toggleItalic()" [attr.aria-pressed]="isItalicActive()" aria-label="斜體字">
          <mat-icon>format_italic</mat-icon>
        </button>
        <button type="button" (click)="toggleBulletList()" [attr.aria-pressed]="isBulletListActive()" aria-label="條列">
          <mat-icon>format_list_bulleted</mat-icon>
        </button>
        <button type="button" (click)="insertLink()" aria-label="插入超連結">
          <mat-icon>link</mat-icon>
        </button>
      </div>

      <div class="editor-wrap">
        <tiptap-editor class="editor-content" [editor]="editor" [attr.aria-label]="ariaLabel"></tiptap-editor>
        <div class="placeholder" *ngIf="isEmpty">{{ placeholder }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .civic-rich-editor {
        border-radius: 16px;
        border: 1px solid #d5d8e0;
        background: #fff;
        overflow: hidden;
      }

      .toolbar {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 10px;
        border-bottom: 1px solid #dce0e7;
      }

      .toolbar button {
        border: 0;
        background: transparent;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        font-size: 1.25rem;
        color: #374151;
      }

      .toolbar button mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }

      .toolbar button[aria-pressed='true'] {
        background: #e7eefc;
        color: #031634;
        font-weight: 700;
      }

      .editor-wrap {
        position: relative;
      }

      .editor-content {
        display: block;
      }

      :host ::ng-deep .editor-content .tiptap.ProseMirror {
        min-height: 240px;
        padding: 12px 14px;
        font-size: 1rem;
        line-height: 1.5;
        color: #111827;
        outline: none;
      }

      :host ::ng-deep .editor-content .tiptap.ProseMirror ul {
        list-style: disc;
        list-style-position: outside;
        margin: 0.75rem 0;
        padding-left: 1.5rem;
      }

      :host ::ng-deep .editor-content .tiptap.ProseMirror li {
        margin: 0.2rem 0;
      }

      :host ::ng-deep .editor-content .tiptap.ProseMirror a {
        color: #0b57d0;
        text-decoration: underline;
        text-underline-offset: 2px;
        cursor: pointer;
      }

      :host ::ng-deep .editor-content .tiptap.ProseMirror a:hover {
        color: #0842a0;
      }

      .placeholder {
        position: absolute;
        top: 12px;
        left: 14px;
        color: #9298a6;
        pointer-events: none;
      }
    `
  ]
})
export class CivicRichEditorComponent implements OnChanges, OnDestroy {
  @Input() content = '';
  @Input() placeholder = '請輸入內容...';
  @Input() ariaLabel = '富文本編輯器';
  @Output() readonly contentChange = new EventEmitter<string>();

  readonly editor = new Editor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https'
      })
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      this.isEmpty = editor.isEmpty;
      this.contentChange.emit(html);
    }
  });

  isEmpty = true;

  ngOnChanges(changes: SimpleChanges): void {
    const nextContent = changes['content']?.currentValue as string | undefined;
    if (nextContent === undefined) {
      return;
    }

    if (nextContent !== this.editor.getHTML()) {
      this.editor.commands.setContent(nextContent || '', { emitUpdate: false });
      this.isEmpty = this.editor.isEmpty;
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  toggleBold(): void {
    this.editor.chain().focus().toggleBold().run();
  }

  toggleItalic(): void {
    this.editor.chain().focus().toggleItalic().run();
  }

  toggleBulletList(): void {
    this.editor.chain().focus().toggleBulletList().run();
  }

  insertLink(): void {
    const previousUrl = this.editor.getAttributes('link')['href'] ?? '';
    const url = window.prompt('請輸入超連結網址', previousUrl || 'https://');

    if (url === null) {
      return;
    }

    if (!url.trim()) {
      this.editor.chain().focus().unsetLink().run();
      return;
    }

    const safeUrl = normalizeSafeUrl(url.trim());
    if (!safeUrl) {
      return;
    }

    this.editor.chain().focus().extendMarkRange('link').setLink({ href: safeUrl }).run();
  }

  isBoldActive(): boolean {
    return this.editor.isActive('bold');
  }

  isItalicActive(): boolean {
    return this.editor.isActive('italic');
  }

  isBulletListActive(): boolean {
    return this.editor.isActive('bulletList');
  }
}
