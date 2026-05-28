import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { SystemConfig } from './system-config.model';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService {
  private readonly config$;

  constructor(private readonly http: HttpClient) {
    this.config$ = this.http
      .get<SystemConfig>('assets/configs/system.json')
      .pipe(shareReplay({ bufferSize: 1, refCount: false }));
  }

  getConfig(): Observable<SystemConfig> {
    return this.config$;
  }
}
