import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api'; // Base URL del backend
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken()); // Comprueba si hay un token al iniciar
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): void {
    const loginData = { usuario: username, password };
    this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginData).subscribe(
      response => {
        localStorage.setItem('token', response.token);
        this.isLoggedInSubject.next(true); // Actualiza el estado de autenticación
        this.router.navigate(['/']);
      },
      error => {
        console.error('Error al iniciar sesión', error);
      }
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false); // Actualiza el estado de autenticación
    this.router.navigate(['']);
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.nombre || ''; // Asegúrate de que 'nombre' exista en tu token
    }
    return '';
  }

  getUserRoleFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken?.role || '';
    }
    return '';
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token'); // Devuelve true si existe el token
  }
}
