import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  
    this.http.post<{ jwt: string; payload: any }>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
  
        if (response.jwt && response.payload) {
     
          localStorage.setItem('token', response.jwt); 
          localStorage.setItem('payload', JSON.stringify(response.payload)); 
          this.isLoggedInSubject.next(true);
          
          console.log('Token y Payload guardados en localStorage');
          this.router.navigate(['/']);
        } else {
          console.error('No se recibió un token o payload en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión', error);
        alert('Usuario o contraseña incorrectos');
      },
    });
  }
  
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('payload');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/']);
  }

  getUserName(): string {
    const payload = localStorage.getItem('payload');
    return payload ? JSON.parse(payload).nombre || '' : '';
  }
  
  getUserRole(): string {
    const payload = localStorage.getItem('payload');
    return payload ? JSON.parse(payload).rol || '' : '';
  }
  


  getToken(): string {
     const token = localStorage.getItem('token') || '';
    return token;
  }


  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token); 
    return !!token; 
  }
  


  handleTokenInvalid(response: any) {
    if (response.codigo === -1) {
      console.warn('Token inválido o expirado:', response.mensaje);
      alert('Debe iniciar sesión nuevamente.');
      this.logout(); // Cierra sesión automáticamente
    }
  }

 
  getUserId(): number | null {
    const payload = localStorage.getItem('payload');
    console.log('Payload recuperado:', payload); 
    return payload ? JSON.parse(payload).id || null : null;
  }
  
}
