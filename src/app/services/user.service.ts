import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/crearUsuario';  
  private getUsersUrl = 'http://localhost:4000/api/obtenerUsuarios';  

  constructor(private http: HttpClient, private authService: AuthService) {}

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  obtenerUsuarios(): Observable<any> {
    const token = this.authService.getToken(); // Obtiene el token desde AuthService
    const headers = new HttpHeaders().set('Authorization', token); // Solo envía el token, sin 'Bearer'
    return this.http.get(this.getUsersUrl, { headers });
  }
}
