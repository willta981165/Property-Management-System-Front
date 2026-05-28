import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * 版型元件：管理員版型
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {}
