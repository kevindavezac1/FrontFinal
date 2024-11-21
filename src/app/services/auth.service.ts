import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    if (token) {
      this.loggedInSubject.next(true); // El usuario está logueado si hay token
    } else {
      this.loggedInSubject.next(false); // Inicializa como no logueado si no hay token
    }
  }

  login(userName: string, password: string) {
    const loginData = { userName, password };
  
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, loginData)
      .pipe(
        catchError(error => {
          console.error('Error de autenticación capo', error);
          throw error;
        })
      ).subscribe(response => {
        const token = response.token;
        localStorage.setItem('token', token);
        this.loggedInSubject.next(true);
        this.router.navigate(['/']); // <- Esto solo ocurre tras un login exitoso
      });
  }
  

  logout() {
    localStorage.removeItem('token');
    this.loggedInSubject.next(false); // Cambiar el estado a no logueado
    this.router.navigate(['/']); // Redirigir a la pantalla principal
  }

  getUserName() {
    // Puedes obtener el nombre del usuario desde el token si lo necesitas
    // Aquí solo regresamos un valor estático por simplicidad
    return localStorage.getItem('userName') || '';
  }

    // Método privado para decodificar el token
    private decodeToken(token: string): any {
      try {
        return jwt_decode(token);
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
  
    // Método público para obtener el rol desde el token
    public getUserRoleFromToken(): string {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = this.decodeToken(token);  // Llamamos al método privado internamente
        return decodedToken?.role || '';
      }
      return '';
    }
}
function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}

