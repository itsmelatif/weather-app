import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import {
  IWeatherState,
  createInitialState,
} from '@featured/weather-dashboard/models/weather.interface';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'weather' })
export class WeatherStore extends Store<IWeatherState> {
  constructor() {
    super(createInitialState());
  }
}
