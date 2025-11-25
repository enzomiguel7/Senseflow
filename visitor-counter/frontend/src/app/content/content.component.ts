import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SensorService } from '../services/sensor.services';
import { UserDetails, UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './content.html',
  styleUrls: ['./content.css'],
  encapsulation: ViewEncapsulation.None
})
export class ContentComponent implements OnInit {
  chartOptions: any = null;
  userDetails$!: Observable<UserDetails | null>;

  constructor(
    private router: Router,
    private sensorService: SensorService,
    private userService: UserService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadChartData();

    this.userDetails$ = this.userService.userDetails$;

  }

  loadChartData() {
    this.sensorService.getEvents().subscribe((data: any[]) => {
      const grouped = data.reduce((acc, ev) => {
        if (!ev || !ev.date_ || !ev.time_) return acc;

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
        } else return acc;

        const tparts = ev.time_.split(':');
        const hour = parseInt(tparts[0] || '0', 10);
        const minute = parseInt(tparts[1] || '0', 10);
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour)) return acc;

        const dt = new Date(year, month - 1, day, hour, minute);
        const brasilHour = dt.getHours();

        const hourLabel = `${brasilHour.toString().padStart(2, '0')}:00`;
        acc[hourLabel] = (acc[hourLabel] || 0) + 1;

        return acc;
      }, {} as Record<string, number>);

      const sortedKeys = Object.keys(grouped).sort((a, b) => {
        return parseInt(a) - parseInt(b);
      });

      if (sortedKeys.length === 0) {
        this.chartOptions = null;
        return;
      }

      this.chartOptions = {
        series: sortedKeys.map(k => grouped[k]),
        chart: {
          type: 'pie',
          height: 480
        },
        labels: sortedKeys,
        title: {
          text: 'Distribuição de Eventos por Horário'
        },
        legend: {
          position: 'right',
          fontSize: '18px',
          markers: {
            width: 16,
            height: 16
          },
          itemMargin: {
            horizontal: 12,
            vertical: 12
          }
        },
        dataLabels: {
          style: {
            fontSize: '18px',
            fontWeight: 'bold'
          }
        }
      };
    });
  }
  

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    this.userService.clearUser();
  }

  goToEvents() {
    this.router.navigate(['/events']);
  }

    redirectToSettings() {
    this.router.navigate(['/charts']);
  }
}
