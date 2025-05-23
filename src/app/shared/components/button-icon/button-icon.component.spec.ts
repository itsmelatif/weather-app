import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonIconComponent } from './button-icon.component';

describe('ButtonIconComponent', () => {
  let component: ButtonIconComponent;
  let fixture: ComponentFixture<ButtonIconComponent>;
  let buttonElement: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonIconComponent);
    component = fixture.componentInstance;
    buttonElement = fixture.nativeElement.querySelector('button');
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Test Case #2 - Click Event', () => {
    it('Test Case #2.1 - should emit onClick event when clicked and not disabled', () => {
      spyOn(component.onClick, 'emit');
      component.disabled = false;
      fixture.detectChanges();

      buttonElement.click();
      expect(component.onClick.emit).toHaveBeenCalled();
    });

    it('Test Case #2.2 - should not emit onClick event when disabled', () => {
      spyOn(component.onClick, 'emit');
      component.disabled = true;
      fixture.detectChanges();

      buttonElement.click();
      expect(component.onClick.emit).not.toHaveBeenCalled();
    });

    describe('Test Case #3 - Button Types', () => {
      it('Test Case #3.1 - apply class for secondary', () => {
        expect(buttonElement.classList.contains('text-gray-400')).toBeTrue();
      });

      it('Test Case #3.2 - apply class for success', () => {
        component.type = 'success';
        fixture.detectChanges();
        expect(buttonElement.classList.contains('text-green-500')).toBeTrue();
      });

      it('Test Case #3.3 - apply class for danger', () => {
        component.type = 'danger';
        fixture.detectChanges();
        expect(buttonElement.classList.contains('text-red-500')).toBeTrue();
      });

      it('Test Case #3.4 - apply class for primary', () => {
        component.type = 'primary';
        fixture.detectChanges();
        expect(buttonElement.classList.contains('text-blue-500')).toBeTrue();
      });
    });

    describe('Test Case #4 - Icon Handling', () => {
      it('Test Case #4.1 - display custom icon when provided', () => {
        const iconElement = fixture.nativeElement.querySelector('fa-icon svg');
        expect(iconElement).toBeTruthy();
      });
    });

    describe('Test Case #5 - Disabled State', () => {
      it('Test Case #5.1 - set disabled attribute when disabled is true', () => {
        component.disabled = true;
        fixture.detectChanges();
        expect(buttonElement.disabled).toBeTrue();
      });

      it('Test Case #5.2 - not set disabled attribute when disabled is false', () => {
        component.disabled = false;
        fixture.detectChanges();
        expect(buttonElement.disabled).toBeFalse();
      });
    });
  });
});
