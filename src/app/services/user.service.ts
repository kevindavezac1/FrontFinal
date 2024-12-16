import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../components/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/crearUsuario';  
  private getUsersUrl = 'http://localhost:4000/api/obtenerUsuarios';  
  private urlActualizar = 'http://localhost:4000/api'
  constructor(private http: HttpClient, private authService: AuthService) {}

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  obtenerUsuarios(): Observable<any> {
    const token = this.authService.getToken(); 
    const headers = new HttpHeaders().set('Authorization', token); 
    return this.http.get(this.getUsersUrl, { headers });
  }

  obtenerUsuarioPorId(id: number): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get(`${this.urlActualizar}/obtenerUsuario/${id}`, { headers });
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<any> {
    const token = this.authService.getToken(); 
    const headers = new HttpHeaders().set('Authorization', token); 
    
    return this.http.put(`${this.urlActualizar}/actualizarUsuario/${id}`, usuario, { headers });
  }

  
}
