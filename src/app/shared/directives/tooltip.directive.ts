import {
  Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

  private tooltip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    if (!this.tooltip) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.hideTooltip();
  }

  private showTooltip() {
    this.tooltip = this.renderer.createElement('span');
    this.tooltip!.innerText = this.tooltipText;
    this.renderer.setAttribute(this.tooltip!, 'data-tooltip', '');

    this.renderer.appendChild(document.body, this.tooltip!);
    this.renderer.setStyle(this.tooltip!, 'position', 'fixed');
    this.renderer.setStyle(this.tooltip!, 'background', '#333');
    this.renderer.setStyle(this.tooltip!, 'color', '#fff');
    this.renderer.setStyle(this.tooltip!, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltip!, 'border-radius', '4px');
    this.renderer.setStyle(this.tooltip!, 'font-size', '12px');
    this.renderer.setStyle(this.tooltip!, 'z-index', '1000');
    this.renderer.setStyle(this.tooltip!, 'pointer-events', 'none');

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip!.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (this.tooltipPosition) {
      case 'top':
        top = hostPos.top - tooltipPos.height - 5;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = hostPos.bottom + 5;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
        break;
      case 'left':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.left - tooltipPos.width - 5;
        break;
      case 'right':
        top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
        left = hostPos.right + 5;
        break;
    }

    this.renderer.setStyle(this.tooltip!, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltip!, 'left', `${left}px`);
  }

  private hideTooltip() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
  }

  ngOnDestroy() {
    this.hideTooltip();
  }
}
