export interface IWeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface IWeatherCity {
  name: string;
  lat: number;
  lon: number;
  country: string;
  temp: number;
  condition: string;
  description: string;
  icon: string;
  lastUpdate: string;
}

export interface IWeatherLatLang {
  name: string;
  local_names?: any;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

export interface IWeatherResponse {
  coord: ICoord;
  weather: IWeather[];
  base: string;
  main: IMainWeather;
  visibility: number;
  wind: IWind;
  clouds: IClouds;
  dt: number;
  sys: ISys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ICoord {
  lon: number;
  lat: number;
}

export interface IWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface IMainWeather {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}

export interface IWind {
  speed: number;
  deg: number;
}

export interface IClouds {
  all: number;
}

export interface ISys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface IWeatherState {
  cities: IWeatherCity[];
  loading: boolean;
  error: string | null;
}

export function createInitialState(): IWeatherState {
  return {
    cities: [],
    loading: false,
    error: null,
  };
}
