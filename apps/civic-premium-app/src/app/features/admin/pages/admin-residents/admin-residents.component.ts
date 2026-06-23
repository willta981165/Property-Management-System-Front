import { Component, OnInit, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AdminApi, ApiError, Resident } from "@civic/shared/api";

/**
 * 功能頁面：住戶管理頁
 */
@Component({
  selector: "app-admin-residents",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./admin-residents.component.html",
  styleUrls: ["./admin-residents.component.scss"],
})
export class AdminResidentsComponent implements OnInit {
  private readonly adminApi = inject(AdminApi);

  readonly residents = signal<Resident[]>([]);
  readonly loading = signal(false);
  readonly errorMsg = signal<string | null>(null);

  ngOnInit(): void {
    this.loadResidents();
  }

  loadResidents(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.adminApi.getResidents().subscribe({
      next: (response) => {
        this.residents.set(response.residents);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMsg.set(
          error instanceof ApiError ? error.message : "系統忙碌中，請稍後再試"
        );
      },
    });
  }

  residentName(resident: Resident): string {
    return resident.name || "未命名住戶";
  }

  residentMeta(resident: Resident): string {
    return (
      [resident.unit_code, resident.phone].filter(Boolean).join(" ・ ") ||
      "尚無聯絡資料"
    );
  }

  residentInitial(resident: Resident): string {
    return this.residentName(resident).slice(0, 1).toUpperCase();
  }
}
