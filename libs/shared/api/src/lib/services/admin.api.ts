import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

import {
  CreateResidentRequest,
  ResidentListQuery,
  ResidentListResponse,
  UpdateResidentRequest,
} from "../models/admin.model";
import { ApiMessageResponse } from "../models/common.model";
import { API_BASE_URL } from "../tokens/api-base-url.token";
import { buildHttpParams } from "../utils/http-params.util";

@Injectable({
  providedIn: "root",
})
export class AdminApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  getResidents(query?: ResidentListQuery): Observable<ResidentListResponse> {
    return this.http.get<ResidentListResponse>(
      `${this.baseUrl}/api/admin/residents`,
      {
        params: buildHttpParams(query),
      }
    );
  }

  createResident(
    payload: CreateResidentRequest
  ): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(
      `${this.baseUrl}/api/admin/residents`,
      payload
    );
  }

  updateResident(
    residentId: number,
    payload: UpdateResidentRequest
  ): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(
      `${this.baseUrl}/api/admin/residents/${residentId}`,
      payload
    );
  }

  deleteResident(residentId: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(
      `${this.baseUrl}/api/admin/residents/${residentId}`
    );
  }
}
