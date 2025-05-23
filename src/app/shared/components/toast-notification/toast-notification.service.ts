import { computed, Injectable, signal } from '@angular/core';
import { IToastNotification } from '@shared/components/toast-notification/toast-notification.model';

@Injectable({
  providedIn: 'root',
})
export class ToastNotificationService {
  private toastsSignal = signal<IToastNotification[]>([]);
  readonly toasts = computed(() => this.toastsSignal());

  addToast(
    message: string,
    type: IToastNotification['type'] = 'info',
    duration = 3000
  ) {
    const id = Date.now();
    this.toastsSignal.update((toasts) => [...toasts, { id, message, type }]);
    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: number) {
    this.toastsSignal.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
