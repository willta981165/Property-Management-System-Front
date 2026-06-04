import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { MockAuthService } from '../../../../core/mock-auth.service';

/**
 * 功能頁面：住戶首頁
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly user = computed(() => this.auth.user());

  /** 包裹未領取數量 mock */
  readonly pendingParcels = 2;

  /** 最新動態 mock */
  readonly activities = [
    { id: 'p1', kind: 'parcel' as const, icon: 'inventory_2', title: '您的包裹已送達領取櫃', desc: '智慧取物櫃 #204・剛剛', link: ['/parcels', '1'] },
    { id: 'a1', kind: 'announce' as const, icon: 'campaign', title: '年度消防安檢通知', desc: '管理委員會・2 小時前', link: ['/announcements', '1'] },
    { id: 'b1', kind: 'booking' as const, icon: 'event', title: '公設預約已確認', desc: '多功能健身房・今晚 19:00・5 小時前', link: ['/facility-bookings', '1'] }
  ];

  constructor(private readonly auth: MockAuthService) {}
}
