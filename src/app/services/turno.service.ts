import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  // Importar el servicio de autenticación

@Injectable({
  providedIn: 'root',
})
export class TurnoService {
  private apiUrl = 'http://localhost:4000/api'; // Asegúrate que esta URL sea correcta

  constructor(private http: HttpClient, private authService: AuthService) {}


  // Método para obtener especialidades
  obtenerEspecialidades(): Observable<any> {
    const token = this.authService.getToken(); 
    const headers = new HttpHeaders().set('Authorization', token); 
    return this.http.get(`${this.apiUrl}/obtenerEspecialidades`, { headers });
  }
  
}





