import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { WeatherPageComponent } from './weather-page.component';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService
} from '@ngx-translate/core';
import { MockComponent, MockModule, MockPipe, MockProvider, ngMocks } from 'ng-mocks';
import { mockWeatherCity } from '@featured/weather-dashboard/mocks/data';
import { WeatherService } from '@featured/weather-dashboard/services/weather.service';
import { WeatherQuery } from '@featured/weather-dashboard/state/weather.query';
import { WeatherSearchComponent } from '@featured/weather-dashboard/component/weather-search/weather-search.component';
import { WeatherCardComponent } from '@featured/weather-dashboard/component/weather-card/weather-card.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('WeatherPageComponent', () => {
  let component: WeatherPageComponent;
  let fixture: ComponentFixture<WeatherPageComponent>;
  let weatherService: WeatherService;
  let weatherQuery: WeatherQuery;
  let translateService: TranslateService;
  const langChangeEmitter = new EventEmitter();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockModule(TranslateModule),
        MockPipe(TranslatePipe, (value) => `MOCK_${value}`),
        WeatherPageComponent
      ],
      providers: [
        MockProvider(WeatherService, {
          updateCitiesToStore: jasmine.createSpy('updateCitiesToStore')
        }),
        MockProvider(WeatherQuery, {
          getCities$: of([]),
          getLoading$: of(false)
        }),
        MockProvider(TranslateService, {
          onLangChange: langChangeEmitter,
          instant: jasmine.createSpy('instant').and.callFake((key) => key),
        })
      ]
    })
    .overrideComponent(WeatherPageComponent, {
      remove: {
        imports: [WeatherSearchComponent, WeatherCardComponent]
      },
      add: {
        imports: [
          MockComponent(WeatherSearchComponent),
          MockComponent(WeatherCardComponent)
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherPageComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    weatherQuery = TestBed.inject(WeatherQuery);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Case #2 - should initialize by calling updateCitiesToStore', () => {
    expect(weatherService.updateCitiesToStore).toHaveBeenCalled();
  });

  it('Test Case #3 - should display the title', () => {
    const title = fixture.debugElement.query(By.css('h1'));
    expect(title.nativeElement.textContent).toContain('MOCK_weather.title');
  });

  it('Test Case #4 - should include the weather search component', () => {
    const searchComponent = fixture.debugElement.query(
      By.directive(MockComponent(WeatherSearchComponent))
    );
    expect(searchComponent).toBeTruthy();
  });

  describe('Test Case #5 - Loading State', () => {
    it('Test Case #5.1 - should show loading spinner when loading', () => {
      Object.defineProperty(weatherQuery, 'getLoading$', { value: of(true) });
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('.animate-spin'));
      expect(spinner).toBeTruthy();
    });

    it('Test Case #5.2 - should not show loading spinner when not loading', () => {
      Object.defineProperty(weatherQuery, 'getLoading$', { value: of(false) });
      fixture.detectChanges();

      const spinner = fixture.debugElement.queryAll(By.css('.animate-spin'));
      expect(spinner.length).toBe(0);
    });
  });

  describe('Test Case #6 - Cities Display', () => {
    const mockCities = mockWeatherCity;

    it('Test Case #6.1 - should display weather cards for each city', () => {
      Object.defineProperty(weatherQuery, 'getCities$', { value: of(mockCities) });
      fixture.detectChanges();

      const cards = fixture.debugElement.queryAll(
        By.directive(MockComponent(WeatherCardComponent))
      );
      expect(cards.length).toBe(2);
    });

    it('Test Case #6.2 - should display no data message when cities array is empty', () => {
      Object.defineProperty(weatherQuery, 'getCities$', { value: of([]) });
      fixture.detectChanges();

      const message = fixture.debugElement.query(By.css('.text-gray-500'));
      expect(message.nativeElement.textContent).toContain('MOCK_weather.no_data');

      const cards = fixture.debugElement.queryAll(
        By.directive(MockComponent(WeatherCardComponent))
      );
      expect(cards.length).toBe(0);
    });
  });

  it('Test Case #7 - should use proper grid layout', () => {
    const container = fixture.debugElement.query(By.css('.grid'));
    expect(container.nativeElement.classList).toContain('grid-cols-1');
    expect(container.nativeElement.classList).toContain('sm:grid-cols-2');
    expect(container.nativeElement.classList).toContain('lg:grid-cols-3');
    expect(container.nativeElement.classList).toContain('gap-6');
  });
});
