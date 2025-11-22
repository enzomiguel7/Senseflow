import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, of, throwError } from 'rxjs'; // Adicionado 'of' e 'throwError'
import { catchError } from 'rxjs/operators'; // Para lidar com erros de forma limpa

export interface UserDetails {
  Username: string;
  Email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000';

  private userSource = new BehaviorSubject<UserDetails | null>(null);
  public userDetails$ = this.userSource.asObservable(); 

  constructor(private http: HttpClient) { }

  fetchUserDetails(): Observable<UserDetails | null> {
    const token = localStorage.getItem('token');
    
    // 💡 CORREÇÃO 1: Se não houver token, retorna um Observable que emite null.
    // Isso impede o envio de uma requisição HTTP inválida.
    if (!token) {
        console.warn('Token JWT não encontrado. Não foi possível buscar detalhes do usuário.');
        return of(null);
    }

    const headers = new HttpHeaders({ 
        'Authorization': `Bearer ${token}` 
    });

    return this.http.get<UserDetails>(`${this.apiUrl}/user-details`, { headers }).pipe(
      tap(data => {
        // Se a requisição for bem-sucedida, armazena no Subject
        this.userSource.next(data);
      }),
      // Captura o erro 403/401 e limpa o token (assume que o token expirou)
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          console.error('Sessão expirada ou token inválido. Limpando token local.');
          this.clearUser();
          localStorage.removeItem('token');
          // Você pode forçar um redirecionamento aqui, se quiser
        }
        return throwError(() => error); // Propaga o erro para ser tratado no loadUserDetailsIfEmpty
      })
    );
  }

  loadUserDetailsIfEmpty() {
    // Garante que o fetchUserDetails seja chamado apenas se não houver dados
    // e o token estiver presente para tentar a busca.
    if (this.userSource.getValue() === null && localStorage.getItem('token')) {
        this.fetchUserDetails().subscribe({
            error: (err) => console.error('Falha ao carregar detalhes do usuário:', err)
        });
    }
  }

  clearUser() {
    this.userSource.next(null);
  }
}