import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {
  readonly legalLinks = ['Privacy Policy', 'Terms of Service'];

  constructor(private readonly router: Router) {}

  goResident(): void {
    this.router.navigateByUrl('/auth/resident-login');
  }

  goAdmin(): void {
    this.router.navigateByUrl('/auth/admin-login');
  }
}
