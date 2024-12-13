import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Asegúrate de tener esto importado

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private apiUrl = 'http://localhost:4000/api'; // Tu URL de la API

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headersConfig = {
      'Content-Type': 'application/json',
      'Authorization': token ? token : '', // Solo agrega el token sin "Bearer"
    };
    return new HttpHeaders(headersConfig);
  }
  
  // Método para crear una agenda
  crearAgenda(agenda: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crearAgenda`, agenda, {
      headers: this.getHeaders()
    });
  }
}
