import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

interface DecodedToken {
  nombre?: string;
  rol?: string;
  exp?: number; // Fecha de expiración opcional
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): void {
    const loginData = { usuario: username, password };
    this.http.post<{ jwt: string }>(`${this.apiUrl}/login`, loginData).subscribe(
      (response) => {
        if (response.jwt) {
          console.log('Token recibido:', response.jwt); // Verifica si el token se recibe
          localStorage.setItem('token', response.jwt); // Guarda el token
          console.log('Token guardado en localStorage:', localStorage.getItem('token')); // Verifica si se guarda correctamente
          this.isLoggedInSubject.next(true); // Actualiza el estado de autenticación
          this.router.navigate(['/']); // Redirige al home o página principal
        } else {
          console.error('No se recibió un token en la respuesta');
        }
      },
      (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Usuario o contraseña incorrectos');
      }
    );
  }
  

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      console.log('Token decodificado para nombre:', decodedToken); // Asegúrate de que el token se decodifica correctamente
      return decodedToken?.name || ''; // Devuelve el nombre del usuario (corrección aquí)
    }
    return '';
  }
  
  getUserRoleFromToken(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      console.log("Token decodificado en getUserRoleFromToken:", decodedToken);
      return decodedToken?.rol || ''; // Asegúrate de que `rol` sea el campo correcto
    }
    return '';
  }
  
  private decodeToken(token: string): any {
    try {
      const decoded = jwt_decode(token); // Decodifica el token
      console.log('Token decodificado:', decoded); // Verifica el contenido del token decodificado
      return decoded;
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
