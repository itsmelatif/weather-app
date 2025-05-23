import { TestBed } from '@angular/core/testing';
import { WeatherQuery } from './weather.query';
import { WeatherStore } from './weather.store';
import { mockWeatherCity } from '../mocks/data';
import { skip } from 'rxjs';

describe('WeatherQuery', () => {
  let query: WeatherQuery;
  let store: WeatherStore;

  const initialState = {
    cities: mockWeatherCity,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherStore, WeatherQuery],
    });

    store = TestBed.inject(WeatherStore);
    query = TestBed.inject(WeatherQuery);

    store.update(initialState);
  });

  it('Test Case #1 - should be created', () => {
    expect(query).toBeTruthy();
  });

  describe('Test Case #2 - getCities$', () => {
    it('Test Case #2.1 - should return cities from state', (done) => {
      query.getCities$.subscribe((cities) => {
        expect(cities).toEqual(initialState.cities);
        done();
      });
    });

    it('Test Case #2.2 - should emit when cities change', (done) => {
      const newCities = [...initialState.cities, ...mockWeatherCity];

      let emissions = 0;
      query.getCities$.subscribe((cities) => {
        emissions++;
        if (emissions === 1) {
          expect(cities).toEqual(initialState.cities);
        } else if (emissions === 2) {
          expect(cities).toEqual(newCities);
          done();
        }
      });

      store.update({ cities: newCities });
    });
  });

  describe('Test Case #3 - getLoading$', () => {
    it('Test Case #3.1 - should return loading state', (done) => {
      query.getLoading$.subscribe((loading) => {
        expect(loading).toBe(false);
        done();
      });
    });

    it('Test Case #3.2 - should emit when loading changes', (done) => {
      let emissions = 0;
      query.getLoading$.subscribe((loading) => {
        emissions++;
        if (emissions === 1) {
          expect(loading).toBe(false);
        } else if (emissions === 2) {
          expect(loading).toBe(true);
          done();
        }
      });

      store.update({ loading: true });
    });
  });

  describe('Test Case #4 - getError$', () => {
    it('Test Case #4.1 - should return error state', (done) => {
      query.getError$.subscribe((error) => {
        expect(error).toBe(null);
        done();
      });
    });

    it('Test Case #4.2 - should emit when error changes', (done) => {
      const testError = 'API Error';

      let emissions = 0;
      query.getError$.subscribe((error) => {
        emissions++;
        if (emissions === 1) {
          expect(error).toBe(null);
        } else if (emissions === 2) {
          expect(error).toEqual(testError);
          done();
        }
      });

      store.update({ error: testError });
    });
  });
});
