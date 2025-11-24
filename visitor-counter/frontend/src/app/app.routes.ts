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
import { CentralDeAjuda } from './central-de-ajuda/central-de-ajuda';
import { TermosComponent } from './termos-condicoes/termos.component';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'saiba-mais', component: SaibaMaisComponent },
  { path: 'como-funciona', component: ComoFuncionaComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'content', component: ContentComponent, canActivate: [AuthGuard] },
  { path: 'events', component: EventsComponent, canActivate: [AuthGuard]},
  { path: 'charts', component: EventChart, canActivate:[AuthGuard]},
  { path: 'event-chart', component: EventChart, canActivate:[AuthGuard]},
  { path: 'central-de-ajuda', component: CentralDeAjuda, canActivate:[AuthGuard]},
  { path: 'termos-condicoes', component: TermosComponent},
];
