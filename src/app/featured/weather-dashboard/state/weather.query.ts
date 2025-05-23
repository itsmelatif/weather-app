import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { IWeatherState } from '@featured/weather-dashboard/models/weather.interface';
import { WeatherStore } from '@featured/weather-dashboard/state/weather.store';

@Injectable({ providedIn: 'root' })
export class WeatherQuery extends Query<IWeatherState> {
  readonly getCities$;
  readonly getLoading$;
  readonly getError$;

  constructor(protected override store: WeatherStore) {
    super(store);

    this.getCities$ = this.select((state) => state.cities);
    this.getLoading$ = this.select((state) => state.loading);
    this.getError$ = this.select((state) => state.error);
  }
}
