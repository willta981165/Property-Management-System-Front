export type ResidentRole = "resident" | "family";

/**
 * Swagger 目前將 residents item 定義為 generic object。
 * 以下欄位來自住戶 CRUD contract；未保證回傳的欄位維持 optional。
 */
export interface Resident {
  id?: number;
  name?: string;
  unit_code?: string;
  phone?: string | null;
  email?: string | null;
  role?: ResidentRole;
  notes?: string | null;
  is_active?: boolean;
  [key: string]: unknown;
}

export interface ResidentListQuery {
  page?: number;
  per_page?: number;
  role?: ResidentRole;
}

export interface ResidentListResponse {
  page: number;
  pages: number;
  residents: Resident[];
  total: number;
}

export interface CreateResidentRequest {
  name: string;
  unit_code: string;
  password: string;
  phone?: string;
  email?: string;
  role?: ResidentRole;
  notes?: string;
}

export interface UpdateResidentRequest {
  name?: string;
  unit_code?: string;
  password?: string;
  phone?: string;
  email?: string;
  role?: ResidentRole;
  notes?: string;
  is_active?: boolean;
}
