import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInputComponent } from './search-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MockComponent, MockModule } from 'ng-mocks';
import {
  FaIconComponent,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchInputComponent,
        MockModule(FormsModule),
        MockModule(ReactiveFormsModule),
      ],
    })
      .overrideComponent(SearchInputComponent, {
        remove: {
          imports: [FontAwesomeModule],
        },
        add: {
          imports: [MockComponent(FaIconComponent)],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    component.control = new FormControl('');
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test Case #2 - Input Rendering', () => {
    it('Test Case #2.1 - should render search icon', () => {
      const searchIcon = fixture.nativeElement.querySelector('#search-icon');
      expect(searchIcon).toBeTruthy();
    });

    it('Test Case #2.2 - should show clear icon when control has value', () => {
      component.control.setValue('test');
      fixture.detectChanges();

      const clearIcon = fixture.nativeElement.querySelector('#clear-icon');
      expect(clearIcon).toBeTruthy();
    });

    it('Test Case #2.3 - should not show clear icon when control is empty', () => {
      component.control.setValue('');
      fixture.detectChanges();

      const clearIcon = fixture.nativeElement.querySelector('#clear-icon');
      expect(clearIcon).toBeNull();
    });
  });

  describe('Test Case #3 - Input Functionality', () => {
    it('Test Case #3.1 - should apply red border when invalid is true', () => {
      component.invalid = true;
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.classList.contains('border-red-500')).toBeTrue();
    });

    it('Test Case #3.2 - should apply default border when invalid is false', () => {
      component.invalid = false;
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.classList.contains('border-gray-500')).toBeTrue();
    });

    it('Test Case #3.3 - should display placeholder text', () => {
      const testPlaceholder = 'Search here...';
      component.placeholder = testPlaceholder;
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      expect(input.placeholder).toBe(testPlaceholder);
    });
  });

  describe('Test Case #4 - Events', () => {
    it('Test Case #4.1 - should emit enter event with value on enter key', () => {
      const testValue = 'test';
      spyOn(component.enter, 'emit');
      component.control.setValue(testValue);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(component.enter.emit).toHaveBeenCalledWith(testValue);
    });

    it('Test Case #4.2 - should clear control on enter', () => {
      component.control.setValue('test');
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));

      expect(component.control.value).toBe('');
    });

    it('Test Case #4.3 - should emit clear event on clear click', () => {
      component.control.setValue('test');
      fixture.detectChanges();
      spyOn(component.clear, 'emit');

      const clearIcon = fixture.nativeElement.querySelector('#clear-icon');
      clearIcon.click();

      expect(component.clear.emit).toHaveBeenCalled();
    });

    it('Test Case #4.4 - should reset control on clear', () => {
      component.control.setValue('test');
      fixture.detectChanges();

      const clearIcon = fixture.nativeElement.querySelector('#clear-icon');
      clearIcon.click();

      expect(component.control.value).toBeNull();
    });
  });
});
