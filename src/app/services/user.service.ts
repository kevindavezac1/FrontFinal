import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioResponse } from '../components/interfaces/usuario-response.interface';
import { AuthService } from './auth.service';  // Importar AuthService para utilizar métodos relacionados con el token

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

  getUsers(filters: any): Observable<UsuarioResponse> {
    let params = new HttpParams();
    
    // Añadir filtros a los parámetros de la solicitud si existen
    if (filters.nombre) {
      params = params.set('nombre', filters.nombre);
    }
    if (filters.apellido) {
      params = params.set('apellido', filters.apellido);
    }
    if (filters.rol) {
      params = params.set('rol', filters.rol);
    }

    // Obtener el token del localStorage usando el servicio AuthService
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('Token no encontrado');
      throw new Error('Token no encontrado');
    }

    // Configurar los headers para enviar el token de autorización
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`  
    });

    // Realizar la solicitud GET con los parámetros y headers
    return this.http.get<UsuarioResponse>(this.getUsersUrl, { params, headers });
  }
}
