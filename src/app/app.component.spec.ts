import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '@core/layout/layout.component';
import { MockComponent, MockDirective } from 'ng-mocks';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockComponent(LayoutComponent)
      ],
      declarations: [
        AppComponent,
        MockDirective(RouterOutlet)
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Test Case #1 - should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`Test Case #2 - should have as title 'weather-dashboard'`, () => {
    expect(component.title).toEqual('weather-dashboard');
  });

  it('Test Case #3 - should render layout component', () => {
    const layout = fixture.debugElement.query(
      By.directive(MockComponent(LayoutComponent))
    );
    expect(layout).toBeTruthy();
  });

  it('Test Case #4 - should contain router outlet', () => {
    const routerOutlet = fixture.debugElement.query(
      By.directive(RouterOutlet)
    );
    expect(routerOutlet).toBeTruthy();
  });
});