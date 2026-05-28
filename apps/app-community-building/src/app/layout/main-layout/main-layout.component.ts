import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * 版型元件：一般住戶登入後版型
 */
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {}
