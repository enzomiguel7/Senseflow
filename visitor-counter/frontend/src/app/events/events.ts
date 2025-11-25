import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common'; // 👈 importa aqui
import { SensorService } from '../services/sensor.services';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserDetails, UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { ThemeService } from '../services/theme.service';


@Component({
  selector: 'app-events',
  standalone: true, // 👈 se ainda não tiver
  imports: [CommonModule, DatePipe], // 👈 adiciona aqui
  templateUrl: './events.html',
  styleUrls: ['./events.css'],
  encapsulation: ViewEncapsulation.None

})
export class EventsComponent implements OnInit {
  events: any[] = [];

    userDetails$!: Observable<UserDetails | null>;
  

  constructor(
    private sensorService: SensorService, 
    private router: Router, 
    private userService: UserService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {

    this.userDetails$ = this.userService.userDetails$;

    this.sensorService.getEvents().subscribe({
      next: (data) => (this.events = data),
      error: (err) => console.error('Erro ao buscar eventos:', err),
    });
    
  }

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
    this.userService.clearUser();
  }
}
