import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather.service';
import { HttpClient } from '@angular/common/http';
import { WeatherStore } from '../state/weather.store';
import { ToastNotificationService } from '@shared/components/toast-notification/toast-notification.service';
import { TranslateService } from '@ngx-translate/core';
import { MockService } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import {
  IWeatherLatLang,
  IWeatherResponse,
} from '@featured/weather-dashboard/models/weather.interface';
import {
  mockWeatherCity,
  mockWeatherLatLang,
} from '@/app/featured/weather-dashboard/mocks/data';

describe('WeatherService', () => {
  let service: WeatherService;
  let http: jasmine.SpyObj<HttpClient>;
  let store: jasmine.SpyObj<WeatherStore>;
  let toast: jasmine.SpyObj<ToastNotificationService>;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        {
          provide: HttpClient,
          useValue: jasmine.createSpyObj('HttpClient', ['get']),
        },
        { provide: WeatherStore, useValue: MockService(WeatherStore) },
        {
          provide: ToastNotificationService,
          useValue: jasmine.createSpyObj('ToastNotificationService', [
            'addToast',
          ]),
        },
        {
          provide: TranslateService,
          useValue: jasmine.createSpyObj('TranslateService', ['instant']),
        },
      ],
    });
    service = TestBed.inject(WeatherService);
    http = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    store = TestBed.inject(WeatherStore) as jasmine.SpyObj<WeatherStore>;
    toast = TestBed.inject(
      ToastNotificationService
    ) as jasmine.SpyObj<ToastNotificationService>;
    translate = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;
  });

  it('Test Case #1 - should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test Case #2 - Get City', () => {
    it('Test Case #2.1 - should return lat/lon when city is found', (done) => {
      const mockResult: IWeatherLatLang[] = mockWeatherLatLang;
      const cityName = mockWeatherLatLang[0].name;
      http.get.and.returnValue(of(mockResult));

      service.getLatLang(cityName).subscribe((res) => {
        expect(res.name).toBe(cityName);
        done();
      });
    });

    it('Test Case #2.2 - should show toast and throw error when city is not found', (done) => {
      http.get.and.returnValue(of([]));
      translate.instant.and.returnValue('City not found');

      service.getLatLang('UnknownCity').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('City not found');
          expect(toast.addToast).toHaveBeenCalledWith(
            'City not found',
            'error'
          );
          done();
        },
      });
    });
  });

  describe('Test Case #3 - Get Weather', () => {
    it('Test Case #3.1 - should call HttpClient.get with lat/lon params', (done) => {
      const cityName = mockWeatherLatLang[0].name;
      const mockWeather = { name: cityName, cod: 200 } as IWeatherResponse;
      http.get.and.returnValue(of(mockWeather));

      service.getWeather(51.5, -0.1).subscribe((res) => {
        expect(http.get).toHaveBeenCalledWith(
          jasmine.stringMatching(/data\/2\.5\/weather/),
          jasmine.any(Object)
        );
        expect(res.name).toBe(cityName);
        done();
      });
    });

    it('Test Case #3.2 - should handle errors and show toast', (done) => {
      const errorResponse = {
        error: { message: 'API error' },
      };

      http.get.and.returnValue(throwError(() => errorResponse));

      service.getWeather(0, 0).subscribe({
        error: (err) => {
          expect(toast.addToast).toHaveBeenCalledWith('API error', 'error');
          expect(err.message).toBe('API error');
          done();
        },
      });
    });
  });

  describe('Test Case #4 - CRUD Cities', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([]));
      spyOn(localStorage, 'setItem');
      spyOn(store, 'update');
    });

    it('Test Case #4.1 - should add a city to local storage', () => {
      const city = mockWeatherCity[0];
      service.addCity(city);

      expect(localStorage.setItem).toHaveBeenCalled();
      expect(store.update).toHaveBeenCalled();
    });

    it('Test Case #4.2 - should remove a city from local storage', () => {
      const city = mockWeatherCity[0];
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify([city])
      );
      service.removeCity(city.name);
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('Test Case #4.3 - should update a city in local storage', () => {
      const city = mockWeatherCity[0];
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        JSON.stringify([{ name: city.name, temp: 30 }])
      );
      service.updateCity(city);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
