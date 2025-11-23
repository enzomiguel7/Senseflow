
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-termos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './termos.html',
  styleUrls: ['./termos.css']
})
export class TermosComponent {
  @Output() accepted = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  accept() {
    this.accepted.emit();
  }

  close() {
    this.closed.emit();
  }
}