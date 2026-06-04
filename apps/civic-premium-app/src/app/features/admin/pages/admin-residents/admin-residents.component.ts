import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * 功能頁面：住戶管理頁
 */
@Component({
  selector: 'app-admin-residents',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-residents.component.html',
  styleUrls: ['./admin-residents.component.scss']
})
export class AdminResidentsComponent {}
