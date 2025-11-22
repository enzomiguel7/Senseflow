import { RouterOutlet } from '@angular/router';
import { Component, OnInit, signal} from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class AppComponent implements OnInit {
  constructor(private userService: UserService) {}

  protected readonly title = signal('visitor-counter');

  ngOnInit() {
    // Inicia a carga dos dados assim que a aplicação é carregada.
    // O serviço agora garante que essa chamada alimentará todos os assinantes.
    this.userService.loadUserDetailsIfEmpty(); 
  }
}