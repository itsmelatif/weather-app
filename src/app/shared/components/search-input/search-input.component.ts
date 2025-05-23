import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  @Input() invalid: boolean = false;
  @Input() placeholder: string = '';
  @Input() control: FormControl = new FormControl('');
  @Output() enter: EventEmitter<string> = new EventEmitter<string>();
  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  faSearch = faSearch;
  faXmark = faXmark;

  onEnter(): void {
    this.enter.emit(this.control.value);
    this.control.setValue('');
  }

  onClear(): void {
    this.clear.emit();
    this.control.reset();
  }
}
