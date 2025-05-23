import { ComponentFixture } from '@angular/core/testing';
import { ToastNotificationComponent } from './toast-notification.component';
import { ToastNotificationService } from './toast-notification.service';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ButtonIconComponent } from '../button-icon/button-icon.component';
import { IToastNotification } from './toast-notification.model';
import { signal, WritableSignal } from '@angular/core';

describe('ToastNotificationComponent', () => {
  let fixture: ComponentFixture<ToastNotificationComponent>;
  let toastService: ToastNotificationService;
  let toastsSignal: WritableSignal<IToastNotification[]>;

  beforeEach(() => {
    toastsSignal = signal([]);
    return MockBuilder(ToastNotificationComponent)
      .keep(FontAwesomeModule)
      .mock(ToastNotificationService, {
        toasts: toastsSignal,
        removeToast: jasmine.createSpy('removeToast'),
      })
      .mock(ButtonIconComponent);
  });

  beforeEach(() => {
    fixture = MockRender(ToastNotificationComponent);
    toastService = ngMocks.findInstance(ToastNotificationService);
  });

  it('Test Case #1 - should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Test Case #2 - should have the close icon defined', () => {
    expect(fixture.componentInstance.faXmark).toBeDefined();
  });
});
