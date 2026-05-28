import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

/** 公設 */
export interface FacilityMock {
  id: string;
  name: string;
  openHours: string;
  capacity: number;
  bookable: boolean;
  icon: string;
  todayBookings: number;
}

/**
 * 功能頁面：公設列表頁
 */
@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.scss']
})
export class FacilitiesComponent {
  readonly facilities: FacilityMock[] = [
    { id: 'gym', name: '健身房', openHours: '06:00 - 22:00', capacity: 20, bookable: true, icon: 'fitness_center', todayBookings: 4 },
    { id: 'pool', name: '游泳池', openHours: '07:00 - 21:00', capacity: 30, bookable: true, icon: 'pool', todayBookings: 6 },
    { id: 'meeting', name: '多功能會議室', openHours: '09:00 - 22:00', capacity: 12, bookable: true, icon: 'meeting_room', todayBookings: 2 },
    { id: 'bbq', name: '空中花園 BBQ 區', openHours: '10:00 - 22:00', capacity: 16, bookable: true, icon: 'outdoor_grill', todayBookings: 1 },
    { id: 'theater', name: '視聽室', openHours: '10:00 - 22:00', capacity: 8, bookable: true, icon: 'theaters', todayBookings: 0 },
    { id: 'kids', name: '兒童遊戲室', openHours: '08:00 - 20:00', capacity: 10, bookable: false, icon: 'toys', todayBookings: 0 }
  ];
}
