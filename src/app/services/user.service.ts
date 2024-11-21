import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/crearUsuario';  // URL del endpoint de creación de usuario

  constructor(private http: HttpClient) {}

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
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

