import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.message = 'Preencha todos os campos';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.message = 'As senhas não conferem';
      return;
    }

    this.http.post('http://localhost:4000/register', {
      username: this.nome,
      email: this.email,
      password: this.senha
    }).subscribe({
      next: () => {
        this.message = 'Cadastro realizado com sucesso!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => this.message = err.error?.error || 'Erro no cadastro'
    });
  }
}
