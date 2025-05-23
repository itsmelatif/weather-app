import { fakeAsync, TestBed } from '@angular/core/testing';
import { tick } from '@angular/core/testing';

import { ToastNotificationService } from './toast-notification.service';

describe('ToastNotificationService', () => {
  let service: ToastNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastNotificationService);

    service['toastsSignal']().forEach((toast) => {
      service.removeToast(toast.id);
    });
  });

  it('Test Case #1 - should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test Case #2 - toasts computed property', () => {
    it('Test Case #2.1 - should initially be empty', () => {
      expect(service.toasts()).toEqual([]);
    });

    it('Test Case #2.2 - should reflect added toasts', () => {
      service.addToast('Test message');
      expect(service.toasts().length).toBe(1);
      expect(service.toasts()[0].message).toBe('Test message');
    });
  });

  describe('Test Case #3 - addToast', () => {
    it('Test Case #3.1 - should add a toast with default type "info"', () => {
      service.addToast('Test message');
      const toast = service.toasts()[0];
      expect(toast.type).toBe('info');
    });

    it('Test Case #3.2 - should add a toast with specified type', () => {
      service.addToast('Error message', 'error');
      const toast = service.toasts()[0];
      expect(toast.type).toBe('error');
    });

    it('Test Case #3.3 - should generate unique ids for each toast', () => {
      const originalDateNow = Date.now;
      let mockTime = 1000;
      Date.now = () => (mockTime += 1000);

      service.addToast('First message');
      service.addToast('Second message');
      const toasts = service.toasts();
      expect(toasts[0].id).not.toBe(toasts[1].id);

      Date.now = originalDateNow;
    });

    it('Test Case #3.4 - should automatically remove toast after specified duration', (done) => {
      const shortDuration = 100;
      service.addToast('Temporary message', 'info', shortDuration);

      expect(service.toasts().length).toBe(1);

      setTimeout(() => {
        expect(service.toasts().length).toBe(0);
        done();
      }, shortDuration + 10);
    });
  });
});
