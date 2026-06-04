import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { authGuard, roleGuard } from './core/auth.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/welcome' },

  // ===== Auth =====
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', pathMatch: 'full', redirectTo: 'auth/resident-login' },
      {
        path: 'auth/welcome',
        loadComponent: () => import('./features/auth/pages/welcome/welcome.component').then(m => m.WelcomeComponent)
      },
      {
        path: 'auth/resident-login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'auth/admin-login',
        loadComponent: () => import('./features/auth/pages/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
      },
      {
        path: 'auth/admin-register',
        loadComponent: () => import('./features/auth/pages/admin-register/admin-register.component').then(m => m.AdminRegisterComponent)
      },
      {
        path: 'auth/admin-staff-invite',
        loadComponent: () => import('./features/admin/pages/admin-staff-invite/admin-staff-invite.component').then(m => m.AdminStaffInviteComponent)
      }
    ]
  },

  // 別名：/resident/home → /home（符合 auth flow 規格）
  { path: 'resident/home', pathMatch: 'full', redirectTo: 'home' },

  // ===== 住戶端 MainLayout =====
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard, roleGuard(['resident'])],
    children: [
      /** 功能頁面：住戶首頁 */
      { path: 'home', loadComponent: () => import('./features/home/pages/home/home.component').then(m => m.HomeComponent) },
      /** 功能頁面：包裹列表頁 */
      { path: 'parcels', loadComponent: () => import('./features/parcels/pages/parcels/parcels.component').then(m => m.ParcelsComponent) },
      /** 功能頁面：包裹詳情頁 */
      { path: 'parcels/:id', loadComponent: () => import('./features/resident/pages/resident-parcel-detail/resident-parcel-detail.component').then(m => m.ResidentParcelDetailComponent) },
      /** 功能頁面：報修列表頁 */
      { path: 'maintenance', loadComponent: () => import('./features/maintenance/pages/maintenance/maintenance.component').then(m => m.MaintenanceComponent) },
      /** 功能頁面：建立報修頁 */
      { path: 'maintenance/create', loadComponent: () => import('./features/resident/pages/resident-maintenance-create/resident-maintenance-create.component').then(m => m.ResidentMaintenanceCreateComponent) },
      /** 流程頁面：報修 Step1 選擇類別 */
      { path: 'maintenance/create/category', loadComponent: () => import('./features/resident/pages/resident-maintenance-create/resident-maintenance-create.component').then(m => m.ResidentMaintenanceCreateComponent) },
      /** 流程頁面：報修 Step2 問題詳情 */
      { path: 'maintenance/create/details', loadComponent: () => import('./features/resident/pages/resident-maintenance-create/resident-maintenance-create.component').then(m => m.ResidentMaintenanceCreateComponent) },
      /** 流程頁面：報修 Step3 預約時間 */
      { path: 'maintenance/create/schedule', loadComponent: () => import('./features/resident/pages/resident-maintenance-create/resident-maintenance-create.component').then(m => m.ResidentMaintenanceCreateComponent) },
      /** 流程頁面：報修 Step4 確認送出 */
      { path: 'maintenance/create/confirm', loadComponent: () => import('./features/resident/pages/resident-maintenance-create/resident-maintenance-create.component').then(m => m.ResidentMaintenanceCreateComponent) },
      /** 功能頁面：報修詳情頁 */
      { path: 'maintenance/:id', loadComponent: () => import('./features/resident/pages/resident-maintenance-detail/resident-maintenance-detail.component').then(m => m.ResidentMaintenanceDetailComponent) },
      /** 功能頁面：公設列表頁 */
      { path: 'facilities', loadComponent: () => import('./features/facilities/pages/facilities/facilities.component').then(m => m.FacilitiesComponent) },
      /** 功能頁面：公設預約頁 */
      { path: 'facilities/:id/booking', loadComponent: () => import('./features/resident/pages/resident-facility-booking-create/resident-facility-booking-create.component').then(m => m.ResidentFacilityBookingCreateComponent) },
      /** 流程頁面：公設預約 選擇時段 */
      { path: 'facilities/:id/booking/slots', loadComponent: () => import('./features/resident/pages/resident-facility-booking-create/resident-facility-booking-create.component').then(m => m.ResidentFacilityBookingCreateComponent) },
      /** 流程頁面：公設預約 完成確認 */
      { path: 'facilities/:id/booking/confirm', loadComponent: () => import('./features/resident/pages/resident-booking-detail/resident-booking-detail.component').then(m => m.ResidentBookingDetailComponent) },
      /** 功能頁面：公設預約詳情頁 */
      { path: 'facility-bookings/:id', loadComponent: () => import('./features/resident/pages/resident-booking-detail/resident-booking-detail.component').then(m => m.ResidentBookingDetailComponent) },
      /** 功能頁面：公告列表頁 */
      { path: 'announcements', loadComponent: () => import('./features/announcements/pages/announcements/announcements.component').then(m => m.AnnouncementsComponent) },
      /** 功能頁面：公告詳情頁 */
      { path: 'announcements/:id', loadComponent: () => import('./features/resident/pages/resident-announcement-detail/resident-announcement-detail.component').then(m => m.ResidentAnnouncementDetailComponent) },
      /** 功能頁面：個人中心頁 */
      { path: 'profile', loadComponent: () => import('./features/profile/pages/profile/profile.component').then(m => m.ProfileComponent) }
    ]
  },

  // ===== 管理端 AdminLayout =====
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['admin'])],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      /** 功能頁面：管理員首頁 */
      { path: 'dashboard', loadComponent: () => import('./features/admin/pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      /** 功能頁面：住戶管理頁 */
      { path: 'residents', loadComponent: () => import('./features/admin/pages/admin-residents/admin-residents.component').then(m => m.AdminResidentsComponent) },
      /** 功能頁面：新增住戶頁 */
      { path: 'residents/create', loadComponent: () => import('./features/admin/pages/admin-create-resident/admin-create-resident.component').then(m => m.AdminCreateResidentComponent) },
      /** 功能頁面：員工邀請頁 */
      { path: 'staff-invite', loadComponent: () => import('./features/admin/pages/admin-staff-invite/admin-staff-invite.component').then(m => m.AdminStaffInviteComponent) },
      /** 功能頁面：管理員包裹管理頁 */
      { path: 'parcels', loadComponent: () => import('./features/admin/pages/admin-parcels/admin-parcels.component').then(m => m.AdminParcelsComponent) },
      /** 功能頁面：管理員報修管理頁 */
      { path: 'maintenance', loadComponent: () => import('./features/admin/pages/admin-maintenance/admin-maintenance.component').then(m => m.AdminMaintenanceComponent) },
      /** 功能頁面：管理員公設管理頁 */
      { path: 'facilities', loadComponent: () => import('./features/admin/pages/admin-facilities/admin-facilities.component').then(m => m.AdminFacilitiesComponent) },
      /** 功能頁面：管理員公告管理頁 */
      { path: 'announcements', loadComponent: () => import('./features/admin/pages/admin-announcements/admin-announcements.component').then(m => m.AdminAnnouncementsComponent) },
      /** 功能頁面：系統設定頁 */
      { path: 'settings', loadComponent: () => import('./features/admin/pages/admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent) }
    ]
  },

  { path: '**', redirectTo: 'auth/welcome' }
];
