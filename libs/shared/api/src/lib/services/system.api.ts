import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HealthResponse } from "../models/system.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";

@Injectable({
  providedIn: "root",
})
export class SystemApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  health(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`);
  }
}
