import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * 功能頁面：管理員首頁
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {}
