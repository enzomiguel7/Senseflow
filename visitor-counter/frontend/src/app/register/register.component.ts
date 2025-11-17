import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  acceptTerms = false;
  message = '';
  isError = false;

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.showMessage('Preencha todos os campos', true);
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.showMessage('As senhas não conferem', true);
      return;
    }

    if (this.senha.length < 6) {
      this.showMessage('A senha deve ter no mínimo 6 caracteres', true);
      return;
    }

    if (!this.acceptTerms) {
      this.showMessage('Você deve aceitar os termos e condições', true);
      return;
    }

    this.http.post('http://localhost:4000/register', {
      username: this.nome,
      email: this.email,
      password: this.senha
    }).subscribe({
      next: () => {
        this.showMessage('Cadastro realizado com sucesso!', false);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => this.showMessage(err.error?.error || 'Erro ao criar conta', true)
    });
  }

  showMessage(msg: string, error: boolean) {
    this.message = msg;
    this.isError = error;
  }
}
