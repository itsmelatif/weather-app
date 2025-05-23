import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';
import { MockComponent } from 'ng-mocks';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, MockComponent(SpinnerComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test Case #2 - Label State', () => {
    it('Test Case #2.1 - should display the label when not loading', () => {
      component.label = 'Submit';
      component.loading = false;
      fixture.detectChanges();

      expect(buttonElement.textContent?.trim()).toBe('Submit');
      expect(fixture.nativeElement.querySelector('app-spinner')).toBeNull();
    });
  });

  describe('Test Case #3 - Disabled State', () => {
    it('Test Case #3.1 - should be disabled when disabled input is true', () => {
      component.disabled = true;
      fixture.detectChanges();
      expect(buttonElement.disabled).toBeTrue();
    });

    it('Test Case #3.2 - should be disabled when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();
      expect(buttonElement.disabled).toBeTrue();
    });

    it('Test Case #3.3 - should not be disabled when disabled / loading is false', () => {
      component.disabled = false;
      component.loading = false;
      fixture.detectChanges();
      expect(buttonElement.disabled).toBeFalse();
    });

    it('Test Case #3.4 - should have disabled state classes', () => {
      expect(buttonElement.classList).toContain('disabled:opacity-50');
      expect(buttonElement.classList).toContain('disabled:cursor-not-allowed');
      expect(buttonElement.classList).toContain('disabled:hover:bg-blue-500');
    });
  });

  describe('Test Case #4 - Click Event', () => {
    it('Test Case #4.1 - should emit onClick when clicked and not disabled/loading', () => {
      spyOn(component.onClick, 'emit');
      component.disabled = false;
      component.loading = false;
      fixture.detectChanges();

      buttonElement.click();
      expect(component.onClick.emit).toHaveBeenCalled();
    });

    it('Test Case #4.2 - should not emit onClick when disabled', () => {
      spyOn(component.onClick, 'emit');
      component.disabled = true;
      fixture.detectChanges();

      buttonElement.click();
      expect(component.onClick.emit).not.toHaveBeenCalled();
    });

    it('Test Case #4.3 - should not emit onClick when loading', () => {
      spyOn(component.onClick, 'emit');
      component.loading = true;
      fixture.detectChanges();

      buttonElement.click();
      expect(component.onClick.emit).not.toHaveBeenCalled();
    });
  });

  describe('Test Case #5 - Loading State', () => {
    it('Test Case #5.1 - should show spinner when loading is true', () => {
      component.loading = true;
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('app-spinner');
      expect(spinner).toBeTruthy();
    });

    it('Test Case #5.2 - should not show spinner when loading is false', () => {
      component.loading = false;
      fixture.detectChanges();

      const spinner = fixture.nativeElement.querySelector('app-spinner');
      expect(spinner).toBeNull();
    });

    it('Test Case #5.3 - should display loading label when loading', () => {
      const testLoadingLabel = 'Please wait...';
      component.loadingLabel = testLoadingLabel;
      component.loading = true;
      fixture.detectChanges();

      expect(buttonElement.textContent).toContain(testLoadingLabel);
    });
  });
});
