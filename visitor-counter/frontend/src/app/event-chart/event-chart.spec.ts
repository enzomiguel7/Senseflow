import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SensorService } from '../services/sensor.services';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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

  redirectToContent() { this.router.navigate(['/content']); }
  redirectToEvents() { this.router.navigate(['/events']); }
  redirectToSettings() { this.router.navigate(['/charts']); }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  // 🔥 Função definitiva para excluir conta
  deleteAccount() {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível.")) return;

    const token = localStorage.getItem('token');
    if (!token) { alert("Você precisa estar logado para excluir a conta."); return; }

    const userId = this.getUserIdFromToken(token);
    if (!userId) { alert("Erro ao identificar usuário."); return; }

    this.http.delete(`http://localhost:4000/delete-account/${userId}`).subscribe({
      next: () => {
        alert("Conta excluída com sucesso!");
        localStorage.removeItem('token');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.message || "Não foi possível excluir a conta. Tente novamente mais tarde.");
      }
    });
  }

  // Extrai o ID do usuário do JWT
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
        if (!ev?.date_ || !ev?.time_) return acc;

        let year: number, month: number, day: number;
        if (ev.date_.includes('/')) [day, month, year] = ev.date_.split('/').map(Number);
        else if (ev.date_.includes('-')) [year, month, day] = ev.date_.split('-').map(Number);
        else return acc;

        const [hour, minute] = ev.time_.split(':').map(Number);
        if ([year, month, day, hour].some(isNaN)) return acc;

        const dt = new Date(year, month - 1, day, hour, minute);
        const hourLabel = `${dt.getHours().toString().padStart(2,'0')}:00`;
        acc[hourLabel] = (acc[hourLabel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const sortedKeys = Object.keys(grouped).sort((a,b) => parseInt(a) - parseInt(b));
      this.chartOptions = {
        series: sortedKeys.map(k => grouped[k]),
        chart: { type: 'pie' },
        labels: sortedKeys,
        title: { text: 'Distribuição de Eventos por Horário' }
      };
    });
  }

  onResetEvents() {
    if (!confirm("Tem certeza que deseja apagar todos os registros?")) return;

    this.sensorService.resetEvents().subscribe({
      next: res => alert(res.message || "Registros apagados com êxito."),
      error: err => { console.error(err); alert("Ocorreu um erro ao resetar os registros."); }
    });
  }
}
