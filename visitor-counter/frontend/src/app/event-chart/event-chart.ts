import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SensorService } from '../services/sensor.services';
import { Router } from '@angular/router';



@Component({
  selector: 'app-events-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './event-chart.html',
  styleUrls: ['./event-chart.css'],
  encapsulation: ViewEncapsulation.None

})
export class EventChart implements OnInit {
  chartOptions: any;

  constructor(private sensorService: SensorService, private router: Router) {}

  redirectToContent() {
    this.router.navigate(['/content']);
  }

  redirectToEvents() {
    this.router.navigate(['/events']);
  }

  redirectToSettings() {
    this.router.navigate(['/charts']);
  }

  ngOnInit() {
    this.sensorService.getEvents().subscribe((data: any[]) => {
      const grouped = data.reduce((acc, ev) => {
        // Evita entradas faltando dados
        if (!ev || !ev.date_ || !ev.time_) return acc;

        // Parse de date_ suportando "DD/MM/YYYY" e "YYYY-MM-DD"
        let year: number, month: number, day: number;
        if (ev.date_.includes('/')) {
          const parts = ev.date_.split('/');
          if (parts.length !== 3) return acc;
          day = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          year = parseInt(parts[2], 10);
        } else if (ev.date_.includes('-')) {
          const parts = ev.date_.split('-');
          if (parts.length !== 3) return acc;
          year = parseInt(parts[0], 10);
          month = parseInt(parts[1], 10);
          day = parseInt(parts[2], 10);
        } else {
          return acc;
        }

        // Parse de time_ (HH:mm[:ss])
        const tparts = ev.time_.split(':');
        const hour = parseInt(tparts[0] || '0', 10);
        const minute = parseInt(tparts[1] || '0', 10);
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) return acc;

        // Cria Date local a partir dos componentes (mais confiável que parsing direto)
        const dt = new Date(year, month - 1, day, hour, minute);

        // Se quiser ajustar para GMT-3, faça aqui; caso os timestamps já estejam em horário local,
        // use dt.getHours(). Exemplo sem ajuste:
        const brasilHour = dt.getHours();

        const hourLabel = `${brasilHour.toString().padStart(2, '0')}:00`;
        acc[hourLabel] = (acc[hourLabel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        const aHour = parseInt(a.split(':')[0], 10);
        const bHour = parseInt(b.split(':')[0], 10);
        return aHour - bHour;
      });

      this.chartOptions = {
        series: sortedKeys.map(k => grouped[k]),
        chart: { type: 'pie' },
        labels: sortedKeys,
        title: { text: 'Distribuição de Eventos por Horário' },
      };
    });
  }
}
