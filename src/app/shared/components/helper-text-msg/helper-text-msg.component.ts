import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-helper-text-msg',
  imports: [],
  templateUrl: './helper-text-msg.component.html',
  styleUrl: './helper-text-msg.component.scss',
})
export class HelperTextMsgComponent {
  @Input() message: string = '';
  @Input() type: 'error' | 'success' | 'warning' | 'default' = 'default';
}
