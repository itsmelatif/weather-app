import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-button',
  imports: [SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() loadingLabel: string = 'Loading...';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  clickBtn(): void {
    if(this.loading || this.disabled) return;
    this.onClick.emit();
  }

}
