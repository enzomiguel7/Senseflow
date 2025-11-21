import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SensorService } from '../services/sensor.services';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(
    private sensorService: SensorService, 
    private router: Router,
    private http: HttpClient
  ) {}

  redirectToContent() {
    this.router.navigate(['/content']);
  }

  redirectToEvents() {
    this.router.navigate(['/events']);
  }

  redirectToSettings() {
    this.router.navigate(['/charts']);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  // 🔥 Função para excluir conta chamando o backend
  deleteAccount() {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Você precisa estar logado para excluir a conta.");
        return;
      }

      // Aqui assumimos que o JWT tem o id do usuário
      const userId = this.getUserIdFromToken(token);
      if (!userId) {
        alert("Erro ao identificar usuário.");
        return;
      }

      this.http.delete(`http://localhost:4000/delete-account/${userId}`).subscribe({
        next: () => {
          alert("Conta excluída com sucesso!");
          localStorage.removeItem('token');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error(err);
          alert("Não foi possível excluir a conta. Tente novamente mais tarde.");
        }
      });
    }
  }

  // função auxiliar para extrair id do token JWT
  private getUserIdFromToken(token: string): string | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch {
      return null;
    }
  }

  ngOnInit() {
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

  onResetEvents() {
    if (confirm("Tem certeza que deseja apagar todos os registros?")) {
      this.sensorService.resetEvents().subscribe({
        next: (res) => {
          alert(res.message || "Registros apagados com êxito.");
        },
        error: (err) => {
          console.error(err);
          alert("Ocorreu um erro ao resetar os registros.");
        }
      });
    }
  }
}
