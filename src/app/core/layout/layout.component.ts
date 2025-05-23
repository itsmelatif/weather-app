import { Component, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastNotificationComponent } from '@shared/components/toast-notification/toast-notification.component';

@Component({
  selector: 'app-layout',
  imports: [TranslateModule, ToastNotificationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  language = signal('en');
  currentYear = new Date().getFullYear();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe(event => {
      this.language.set(event.lang);
    });
  }

  setLanguage(language: 'en' | 'id'): void {
    this.translate.use(language);
  }
}
