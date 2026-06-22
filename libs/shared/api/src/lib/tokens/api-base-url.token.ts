import { InjectionToken } from "@angular/core";

/**
 * API 主機網址，由 App environment 在 bootstrap 時提供。
 */
export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");
