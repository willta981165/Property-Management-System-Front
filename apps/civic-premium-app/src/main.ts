import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { authInterceptor } from "@civic/core/auth";
import { apiErrorInterceptor } from "@civic/shared/api";
import { API_BASE_URL } from "@civic/shared/config";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { environment } from "./environments/environment";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
    provideAnimations(),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
  ],
}).catch((error) => console.error(error));
