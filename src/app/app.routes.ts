import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '@featured/weather-dashboard/component/weather-page/weather-page.component'
      ).then((m) => m.WeatherPageComponent),
  },
];
