import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ButtonIconComponent } from '@shared/components/button-icon/button-icon.component';
import { ToastNotificationService } from '@shared/components/toast-notification/toast-notification.service';

@Component({
  selector: 'app-toast-notification',
  imports: [NgFor, FontAwesomeModule, ButtonIconComponent],
  templateUrl: './toast-notification.component.html',
  styleUrl: './toast-notification.component.scss',
})
export class ToastNotificationComponent {
  faXmark = faXmark;
  constructor(public toastService: ToastNotificationService) {}
}
