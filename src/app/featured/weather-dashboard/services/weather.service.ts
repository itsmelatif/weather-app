import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import {
  IWeatherCity,
  IWeatherLatLang,
  IWeatherResponse,
} from '@featured/weather-dashboard/models/weather.interface';
import { WeatherStore } from '@featured/weather-dashboard/state/weather.store';
import { ToastNotificationService } from '@shared/components/toast-notification/toast-notification.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private weatherStore: WeatherStore,
    private toastService: ToastNotificationService,
    private translate: TranslateService
  ) {}

  private loadCitiesFromStorage(): IWeatherCity[] {
    const savedCities = localStorage.getItem('weatherDashboardCities');
    if (savedCities) {
      return JSON.parse(savedCities);
    }
    return [];
  }

  private saveCitiesToStorage(cities: IWeatherCity[]): void {
    localStorage.setItem('weatherDashboardCities', JSON.stringify(cities));
    this.updateCitiesToStore();
  }

  updateCitiesToStore(): void {
    const cities = this.loadCitiesFromStorage();
    this.weatherStore.update((state) => ({
      ...state,
      cities: cities,
    }));
  }

  getWeather(lat: number, lon: number): Observable<IWeatherResponse> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lon', lon)
      .set('units', 'metric');

    return this.http.get<IWeatherResponse>(`data/2.5/weather`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.loadingSubject.next(false);
        return throwError(() => {
          this.toastService.addToast(error.error.message, 'error');
          return new Error(error.error.message);
        });
      })
    );
  }

  getLatLang(cityName: string): Observable<IWeatherLatLang> {
    const params = new HttpParams().set('q', cityName).set('units', 'metric');
    return this.http.get<IWeatherLatLang[]>(`geo/1.0/direct`, { params }).pipe(
      map((data: IWeatherLatLang[]) => {
        if (data.length > 0) {
          return data[0];
        }
        this.toastService.addToast(
          this.translate.instant('weather.no_city_found'),
          'error'
        );
        throw new Error(this.translate.instant('weather.no_city_found'));
      })
    );
  }

  addCity(city: IWeatherCity): void {
    const currentCities = this.loadCitiesFromStorage();
    if (
      !currentCities.some(
        (c) => c.name.toLowerCase() === city.name.toLowerCase()
      )
    ) {
      const updatedCities = [...currentCities, city];
      this.saveCitiesToStorage(updatedCities);
    }
    this.loadingSubject.next(false);
  }

  removeCity(cityName: string): void {
    const updatedCities = this.loadCitiesFromStorage().filter(
      (city) => city.name !== cityName
    );

    this.saveCitiesToStorage(updatedCities);
  }

  updateCity(city: IWeatherCity): void {
    const updatedCities = this.loadCitiesFromStorage().map((c) =>
      c.name === city.name ? city : c
    );
    this.saveCitiesToStorage(updatedCities);
  }
}
