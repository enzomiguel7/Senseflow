import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  senha = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (!this.email || !this.senha) {
      this.message = 'Preencha todos os campos';
      return;
    }

    this.http.post<{ token: string }>('http://localhost:4000/login', {
      email: this.email,
      password: this.senha
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/content']);
      },
      error: (err) => this.message = err.error?.error || 'Erro no login'
    });
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }
}
