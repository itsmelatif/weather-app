import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { WeatherCardComponent } from '@featured/weather-dashboard/component/weather-card/weather-card.component';
import { WeatherSearchComponent } from '@featured/weather-dashboard/component/weather-search/weather-search.component';
import { WeatherQuery } from '@featured/weather-dashboard/state/weather.query';
import { WeatherService } from '@featured/weather-dashboard/services/weather.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-weather-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    AsyncPipe,
    WeatherCardComponent,
    WeatherSearchComponent,
    TranslateModule
  ],
  standalone: true,
  templateUrl: './weather-page.component.html',
  styleUrl: './weather-page.component.scss',
})
export class WeatherPageComponent implements OnInit {

  cityName = '';

  constructor(
    private weatherService: WeatherService,
    private weatherQuery: WeatherQuery
  ) {}

  ngOnInit(): void {
    this.weatherService.updateCitiesToStore();
  }

  get cities$() {
    return this.weatherQuery.getCities$;
  }

  get loading$() {
    return this.weatherQuery.getLoading$;
  }
}
