import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipDirective } from './tooltip.directive';

@Component({
  standalone: true,
  template: `<button [appTooltip]="'Hello World'" tooltipPosition="top">
    Hover me
  </button>`,
  imports: [TooltipDirective],
})
class TestComponent {}

describe('TooltipDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('Test Case #1 - should show tooltip on mouseenter', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();

    const tooltip = document.body.querySelector('[data-tooltip]');
    expect(tooltip?.textContent).toBe('Hello World');
  });

  it('Test Case #2 - should hide tooltip on mouseleave', () => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('mouseenter', {});
    fixture.detectChanges();

    button.triggerEventHandler('mouseleave', {});
    fixture.detectChanges();

    const tooltip = document.body.querySelector('[data-tooltip]');
    expect(tooltip).toBeNull();
  });
});
