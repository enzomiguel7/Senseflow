import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SensorService } from '../services/sensor.services';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserDetails, UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ThemeService } from '../services/theme.service';
import { ToastService } from '../services/toast.service';



@Component({
  selector: 'app-events-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule],
  templateUrl: './event-chart.html',
  styleUrls: ['./event-chart.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventChart implements OnInit {
  chartOptions: any;
  userDetails$!: Observable<UserDetails | null>;
  active: string = 'settings';
  darkMode$!: Observable<boolean>;
  
  // Controle do modal de senha
  showPasswordModal = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Controle do modal de confirmação de exclusão
  showDeleteModal = false;

  // Controle do modal de reset de registros
  showResetModal = false;

  constructor(
    private sensorService: SensorService, 
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private themeService: ThemeService,
    private toastService: ToastService
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

  redirectToHelp() {
    this.router.navigate(['/central-de-ajuda']);
  }

  contactSupport() {
    window.location.href = 'mailto:senseflow80@gmail.com?subject=Suporte SenseFlow - Solicitação de Ajuda&body=Olá equipe SenseFlow,%0D%0A%0D%0AEstou entrando em contato para solicitar ajuda com:%0D%0A%0D%0A';
  }

  
logout() {
    this.userService.clearUser(); // Limpa o estado
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  // 🔥 Função para excluir conta chamando o backend
  deleteAccount() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDeleteAccount() {
    this.showDeleteModal = false;
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastService.error("Você precisa estar logado para excluir a conta.");
      return;
    }

    // Aqui assumimos que o JWT tem o id do usuário
    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      this.toastService.error("Erro ao identificar usuário.");
      return;
    }

    this.http.delete(`http://localhost:4000/delete-account/${userId}`).subscribe({
      next: () => {
        this.toastService.success("Conta excluída com sucesso!");
        localStorage.removeItem('token');
        setTimeout(() => {
          this.router.navigate(['/home']);
          this.userService.clearUser();
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error("Não foi possível excluir a conta. Tente novamente mais tarde.");
      }
    });
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

    this.userDetails$ = this.userService.userDetails$;
    this.darkMode$ = this.themeService.darkMode$;

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
    this.showResetModal = true;
  }

  closeResetModal() {
    this.showResetModal = false;
  }

  confirmResetEvents() {
    this.showResetModal = false;
    this.sensorService.resetEvents().subscribe({
      next: (res) => {
        this.toastService.success(res.message || "Registros apagados com êxito.");
      },
      error: (err) => {
        console.error(err);
        this.toastService.error("Ocorreu um erro ao resetar os registros.");
      }
    });
  }

  // 🔑 Funções do Modal de Alteração de Senha
  openPasswordModal() {
    this.showPasswordModal = true;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  confirmPasswordChange() {
    // Validações
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toastService.warning('Por favor, preencha todos os campos.');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.warning('As senhas não coincidem.');
      return;
    }

    // Requisição para o servidor
    const token = localStorage.getItem('token');
    if (!token) {
      this.toastService.error('Você precisa estar logado.');
      return;
    }

    const userId = this.getUserIdFromToken(token);
    if (!userId) {
      this.toastService.error('Erro ao identificar usuário.');
      return;
    }

    this.http.put(`http://localhost:4000/change-password/${userId}`, {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.toastService.success('Senha alterada com sucesso!');
        this.closePasswordModal();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.error?.message || 'Não foi possível alterar a senha. Verifique a senha atual.');
      }
    });
  }

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  // 📊 Função para exportar relatório de eventos
  exportReport() {
    this.sensorService.getEvents().subscribe({
      next: (data: any[]) => {
        let csvContent = '';
        
        if (!data || data.length === 0) {
          // Se não há eventos, cria relatório com informações do usuário
          this.userDetails$.subscribe(user => {
            const hoje = new Date().toLocaleDateString('pt-BR');
            csvContent = 'RELATÓRIO SENSEFLOW\n';
            csvContent += `Gerado em: ${hoje}\n`;
            csvContent += `Usuário: ${user?.Username || 'N/A'}\n`;
            csvContent += `Email: ${user?.Email || 'N/A'}\n\n`;
            csvContent += 'Status: Nenhum evento registrado no momento.\n';
            
            this.downloadCSV(csvContent);
          });
          return;
        }

        // Se há eventos, criar CSV com os dados
        csvContent = 'Data,Horário,Tipo de Evento\n';
        const rows = data.map(ev => 
          `${ev.date_ || 'N/A'},${ev.time_ || 'N/A'},${ev.event_type || 'Entrada'}`
        ).join('\n');
        
        csvContent += rows;
        this.downloadCSV(csvContent);
      },
      error: (err) => {
        // Se houver erro, cria relatório básico
        console.error('Erro ao buscar eventos:', err);
        this.userDetails$.subscribe(user => {
          const hoje = new Date().toLocaleDateString('pt-BR');
          let csvContent = 'RELATÓRIO SENSEFLOW\n';
          csvContent += `Gerado em: ${hoje}\n`;
          csvContent += `Usuário: ${user?.Username || 'N/A'}\n`;
          csvContent += `Email: ${user?.Email || 'N/A'}\n\n`;
          csvContent += 'Status: Sistema conectado e funcionando.\n';
          
          this.downloadCSV(csvContent);
        });
      }
    });
  }

  // Função auxiliar para download do CSV
  private downloadCSV(content: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_senseflow_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.toastService.success('Relatório exportado com sucesso!');
  }
}
