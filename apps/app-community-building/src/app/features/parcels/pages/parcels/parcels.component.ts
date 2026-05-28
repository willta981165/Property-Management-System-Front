import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

/** 包裹 */
export interface ParcelMock {
  id: string;
  trackingNo: string;
  recipient: string;
  arrivedAt: string;
  status: 'pending' | 'picked';
  note?: string;
}

/**
 * 功能頁面：包裹列表頁
 */
@Component({
  selector: 'app-parcels',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './parcels.component.html',
  styleUrls: ['./parcels.component.scss']
})
export class ParcelsComponent {
  readonly parcels: ParcelMock[] = [
    { id: '1', trackingNo: 'SF20260528001', recipient: '王小明', arrivedAt: '2026/05/28 10:25', status: 'pending', note: '智慧取物櫃 #204' },
    { id: '2', trackingNo: 'BX20260527015', recipient: '王小明', arrivedAt: '2026/05/27 16:40', status: 'pending', note: '管理室代收' },
    { id: '3', trackingNo: 'PX20260524032', recipient: '王小明', arrivedAt: '2026/05/24 09:15', status: 'picked', note: '已於 5/24 領取' },
    { id: '4', trackingNo: 'SF20260520077', recipient: '王小明', arrivedAt: '2026/05/20 14:00', status: 'picked' }
  ];

  statusLabel(s: ParcelMock['status']): string {
    return s === 'pending' ? '待領取' : '已領取';
  }
}
