import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherCardComponent } from './weather-card.component';
import { WeatherService } from '@featured/weather-dashboard/services/weather.service';
import {
  MockComponent,
  MockProvider
} from 'ng-mocks';
import { ButtonIconComponent } from '@shared/components/button-icon/button-icon.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRefresh, faXmark } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { IWeatherCity } from '@featured/weather-dashboard/models/weather.interface';
import { By } from '@angular/platform-browser';
import { mockWeatherCity } from '@featured/weather-dashboard/mocks/data';

describe('WeatherCardComponent', () => {
  let component: WeatherCardComponent;
  let fixture: ComponentFixture<WeatherCardComponent>;
  let weatherService: WeatherService;
  let datePipe: DatePipe;

  const mockCity: IWeatherCity = mockWeatherCity[0]

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockComponent(ButtonIconComponent),
        MockComponent(SpinnerComponent),
        FontAwesomeModule
      ],
      declarations: [WeatherCardComponent],
      providers: [
        MockProvider(WeatherService, {
          removeCity: jasmine.createSpy('removeCity'),
          updateCity: jasmine.createSpy('updateCity'),
          getWeather: jasmine.createSpy('getWeather').and.returnValue(of({
            main: { temp: mockWeatherCity[0].temp },
            weather: [{
              main: mockWeatherCity[0].condition,
              description: mockWeatherCity[0].description,
              icon: mockWeatherCity[0].icon
            }]
          }))
        }),
        MockProvider(DatePipe, {
          transform: jasmine.createSpy('transform').and.returnValue('Jun 1, 2023 12:30 PM')
        }),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherCardComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    datePipe = TestBed.inject(DatePipe);
    component.city = mockCity;
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Case #2 - should initialize with correct icons', () => {
    expect(component.faRemove).toBe(faXmark);
    expect(component.faRefresh).toBe(faRefresh);
  });

  describe('Test Case #3 - Template Rendering', () => {
    it('Test Case #3.1 - should display city information when not loading', () => {
      component.loading.set(false);
      fixture.detectChanges();

      const cityName = fixture.nativeElement.querySelector('h2');
      const temp = fixture.nativeElement.querySelector('.text-5xl');
      const icon = fixture.nativeElement.querySelector('img');

      expect(cityName.textContent).toContain(`${mockCity.name} - ${mockCity.country}`);
      expect(temp.textContent).toContain(`${mockCity.temp}°C`);
      expect(icon.src).toContain(`${mockCity.icon}`);
    });

    it('Test Case #3.2 - should show spinner when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(
        By.directive(MockComponent(SpinnerComponent))
      );
      expect(spinner).toBeTruthy();
    });
  });

  describe('Test Case #4 - Button Actions', () => {
    it('Test Case #4.1 - should call removeCity when remove button is clicked', () => {
      const buttons = fixture.debugElement.queryAll(
        By.directive(MockComponent(ButtonIconComponent))
      );
      buttons[0].triggerEventHandler('onClick', null);

      expect(weatherService.removeCity).toHaveBeenCalledWith(mockCity.name);
    });

    it('Test Case #4.2 - should call refreshCity when refresh button is clicked', () => {
      const buttons = fixture.debugElement.queryAll(
        By.directive(MockComponent(ButtonIconComponent))
      );
      buttons[1].triggerEventHandler('onClick', null);

      expect(weatherService.getWeather).toHaveBeenCalledWith(mockCity.lat, mockCity.lon);
    });
  });

  describe('Test Case #5 - Refresh City Functionality', () => {
    it('Test Case #5.1 - should update city data on successful refresh', () => {
      component.refreshCity();

      expect(component.loading()).toBeFalse();
      expect(weatherService.updateCity).toHaveBeenCalledWith({
        ...mockCity,
        temp: mockWeatherCity[0].temp,
        condition: mockWeatherCity[0].condition,
        description: mockWeatherCity[0].description,
        icon: jasmine.stringContaining(`${mockWeatherCity[0].icon}@2x.png`),
        lastUpdate: jasmine.any(String)
      });
    });

    it('Test Case #5.2 - should handle error during refresh', () => {
      (weatherService.getWeather as jasmine.Spy).and.returnValue(
        throwError(() => new Error('API Error'))
      );
      spyOn(console, 'error');

      component.refreshCity();

      expect(component.loading()).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('Test Case #6 - should clean up subscriptions on destroy', () => {
    spyOn(component['destroy$'], 'next');
    spyOn(component['destroy$'], 'complete');

    fixture.destroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
