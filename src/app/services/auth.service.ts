import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api'; // Asegúrate que la URL sea correcta
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): void {
    const loginData = { usuario: username, password };

    // Cambié el manejo de la respuesta, ahora manejamos el error de manera más detallada
    this.http.post<{ jwt: string }>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (response) => {
        if (response.jwt) {
          localStorage.setItem('token', response.jwt); // Guarda el token
          
          this.isLoggedInSubject.next(true); // Actualiza el estado de autenticación
          this.router.navigate(['/']); // Redirige al home o página principal
        } else {
          console.error('No se recibió un token en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Usuario o contraseña incorrectos'); // Asegúrate de mostrar este mensaje en un lugar apropiado
      },
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    const token = localStorage.getItem('token');
    const decoded = token ? this.decodeToken(token) : null;
    console.log('Token decodificado:', decoded);
    return decoded?.name || '';
  }


  getUserRoleFromToken(): string {
    const token = localStorage.getItem('token');
    return token ? this.decodeToken(token)?.rol || '' : '';
  }


  private decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (e) {
      console.error('Error al decodificar el token', e);
      return null;
    }
  }

 getToken(): string {
    return localStorage.getItem('token') || '';  // Obtiene el token del localStorage
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  handleTokenInvalid(response: any) {
    if (response.codigo === -1) {
      console.warn('Token inválido o expirado:', response.mensaje);
      alert('Debe iniciar sesión nuevamente.');
      // this.logout();
    }
  }
}
