import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ContentComponent } from './content/content.component';
import { EventsComponent } from './events/events';
import {EventChart} from './event-chart/event-chart'
import { AuthGuard } from './auth-guard';
import { SaibaMaisComponent } from './saiba-mais/saiba-mais.component';
import { ComoFuncionaComponent } from './como-funciona/como-funciona.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'home', component: HomeComponent, data: { animation: 'HomePage' } },
  { path: 'saiba-mais', component: SaibaMaisComponent, data: { animation: 'SaibaMaisPage' } },
  { path: 'como-funciona', component: ComoFuncionaComponent, data: { animation: 'ComoFuncionaPage' } },
  { path: 'register', component: RegisterComponent, data: { animation: 'RegisterPage' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'content', component: ContentComponent, canActivate: [AuthGuard], data: { animation: 'ContentPage' } },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard], data: { animation: 'EventsPage' } },
  { path: 'charts', component: EventChart, canActivate:[AuthGuard], data: { animation: 'ChartsPage' } },
  { path: 'event-chart', component: EventChart, canActivate:[AuthGuard], data: { animation: 'EventChartPage' } },
];
