import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api'; // Asegúrate de que la URL sea correcta
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Método de login
  login(username: string, password: string): void {
    const loginData = { usuario: username, password };
  
    this.http.post<{ jwt: string; payload: any }>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (response) => {
        if (response.jwt) {
          localStorage.setItem('token', response.jwt); // Guarda el token
          localStorage.setItem('payload', JSON.stringify(response.payload)); // Guarda el payload
          this.isLoggedInSubject.next(true);
         
          this.router.navigate(['/']); // Redirige al home o página principal
        } else {
          console.error('No se recibió un token en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Usuario o contraseña incorrectos'); // Muestra el mensaje de error
      },
    });
  }
  

  // Método de logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('payload');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Obtener el nombre del usuario desde el payload
  getUserName(): string {
    const payload = localStorage.getItem('payload');
    return payload ? JSON.parse(payload).nombre || '' : '';
  }
  
  getUserRole(): string {
    const payload = localStorage.getItem('payload');
    return payload ? JSON.parse(payload).rol || '' : '';
  }
  

  // Obtener el token desde el localStorage
  getToken(): string {
     const token = localStorage.getItem('token') || '';
    return token;
  }

  // Verificar si existe un token
  private hasToken(): boolean {
    const token = this.getToken();
    console.log('Token encontrado:', token); // Agregar log para depuración
    return !!token;
  }

  // Manejar token inválido o expirado (si el backend lo notifica)
  handleTokenInvalid(response: any) {
    if (response.codigo === -1) {
      console.warn('Token inválido o expirado:', response.mensaje);
      alert('Debe iniciar sesión nuevamente.');
      this.logout(); // Cierra sesión automáticamente
    }
  }

  // Obtener el ID del usuario desde el payload
  getUserId(): number | null {
    const payload = localStorage.getItem('payload');
    console.log("Payload obtenido:", payload);
    return payload ? JSON.parse(payload).id || null : null;
  }
}
