import {
  IWeatherCity,
  IWeatherLatLang,
} from '@featured/weather-dashboard/models/weather.interface';

export const mockWeatherLatLang: IWeatherLatLang[] = [
  {
    name: 'London',
    lat: 51.5,
    lon: -0.1,
    country: 'GB',
    state: 'England',
  },
];

export const mockWeatherCity: IWeatherCity[] = [
  {
    name: mockWeatherLatLang[0].name,
    lat: mockWeatherLatLang[0].lat,
    lon: mockWeatherLatLang[0].lon,
    country: mockWeatherLatLang[0].country,
    temp: 25,
    condition: 'Clear',
    description: 'clear sky',
    icon: '01d',
    lastUpdate: 'now',
  },
  {
    name: 'Paris',
    lat: 48.8566,
    lon: 2.3522,
    country: 'FR',
    temp: 18,
    condition: 'Clear',
    description: 'clear sky',
    icon: '01d',
    lastUpdate: 'now',
  },
];
