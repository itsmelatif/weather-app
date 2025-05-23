import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeatherSearchComponent } from './weather-search.component';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { MockComponent, MockModule, MockPipe, MockProvider } from 'ng-mocks';
import { WeatherService } from '@featured/weather-dashboard/services/weather.service';
import { ButtonComponent } from '@shared/components/button/button.component';
import { HelperTextMsgComponent } from '@shared/components/helper-text-msg/helper-text-msg.component';
import { SearchInputComponent } from '@shared/components/search-input/search-input.component';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { IWeatherLatLang } from '@featured/weather-dashboard/models/weather.interface';
import { mockWeatherLatLang } from '@featured/weather-dashboard/mocks/data';

describe('WeatherSearchComponent', () => {
  let component: WeatherSearchComponent;
  let fixture: ComponentFixture<WeatherSearchComponent>;
  let weatherService: WeatherService;
  let translateService: TranslateService;
  const langChangeEmitter = new EventEmitter();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MockModule(TranslateModule),
        MockPipe(TranslatePipe, (value) => `MOCK_${value}`),
        WeatherSearchComponent,
      ],
      providers: [
        MockProvider(WeatherService, {
          getLatLang: jasmine.createSpy('getLatLang').and.returnValue(of(mockWeatherLatLang[0])),
          getWeather: jasmine.createSpy('getWeather').and.returnValue(of({
            main: { temp: 15 },
            weather: [
              {
                main: 'Clouds',
                description: 'scattered clouds',
                icon: '03d'
              }
            ]
          })),
          addCity: jasmine.createSpy('addCity'),
        }),
        MockProvider(DatePipe, {
          transform: jasmine
            .createSpy('transform')
            .and.returnValue('Mocked Date'),
        }),
        MockProvider(TranslateService, {
          onLangChange: langChangeEmitter,
          instant: jasmine.createSpy('instant').and.callFake((key) => key),
        }),
      ],
    })
      .overrideComponent(WeatherSearchComponent, {
        remove: {
          imports: [
            ButtonComponent,
            HelperTextMsgComponent,
            SearchInputComponent,
          ],
        },
        add: {
          imports: [
            MockComponent(ButtonComponent),
            MockComponent(HelperTextMsgComponent),
            MockComponent(SearchInputComponent),
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(WeatherSearchComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(WeatherService);
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Case #2 - should initialize form control with validators', () => {
    expect(component.cityName).toBeTruthy();
    const validators = component.cityName.validator;
    expect(validators).toBeTruthy();

    component.cityName.setValue('');
    expect(component.cityName.hasError('required')).toBeTrue();

    component.cityName.setValue('ab');
    expect(component.cityName.hasError('minlength')).toBeTrue();

    component.cityName.setValue('a'.repeat(101));
    expect(component.cityName.hasError('maxlength')).toBeTrue();

    component.cityName.setValue('123');
    expect(component.cityName.hasError('pattern')).toBeTrue();
  });

  describe('Test Case #3 - Form Validation', () => {
    it('Test Case #3.1 - should show error when empty and touched', () => {
      component.cityName.setValue('');
      component.cityName.markAsTouched();
      fixture.detectChanges();

      expect(component.errorCityName()).toBeTrue();
      expect(component.msgErrorCityName()).toContain('required');
    });

    it('Test Case #3.2 - should show error when too short', () => {
      component.cityName.setValue('ab');
      component.cityName.markAsTouched();
      fixture.detectChanges();

      expect(component.errorCityName()).toBeTrue();
      expect(component.msgErrorCityName()).toContain('3 characters');
    });

    it('Test Case #3.3 - should show error when invalid pattern', () => {
      component.cityName.setValue('123');
      component.cityName.markAsTouched();
      fixture.detectChanges();

      expect(component.errorCityName()).toBeTrue();
      expect(component.msgErrorCityName()).toContain('letters and spaces');
    });
  });

  describe('Test Case #4 - Add City Functionality', () => {
    const mockCity = 'London';
    const mockLatLang: IWeatherLatLang = mockWeatherLatLang[0];
    const mockWeatherData = {
      main: { temp: 15 },
      weather: [
        {
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03d'
        }
      ]
    };

    it('Test Case #4.1 - should call service when form is valid', () => {
      component.cityName.setValue(mockCity);
      fixture.detectChanges();

      const button = fixture.debugElement.query(
        By.directive(MockComponent(ButtonComponent))
      );
      button.triggerEventHandler('onClick', null);

      expect(weatherService.getLatLang).toHaveBeenCalledWith(mockCity);
    });

    it('Test Case #4.2 - should not call service when form is invalid', () => {
      component.cityName.setValue('');
      fixture.detectChanges();

      const button = fixture.debugElement.query(
        By.directive(MockComponent(ButtonComponent))
      );
      button.triggerEventHandler('onClick', null);

      expect(weatherService.getLatLang).not.toHaveBeenCalled();
    });

    it('Test Case #4.3 - should handle successful city addition', () => {
      (weatherService.getLatLang as jasmine.Spy).and.returnValue(
        of(mockLatLang)
      );
      (weatherService.getWeather as jasmine.Spy).and.returnValue(
        of(mockWeatherData)
      );

      component.cityName.setValue(mockCity);
      component.addCity();

      expect(component.loading()).toBeFalse();
      expect(weatherService.addCity).toHaveBeenCalled();
      expect(component.cityName.value).toBeNull();
    });

    it('Test Case #4.4 - should handle error from getLatLang', () => {
      (weatherService.getLatLang as jasmine.Spy).and.returnValue(
        throwError(() => new Error('API Error'))
      );

      component.cityName.setValue(mockCity);
      component.addCity();

      expect(component.loading()).toBeFalse();
      expect(weatherService.addCity).not.toHaveBeenCalled();
    });

    it('Test Case #4.5 - should handle error from getWeather', () => {
      (weatherService.getLatLang as jasmine.Spy).and.returnValue(
        of(mockLatLang)
      );
      (weatherService.getWeather as jasmine.Spy).and.returnValue(
        throwError(() => new Error('API Error'))
      );

      component.cityName.setValue(mockCity);
      component.addCity();

      expect(component.loading()).toBeFalse();
      expect(weatherService.addCity).not.toHaveBeenCalled();
    });
  });

  describe('Test Case #5 - UI Components', () => {
    it('Test Case #5.1 - should render search input with proper bindings', () => {
      const searchInput = fixture.debugElement.query(
        By.directive(MockComponent(SearchInputComponent))
      );
      expect(searchInput).toBeTruthy();
      expect(searchInput.componentInstance.control).toBe(component.cityName);
      expect(searchInput.componentInstance.placeholder).toContain(
        'MOCK_weather.search.placeholder'
      );
    });

    it('Test Case #5.2 - should render button with proper bindings', () => {
      const button = fixture.debugElement.query(
        By.directive(MockComponent(ButtonComponent))
      );
      expect(button).toBeTruthy();
      expect(button.componentInstance.label).toContain('MOCK_weather.add_city');
    });

    it('Test Case #5.3 - should show error message when invalid', () => {
      component.cityName.setValue('');
      component.cityName.markAsTouched();
      fixture.detectChanges();

      const errorMsg = fixture.debugElement.query(
        By.directive(MockComponent(HelperTextMsgComponent))
      );
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.componentInstance.type).toBe('error');
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
