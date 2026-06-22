import { HttpParams } from "@angular/common/http";

export type HttpQueryValue =
  | string
  | number
  | boolean
  | readonly (string | number | boolean)[]
  | null
  | undefined;

/**
 * 將 typed query object 轉換為 HttpParams。
 */
export function buildHttpParams<TQuery extends object>(
  query?: TQuery
): HttpParams {
  let params = new HttpParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    const values = Array.isArray(value) ? value : [value];

    for (const item of values) {
      params = params.append(key, String(item));
    }
  }

  return params;
}
