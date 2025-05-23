import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs';
import { WeatherService } from '@featured/weather-dashboard/services/weather.service';
import { IWeatherLatLang } from '@featured/weather-dashboard/models/weather.interface';
import { environment } from '@/environments/environment';
import { ButtonComponent } from '@shared/components/button/button.component';
import { HelperTextMsgComponent } from '@shared/components/helper-text-msg/helper-text-msg.component';
import { helperText } from '@shared/utils/helper-text.util';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-weather-search',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    HelperTextMsgComponent,
    SearchInputComponent,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './weather-search.component.html',
  styleUrl: './weather-search.component.scss',
})
export class WeatherSearchComponent implements OnInit, OnDestroy {
  cityName: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/),
  ]);
  loading = signal(false);
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addCity(): void {
    if (this.cityName.invalid) return;

    this.loading.set(true);
    this.weatherService
      .getLatLang(this.cityName.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.renderWeather(data);
        },
        error: (err) => {
          this.loading.set(false);
          console.log(err);
        },
      });
  }

  errorCityName(): boolean {
    return this.cityName.invalid && this.cityName.touched;
  }

  msgErrorCityName(): string {
    if (this.cityName.errors?.['required'])
      return helperText({ error: 'required' });
    if (this.cityName.errors?.['minlength'])
      return helperText({
        error: 'minlength',
        params: this.cityName.errors?.['minlength'].requiredLength,
      });
    if (this.cityName.errors?.['maxlength'])
      return helperText({
        error: 'maxlength',
        params: this.cityName.errors?.['maxlength'].requiredLength,
      });
    if (this.cityName.errors?.['pattern'])
      return helperText({ error: 'alpha_spaces' });
    return '';
  }

  private renderWeather(city: IWeatherLatLang): void {
    this.weatherService
      .getWeather(city.lat, city.lon)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (res) => {
          this.cityName.reset();
          this.weatherService.addCity({
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            country: city.country,
            temp: res.main.temp,
            condition: res.weather[0].main,
            description: res.weather[0].description,
            icon: `${environment.API_URL_IMAGE}${res.weather[0].icon}@2x.png`,
            lastUpdate: this.datePipe.transform(new Date(), 'MMM d, yyyy hh:mm a') || '',
          });
        },
        error: (err) => {
          this.loading.set(false);
          console.log(err);
        },
      });
  }
}
