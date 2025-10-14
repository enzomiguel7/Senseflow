import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SensorService } from '../services/sensor.services';

@Component({
  selector: 'app-events-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './event-chart.html',
})
export class EventChart implements OnInit {
  chartOptions: any;

  constructor(private sensorService: SensorService) {}
ngOnInit() {
  this.sensorService.getEvents().subscribe((data: any[]) => {
    // Agrupa por horário
    const grouped = data.reduce((acc, ev) => {
      // Extrai hora e minuto do timestamp
      const date = new Date(ev.timestamp);
      const hourLabel = `${date.getHours().toString().padStart(2, '0')}:00`; // Agrupa por hora
      acc[hourLabel] = (acc[hourLabel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ordena os horários
    const sortedKeys = Object.keys(grouped).sort();

    this.chartOptions = {
      series: Object.values(grouped),
      chart: { type: 'pie' },
      labels: sortedKeys,
      title: { text: 'Distribuição de Eventos por Horário' },
    };
  });
}

}
