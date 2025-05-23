import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRemove, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-button-icon',
  imports: [FontAwesomeModule],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss',
})
export class ButtonIconComponent {
  @Input() icon: IconDefinition = faRemove;
  @Input() type: 'success' | 'danger' | 'primary' | 'secondary' = 'secondary';
  @Input() disabled: boolean = false;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  clickBtn(): void {
    if (this.disabled) return;
    this.onClick.emit();
  }
}
