import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "@civic/core/auth";

/**
 * 功能頁面：管理員首頁
 */
@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.auth.user;

  /** 今日總覽 mock */
  readonly stats = {
    totalResidents: 128,
    todayParcels: 24,
    pendingMaintenance: 12,
    todayBookings: 8,
  };

  /** 最近動態 mock */
  readonly recents = [
    {
      icon: "check_circle",
      kind: "success",
      title: "報修完成：3B 單位空調",
      desc: "維修技師：張小泉 已確認修復並由租戶簽署。",
      time: "10:45",
    },
    {
      icon: "inventory_2",
      kind: "parcel",
      title: "新包裹登記：12A 單位",
      desc: "順豐快遞已送達 2 件大型包裹。",
      time: "09:30",
    },
    {
      icon: "fitness_center",
      kind: "booking",
      title: "會所預約提醒：健身房",
      desc: "住戶 李先生 已預約 18:00 - 19:00 時段。",
      time: "08:15",
    },
  ];

  /** 今天日期 */
  readonly today = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl("/login"));
  }
}
