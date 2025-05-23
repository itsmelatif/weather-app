import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { IWeatherCity } from '@featured/weather-dashboard/models/weather.interface';
import { WeatherService } from '@featured/weather-dashboard/services/weather.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ButtonIconComponent } from '@shared/components/button-icon/button-icon.component';
import { environment } from '@/environments/environment';
import { DatePipe } from '@angular/common';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TooltipDirective } from '@shared/directives/tooltip.directive';

@Component({
  selector: 'app-weather-card',
  imports: [
    FontAwesomeModule,
    ButtonIconComponent,
    SpinnerComponent,
    TooltipDirective
  ],
  providers: [DatePipe],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.scss',
})
export class WeatherCardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() city!: IWeatherCity;
  loading = signal(false);
  weather = signal<IWeatherCity | null>(null);
  faRemove = faXmark;
  faRefresh = faRefresh;

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeCity(): void {
    this.weatherService.removeCity(this.city.name);
  }

  refreshCity(): void {
    if (this.city && this.city.lat && this.city.lon) {
      this.loading.set(true);
      this.weatherService
        .getWeather(this.city.lat, this.city.lon)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => this.loading.set(false))
        )
        .subscribe({
          next: (res) => {
            const newCity: IWeatherCity = {
              ...this.city,
              temp: res.main.temp,
              condition: res.weather[0].main,
              description: res.weather[0].description,
              icon: `${environment.API_URL_IMAGE}${res.weather[0].icon}@2x.png`,
              lastUpdate:
                this.datePipe.transform(new Date(), 'MMM d, yyyy hh:mm a') || '',
            };

            this.weatherService.updateCity(newCity);
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }
}
