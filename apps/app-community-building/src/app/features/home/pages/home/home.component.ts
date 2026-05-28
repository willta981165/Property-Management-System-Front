import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * 功能頁面：住戶首頁
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {}
