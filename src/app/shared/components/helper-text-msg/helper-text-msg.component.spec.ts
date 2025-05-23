import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperTextMsgComponent } from './helper-text-msg.component';

describe('HelperTextMsgComponent', () => {
  let component: HelperTextMsgComponent;
  let fixture: ComponentFixture<HelperTextMsgComponent>;
  let spanElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperTextMsgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelperTextMsgComponent);
    component = fixture.componentInstance;
    spanElement = fixture.nativeElement.querySelector('span');
    fixture.detectChanges();
  });

  it('Test Case #1 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('Test Case #2 - should display the message input', () => {
    const testMessage = 'helper message';
    component.message = testMessage;
    fixture.detectChanges();

    expect(spanElement.textContent).toContain(testMessage);
  });

  describe('Test Case #3 - Type Classes', () => {
    it('Test Case #3.1 - should apply class for default', () => {
      expect(spanElement.classList.contains('text-gray-500')).toBeTrue();
    });

    it('Test Case #3.2 - apply class for error', () => {
      component.type = 'error';
      fixture.detectChanges();
      expect(spanElement.classList.contains('text-red-500')).toBeTrue();
    });

    it('Test Case #3.3 - apply class for success', () => {
      component.type = 'success';
      fixture.detectChanges();
      expect(spanElement.classList.contains('text-green-500')).toBeTrue();
    });

    it('Test Case #3.4 - apply class for warning', () => {
      component.type = 'warning';
      fixture.detectChanges();
      expect(spanElement.classList.contains('text-yellow-500')).toBeTrue();
    });

    it('Test Case #3.5 - apply class for default', () => {
      component.type = 'default';
      fixture.detectChanges();
      expect(spanElement.classList.contains('text-gray-500')).toBeTrue();
    });
  });

});
