import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // 👈 importa aqui
import { SensorService } from '../services/sensor.services';

@Component({
  selector: 'app-events',
  standalone: true, // 👈 se ainda não tiver
  imports: [CommonModule, DatePipe], // 👈 adiciona aqui
  templateUrl: './events.html',
})
export class EventsComponent implements OnInit {
  events: any[] = [];

  constructor(private sensorService: SensorService) {}

  ngOnInit() {
    this.sensorService.getEvents().subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error('Erro ao buscar eventos:', err),
    });
  }
}
