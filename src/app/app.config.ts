import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

export const API_URL = new InjectionToken<string>('api-url');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'https://69250dc182b59600d7222b0e.mockapi.io' },
    provideRouter(routes),
    provideHttpClient(withFetch()),
  ]
};
