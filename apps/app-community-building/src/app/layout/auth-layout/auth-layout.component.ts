import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * 版型元件：登入頁版型
 */
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {}
