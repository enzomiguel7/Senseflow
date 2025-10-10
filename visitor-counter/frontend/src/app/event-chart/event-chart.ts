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
      // Agrupa por tipo e conta quantos eventos há de cada
      const grouped = data.reduce((acc, ev) => {
        acc[ev.type] = (acc[ev.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      this.chartOptions = {
        series: Object.values(grouped),
        chart: { type: 'pie' },
        labels: Object.keys(grouped),
        title: { text: 'Distribuição de Tipos de Evento' },
      };
    });
  }
}
