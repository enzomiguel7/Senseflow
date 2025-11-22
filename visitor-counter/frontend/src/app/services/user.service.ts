// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs'; // Importar BehaviorSubject e tap

export interface UserDetails {
  Username: string;
  Email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000';

  // 1. BehaviorSubject para armazenar e emitir o estado atual do usuário
  // Inicializamos com um objeto vazio ou null até que os dados sejam carregados.
  private userSource = new BehaviorSubject<UserDetails | null>(null);
  
  // 2. Observable público para os componentes se inscreverem
  public userDetails$ = this.userSource.asObservable(); 

  constructor(private http: HttpClient) { }

  fetchUserDetails(): Observable<UserDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    return this.http.get<UserDetails>(`${this.apiUrl}/user-details`, { headers }).pipe(
      // 3. Ao receber os dados do backend, armazena-os no BehaviorSubject
      tap(data => {
        this.userSource.next(data);
      })
    );
  }

  // Novo método para buscar os dados apenas se ainda não tivermos
  loadUserDetailsIfEmpty() {
    // Verifica se os dados já foram carregados (se o valor não for null)
    if (!this.userSource.getValue()) {
      this.fetchUserDetails().subscribe({
        error: (err) => console.error('Falha ao carregar detalhes do usuário:', err)
      });
    }
  }

  // Opcional: Limpar dados ao deslogar
  clearUser() {
    this.userSource.next(null);
  }
}