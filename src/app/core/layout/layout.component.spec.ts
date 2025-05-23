import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';

import { LayoutComponent } from './layout.component';
import {
  TranslateModule,
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { MockComponent, MockModule, MockPipe, MockProvider } from 'ng-mocks';
import { ToastNotificationComponent } from '@/app/shared/components/toast-notification/toast-notification.component';
import { By } from '@angular/platform-browser';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let translateService: TranslateService;
  const langChangeEmitter = new EventEmitter();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockModule(TranslateModule),
        MockPipe(TranslatePipe, (value, params) => {
          if (value === 'common.footer') {
            return `© ${params?.['year']} Mocked Footer Text`;
          }
          return `MOCK_${value}`;
        }),
        LayoutComponent,
      ],
      providers: [
        MockProvider(TranslateService, {
          use: jasmine.createSpy('use'),
          setDefaultLang: jasmine.createSpy('setDefaultLang'),
          onLangChange: langChangeEmitter,
          instant: jasmine.createSpy('instant').and.callFake((key) => key),
        }),
      ],
    })
      .overrideComponent(LayoutComponent, {
        remove: { imports: [ToastNotificationComponent] },
        add: { imports: [MockComponent(ToastNotificationComponent)] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Case #2 - should set default language to EN', () => {
    expect(translateService.setDefaultLang).toHaveBeenCalledWith('en');
    expect(translateService.use).toHaveBeenCalledWith('en');
  });

  describe('Test Case #3 - Language Switching', () => {
    it('Test Case #3.1 - should have EN and ID language buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('nav button'));
      expect(buttons.length).toBe(2);
      expect(buttons[0].nativeElement.textContent.trim()).toBe('EN');
      expect(buttons[1].nativeElement.textContent.trim()).toBe('ID');
    });

    it('Test Case #3.2 - should highlight active language button', () => {
      component.language.set('en');
      fixture.detectChanges();

      const buttons = fixture.debugElement.queryAll(By.css('nav button'));
      expect(buttons[0].nativeElement.classList).toContain('text-blue-500');
      expect(buttons[1].nativeElement.classList).not.toContain('text-blue-500');
    });

    it('Test Case #3.3 - should call translate.use() when language button clicked', () => {
      const idButton = fixture.debugElement.queryAll(By.css('nav button'))[1];
      idButton.triggerEventHandler('click', null);

      expect(translateService.use).toHaveBeenCalledWith('id');
    });
  });

  it('Test Case #4 - should display current year in footer', () => {
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer.nativeElement.textContent).toContain(
      component.currentYear.toString()
    );
    expect(footer.nativeElement.textContent).toContain('Mocked Footer Text');
  });

  it('Test Case #5 - should contain mocked ToastNotificationComponent', () => {
    const toast = fixture.debugElement.query(
      By.directive(MockComponent(ToastNotificationComponent))
    );
    expect(toast).toBeTruthy();
  });

  it('Test Case #6 - should use translate pipe in footer', () => {
    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer.nativeElement.textContent).toContain('Mocked Footer Text');
  });
});
