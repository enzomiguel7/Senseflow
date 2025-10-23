import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './content.html',
  styleUrls: ['./content.css']
})
export class ContentComponent {

  constructor(private router: Router) {}

  logout() {
    localStorage.removeItem('token');
    // Aqui você pode chamar seu serviço de autenticação para remover tokens/session
    console.log('Logout efetuado');
    this.router.navigate(['/login']);
  }

  goToEvents() {
    this.router.navigate(['/events']);
  }

  goToCharts() {
    this.router.navigate(['/charts']);
  }
}
