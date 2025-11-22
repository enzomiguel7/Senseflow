import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  senha = '';
  message = '';
  isError = false;
  rememberMe = false;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {}

  onLogin() {
    if (!this.email || !this.senha) {
      this.showMessage('Preencha todos os campos', true);
      return;
    }

    this.http.post<{ token: string }>('http://localhost:4000/login', {
      email: this.email,
      password: this.senha
    }).subscribe({
      next: (res) => {
        // ✅ CORREÇÃO: Salvar o token PRIMEIRO.
        localStorage.setItem('token', res.token);
        
        // ✅ CHAMA a busca AGORA que o token está garantido no localStorage.
        this.userService.loadUserDetailsIfEmpty(); 
        
        this.showMessage('Login realizado com sucesso!', false);
        setTimeout(() => this.router.navigate(['/content']), 1000);
      },
      error: (err) => this.showMessage(err.error?.error || 'Erro ao fazer login', true)
    });
  }

  showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}