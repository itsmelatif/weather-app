import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerComponent } from './spinner.component';

describe('SpinnerComponent', () => {
  let component: SpinnerComponent;
  let fixture: ComponentFixture<SpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Case #2 - should have a spinner element', () => {
    const spinnerElement = fixture.nativeElement.querySelector('.spinner');
    expect(spinnerElement).toBeTruthy();
  });
});
